"use client";

import { useEffect, useRef, useState } from "react";

type Status =
  | { phase: "before"; days: number; total: number }
  | { phase: "during"; days: number; total: number }
  | { phase: "after"; days: number; total: number };

type Msg = { role: "user" | "assistant"; content: string };

function CounterBanner({ status }: { status: Status }) {
  if (status.phase === "before") {
    return (
      <div className="text-sm tracking-tight text-zinc-400">
        Anuj leaves for Vipassana in{" "}
        <strong className="text-zinc-200">{status.days}</strong>{" "}
        {status.days === 1 ? "day" : "days"}. Chotu is warming up.
      </div>
    );
  }
  if (status.phase === "during") {
    return (
      <div className="text-sm tracking-tight text-zinc-400">
        Day <strong className="text-zinc-200">{status.days}</strong> of{" "}
        {status.total}. Anuj returns 8 June 2026. Chotu's holding the fort.
      </div>
    );
  }
  return (
    <div className="text-sm tracking-tight text-zinc-400">
      Anuj is back. He'll be in touch.
    </div>
  );
}

export default function VipassanaClient({
  status,
}: {
  status: Status;
  returnDateISO: string;
}) {
  const [stage, setStage] = useState<"intro" | "chat">("intro");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streaming]);

  async function startSession() {
    setError("");
    try {
      const res = await fetch("/api/vipassana/start", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || undefined,
          email: email.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.error === "invalid_email") setError("That email looks off.");
        else setError("Something went wrong starting the chat. Try again.");
        return;
      }
      setConversationId(data.conversation_id);
      setStage("chat");
      setMessages([
        {
          role: "assistant",
          content:
            name.trim()
              ? `Heylos ${name.trim()} 👋 — Chotu here. Anuj is on Vipassana (27 May → 7 June 2026). I'm his proxy while he's away. Ask me anything — about his work, his writing, his bets, or just chat. Anuj will follow up when he's back.`
              : `Heylos 👋 — Chotu here. Anuj is on Vipassana (27 May → 7 June 2026). I'm his proxy while he's away. Ask me anything — about his work, his writing, his bets, or just chat. Anuj will follow up when he's back.`,
        },
      ]);
    } catch (e) {
      setError("Network error. Try again.");
    }
  }

  async function send() {
    const msg = input.trim();
    if (!msg || streaming || !conversationId) return;
    setError("");
    setMessages((m) => [...m, { role: "user", content: msg }]);
    setInput("");
    setStreaming(true);
    setMessages((m) => [...m, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/vipassana/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          conversation_id: conversationId,
          message: msg,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const errMsg = data.message || "Something broke. Try again.";
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { role: "assistant", content: errMsg };
          return copy;
        });
        setStreaming(false);
        return;
      }

      if (!res.body) {
        setError("No stream.");
        setStreaming(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assembled = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assembled += decoder.decode(value, { stream: true });
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { role: "assistant", content: assembled };
          return copy;
        });
      }
    } catch (e) {
      setError("Network error mid-stream.");
    } finally {
      setStreaming(false);
    }
  }

  function onKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-100 font-[-apple-system,'SF_Pro_Text',sans-serif]">
      <main className="mx-auto max-w-2xl px-6 py-12">
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-7 h-7 bg-red-500 rounded-md flex items-center justify-center">
              <svg
                viewBox="0 0 16 16"
                className="w-4 h-4 fill-white"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="2" y="2" width="5" height="5" rx="1.5" />
                <rect x="9" y="2" width="5" height="5" rx="1.5" />
                <rect x="2" y="9" width="5" height="5" rx="1.5" />
                <rect x="9" y="9" width="5" height="5" rx="1.5" opacity="0.4" />
              </svg>
            </div>
            <span className="text-sm font-bold tracking-tight">chotu</span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight leading-[1.05] mb-3">
            Anuj is on <em className="not-italic text-red-500">Vipassana</em>.
            <br />
            Chotu is here.
          </h1>
          <CounterBanner status={status} />
        </header>

        {stage === "intro" ? (
          <section className="space-y-5">
            <p className="text-zinc-300 text-[15px] leading-relaxed">
              Anuj is unreachable from <strong>27 May to 7 June 2026</strong> —
              no phone, no internet, no eye contact, only meditation. He returns
              8 June 2026.
            </p>
            <p className="text-zinc-400 text-[14px] leading-relaxed">
              Chotu is his proxy. Trained on his writing — essays, journals,
              project docs. He'll speak in third person, share Anuj's actual
              thinking, and let you know Anuj will follow up when he's back.
            </p>
            <p className="text-zinc-400 text-[14px] leading-relaxed">
              Want to <em>date him</em>, <em>work with him</em>, <em>just
              chat</em>, or <em>talk to Chotu directly</em> — all welcome.
            </p>

            <div className="mt-8 space-y-3 max-w-md">
              <div>
                <label className="text-[11px] font-semibold tracking-[0.18em] text-zinc-500 uppercase">
                  Your name (optional)
                </label>
                <input
                  type="text"
                  className="mt-1 w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-[14px] focus:outline-none focus:border-zinc-600"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="how should Anuj know you"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold tracking-[0.18em] text-zinc-500 uppercase">
                  Your email (optional, for follow-up)
                </label>
                <input
                  type="email"
                  className="mt-1 w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-[14px] focus:outline-none focus:border-zinc-600"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                />
              </div>
              {error && (
                <div className="text-[12px] text-red-400">{error}</div>
              )}
              <button
                onClick={startSession}
                className="mt-2 w-full bg-red-500 hover:bg-red-400 text-white font-semibold py-3 rounded-lg text-[14px] transition-colors"
              >
                Start talking to Chotu
              </button>
              <div className="text-[11px] text-zinc-600 pt-1">
                Skip the fields — both are optional. But if you want a follow-up
                from Anuj, email helps.
              </div>
            </div>
          </section>
        ) : (
          <section className="flex flex-col gap-4">
            <div
              ref={scrollRef}
              className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-2"
            >
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={
                    m.role === "user"
                      ? "self-end max-w-[85%] bg-zinc-800 rounded-2xl rounded-br-md px-4 py-2.5 text-[14px] leading-relaxed"
                      : "self-start max-w-[90%] text-[14.5px] leading-relaxed whitespace-pre-wrap"
                  }
                >
                  {m.content || (streaming && i === messages.length - 1 ? (
                    <span className="text-zinc-500">…</span>
                  ) : null)}
                </div>
              ))}
            </div>

            <div className="mt-2 flex gap-2 items-end border-t border-zinc-900 pt-4">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKey}
                disabled={streaming}
                placeholder="ask anything…"
                rows={1}
                className="flex-1 resize-none bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-[14px] focus:outline-none focus:border-zinc-600 disabled:opacity-50"
              />
              <button
                onClick={send}
                disabled={streaming || !input.trim()}
                className="bg-red-500 hover:bg-red-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-4 py-2.5 rounded-lg text-[14px] transition-colors"
              >
                Send
              </button>
            </div>
            {error && (
              <div className="text-[12px] text-red-400">{error}</div>
            )}
            <div className="text-[11px] text-zinc-600">
              Chotu speaks for Anuj in third person. Anuj will follow up when
              he's back (8 June 2026).
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
