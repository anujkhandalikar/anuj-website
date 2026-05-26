import Anthropic from "@anthropic-ai/sdk";
import { getSupabase } from "@/lib/chotu/supabase";
import { buildSystemPrompt } from "@/lib/chotu/prompt";
import {
  getClientIP,
  incrementAndCheck,
  MESSAGES_PER_IP_PER_DAY,
} from "@/lib/chotu/rate-limit";
import {
  addCostINR,
  isOverHardCap,
  usageCostINR,
  HARD_CAP_INR,
} from "@/lib/chotu/cost";

export const runtime = "nodejs";

const MODEL = "claude-sonnet-4-6";
const MAX_OUTPUT_TOKENS = 800;

type Body = {
  conversation_id?: string;
  message?: string;
};

type Msg = { role: "user" | "assistant"; content: string };

function jsonError(status: number, error: string, extras: object = {}) {
  return new Response(JSON.stringify({ error, ...extras }), {
    status,
    headers: { "content-type": "application/json" },
  });
}

async function loadHistory(conversationId: string): Promise<Msg[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("vipassana_messages")
    .select("role, content")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })
    .limit(50);
  if (error || !data) return [];
  return data.map((d) => ({ role: d.role as Msg["role"], content: d.content }));
}

async function saveMessage(
  conversationId: string,
  role: "user" | "assistant",
  content: string,
) {
  const supabase = getSupabase();
  if (!supabase) return;
  await supabase.from("vipassana_messages").insert({
    conversation_id: conversationId,
    role,
    content,
  });
  await supabase
    .from("vipassana_conversations")
    .update({ last_message_at: new Date().toISOString() })
    .eq("id", conversationId);
}

export async function POST(request: Request) {
  if (await isOverHardCap()) {
    return jsonError(
      503,
      "budget_exceeded",
      {
        message:
          "Chotu's API budget for the Vipassana period has been used up. Drop Anuj an email instead — anujkhandalikar027@gmail.com.",
      },
    );
  }

  const ip = getClientIP(request);
  const { allowed, count } = await incrementAndCheck(ip);
  if (!allowed) {
    return jsonError(
      429,
      "rate_limited",
      {
        message: `You've sent ${count} messages today. Daily limit is ${MESSAGES_PER_IP_PER_DAY}. Try again tomorrow.`,
      },
    );
  }

  const body: Body = await request.json().catch(() => ({}));
  const conversationId = body.conversation_id;
  const userMessage = body.message?.trim();

  if (!conversationId) return jsonError(400, "missing_conversation_id");
  if (!userMessage) return jsonError(400, "missing_message");
  if (userMessage.length > 4000) return jsonError(400, "message_too_long");

  const history = await loadHistory(conversationId);
  await saveMessage(conversationId, "user", userMessage);

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return jsonError(500, "missing_anthropic_key");
  const client = new Anthropic({ apiKey });

  const systemPrompt = buildSystemPrompt();

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      let assembled = "";
      let usage: Anthropic.Messages.Usage | null = null;

      try {
        const messages: Anthropic.Messages.MessageParam[] = [
          ...history.map((m) => ({ role: m.role, content: m.content })),
          { role: "user", content: userMessage },
        ];

        const response = client.messages.stream({
          model: MODEL,
          max_tokens: MAX_OUTPUT_TOKENS,
          system: [
            {
              type: "text",
              text: systemPrompt,
              cache_control: { type: "ephemeral" },
            },
          ],
          messages,
        });

        for await (const event of response) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            const chunk = event.delta.text;
            assembled += chunk;
            controller.enqueue(encoder.encode(chunk));
          } else if (event.type === "message_delta") {
            // usage.output_tokens is in the message_delta event
            if (event.usage) {
              usage = { ...usage, ...event.usage } as Anthropic.Messages.Usage;
            }
          } else if (event.type === "message_start") {
            usage = event.message.usage;
          }
        }

        await saveMessage(conversationId, "assistant", assembled);

        if (usage) {
          const inr = usageCostINR(usage);
          await addCostINR(inr);
        }
      } catch (err) {
        console.error("stream error", err);
        controller.enqueue(
          encoder.encode(
            "\n\n[Chotu hit an error. Try again or drop Anuj an email.]",
          ),
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "x-rate-count": String(count),
      "x-rate-limit": String(MESSAGES_PER_IP_PER_DAY),
    },
  });
}
