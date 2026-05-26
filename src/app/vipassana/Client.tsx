"use client";

import { useEffect, useRef, useState } from "react";

type Status =
  | { phase: "before"; days: number; total: number }
  | { phase: "during"; days: number; total: number }
  | { phase: "after"; days: number; total: number };

type Msg = { role: "user" | "assistant"; content: string };

function stripMarkdown(s: string): string {
  return s
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/__(.+?)__/g, "$1")
    .replace(/(^|\s)\*(\S[^*]*\S|\S)\*(?=\s|$)/g, "$1$2")
    .replace(/(^|\s)_(\S[^_]*\S|\S)_(?=\s|$)/g, "$1$2")
    .replace(/^#+\s+/gm, "")
    .replace(/^[-*]\s+/gm, "")
    .replace(/^\d+\.\s+/gm, "");
}

function renderContent(s: string) {
  const stripped = stripMarkdown(s);
  const urlRegex = /(https?:\/\/[^\s<)]+)/g;
  const parts = stripped.split(urlRegex);
  
  return parts.map((part, i) => {
    if (part.match(urlRegex)) {
      return (
        <a 
          key={i} 
          href={part} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-red-400 hover:text-red-300 underline underline-offset-2 transition-colors"
        >
          {part}
        </a>
      );
    }
    return part;
  });
}

function counterText(status: Status): string {
  if (status.phase === "before") {
    return `${status.days} ${status.days === 1 ? "day" : "days"} until he ghosts everyone`;
  }
  if (status.phase === "during") {
    const left = status.total - status.days;
    if (left <= 0) return `he's back tomorrow. brace yourself`;
    return `${left} ${left === 1 ? "day" : "days"} until he resurfaces`;
  }
  return `he's back. you're welcome`;
}

const ASK_PHRASES = [
  "if he's single (yes, painfully)",
  "the bike he named like a girlfriend",
  "why he left flipkart",
  "what he claims he's building",
  "his ai takes (loud)",
  "why he runs everywhere",
  "the kannada flexing app he built",
  "his mom's halloween text",
];

const LOADING_LINES = [
  "reading you like a book",
  "judging you. silently",
  "warming up the eyebrow",
  "deciding if you're worth a real answer",
  "calibrating sass levels",
  "give me a sec. or don't. your loss",
];

const SUGGESTIONS = [
  { label: "💼 work with him", prompt: "what's anuj working on? would we be a fit?" },
  { label: "💸 hire him", prompt: "i'm thinking of hiring anuj. what's he good at?" },
  { label: "🧠 brainstorm with him", prompt: "i want to brainstorm something with anuj. how do we set that up?" },
  { label: "❤️ date him", prompt: "tell me about anuj — would i want to date him?" },
  { label: "🔥 roast him", prompt: "roast anuj for me. don't hold back." },
  { label: "📅 meet him", prompt: "i want to meet anuj when he's back. can you help set that up?" },
];

export default function VipassanaClient({
  status,
}: {
  status: Status;
  returnDateISO: string;
}) {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState("");
  const [showIdentify, setShowIdentify] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [identitySaved, setIdentitySaved] = useState(false);
  const [loadingIdx, setLoadingIdx] = useState(0);
  const [typedAsk, setTypedAsk] = useState("");

  useEffect(() => {
    try {
      const savedName = localStorage.getItem("chotu.name") || "";
      const savedEmail = localStorage.getItem("chotu.email") || "";
      if (savedName) setName(savedName);
      if (savedEmail) setEmail(savedEmail);
      if (savedName || savedEmail) setIdentitySaved(true);
    } catch {}
  }, []);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const hasChatted = messages.length > 0;

  useEffect(() => {
    if (hasChatted) return;
    const el = carouselRef.current;
    if (!el) return;

    let animationId: number;
    let isHovering = false;
    let currentScroll = el.scrollLeft;

    const scroll = () => {
      if (!isHovering) {
        currentScroll += 0.25;
        if (currentScroll >= el.scrollWidth / 2) {
          currentScroll -= el.scrollWidth / 2;
        }
        el.scrollLeft = currentScroll;
      } else {
        currentScroll = el.scrollLeft;
      }
      animationId = requestAnimationFrame(scroll);
    };

    const handleEnter = () => { isHovering = true; };
    const handleLeave = () => { isHovering = false; };
    const handleTouch = () => {
      isHovering = true;
      setTimeout(() => { isHovering = false; }, 2000);
    };

    el.addEventListener('mouseenter', handleEnter);
    el.addEventListener('mouseleave', handleLeave);
    el.addEventListener('touchstart', handleTouch, { passive: true });

    animationId = requestAnimationFrame(scroll);

    return () => {
      cancelAnimationFrame(animationId);
      el.removeEventListener('mouseenter', handleEnter);
      el.removeEventListener('mouseleave', handleLeave);
      el.removeEventListener('touchstart', handleTouch);
    };
  }, [hasChatted]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streaming]);

  useEffect(() => {
    if (!streaming) return;
    setLoadingIdx(Math.floor(Math.random() * LOADING_LINES.length));
    const t = setInterval(() => {
      setLoadingIdx((i) => (i + 1) % LOADING_LINES.length);
    }, 2200);
    return () => clearInterval(t);
  }, [streaming]);

  useEffect(() => {
    if (hasChatted) return;
    setTypedAsk(ASK_PHRASES[0]);
    let idx = 0;
    const id = setInterval(() => {
      idx = (idx + 1) % ASK_PHRASES.length;
      setTypedAsk(ASK_PHRASES[idx]);
    }, 2000);
    return () => clearInterval(id);
  }, [hasChatted]);

  async function ensureSession(): Promise<string | null> {
    if (conversationId) return conversationId;
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
        setError(
          data.error === "invalid_email"
            ? "that email looks off."
            : "couldn't start chat. try again."
        );
        return null;
      }
      setConversationId(data.conversation_id);
      return data.conversation_id;
    } catch {
      setError("network error.");
      return null;
    }
  }

  async function send(textOverride?: string) {
    const msg = (textOverride ?? input).trim();
    if (!msg || streaming) return;
    
    setStreaming(true);
    setError("");

    const id = await ensureSession();
    if (!id) {
      setStreaming(false);
      return;
    }

    setMessages((m) => [...m, { role: "user", content: msg }]);
    setInput("");
    setMessages((m) => [...m, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/vipassana/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          conversation_id: id,
          message: msg,
          name: name.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const errMsg = data.message || "something broke. try again.";
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { role: "assistant", content: errMsg };
          return copy;
        });
        setStreaming(false);
        return;
      }

      if (!res.body) {
        setError("no stream.");
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
    } catch {
      setError("network error mid-stream.");
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

  function pickSuggestion(prompt: string) {
    setInput(prompt);
    inputRef.current?.focus();
  }

  async function saveIdentity() {
    setError("");
    if (email.trim()) {
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
      if (!ok) {
        setError("that email looks off.");
        return;
      }
    }
    try {
      const n = name.trim();
      const e = email.trim();
      if (n) localStorage.setItem("chotu.name", n);
      else localStorage.removeItem("chotu.name");
      if (e) localStorage.setItem("chotu.email", e);
      else localStorage.removeItem("chotu.email");
    } catch {}
    setIdentitySaved(true);
    setShowIdentify(false);
  }

  return (
    <div className="fixed inset-0 bg-zinc-950 text-zinc-100 font-[-apple-system,'SF_Pro_Text',sans-serif]">
      <div className="h-[100dvh] w-full mx-auto max-w-[560px] flex flex-col relative">
        <main
          className={`flex-1 flex flex-col px-6 w-full ${
            hasChatted ? "py-6 overflow-hidden" : "justify-center py-12 overflow-y-auto"
          }`}
        >
          <header className={`shrink-0 ${hasChatted ? "mb-6" : "mb-8"}`}>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-7 h-7 bg-red-500 rounded-md flex items-center justify-center shrink-0">
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
              <span className="ml-auto text-[11px] text-zinc-500 tracking-tight text-right">
                {counterText(status)}
              </span>
          </div>

          {!hasChatted && (
            <>
              <h1 className="text-[42px] font-bold tracking-tight leading-[1.02] mb-3">
                this is <em className="not-italic text-red-500">chotu</em>.
                <br />
                in anuj&apos;s words.
              </h1>
              <p className="text-zinc-300 text-[16px] leading-relaxed min-h-[1.6em]">
                ask about{" "}
                <span key={typedAsk} className="text-red-400 chotu-fade">
                  {typedAsk || ASK_PHRASES[0]}
                </span>
              </p>
              <p className="text-zinc-500 text-[12px] mt-4 leading-relaxed">
                8 years of his journals. 1000+ notes. one overworked chotu.
              </p>
            </>
          )}
        </header>

          {hasChatted && (
            <section
              ref={scrollRef}
              className="flex flex-col gap-4 flex-1 overflow-y-auto mb-4 pr-1 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
            >
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user"
                    ? "self-end max-w-[85%] bg-zinc-800 rounded-2xl rounded-br-md px-4 py-2.5 text-[14px] leading-relaxed"
                    : "self-start max-w-[92%] text-[15px] leading-relaxed whitespace-pre-wrap text-zinc-100"
                }
              >
                {m.role === "assistant" ? renderContent(m.content) : m.content}
                {!m.content && streaming && i === messages.length - 1 ? (
                  <span className="text-zinc-500 italic">
                    {LOADING_LINES[loadingIdx]}
                    <span className="chotu-dot">.</span>
                    <span className="chotu-dot">.</span>
                    <span className="chotu-dot">.</span>
                  </span>
                ) : null}
              </div>
            ))}
          </section>
        )}

          <section className="shrink-0 space-y-3">
            <div className="relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKey}
                disabled={streaming}
                placeholder={hasChatted ? "reply…" : "ask chotu anything…"}
                rows={hasChatted ? 1 : 2}
                className="w-full resize-none bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 pr-14 text-[16px] leading-relaxed focus:outline-none focus:border-zinc-600 disabled:opacity-50 placeholder:text-zinc-600"
                autoFocus
            />
            <button
              onClick={() => send()}
              disabled={streaming || !input.trim()}
              aria-label="send"
              className="absolute top-1/2 -translate-y-1/2 right-2.5 bg-red-500 hover:bg-red-400 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-full w-9 h-9 flex items-center justify-center transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 14V2M8 2L2.5 7.5M8 2l5.5 5.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

            {!hasChatted && (
              <div 
                ref={carouselRef}
                className="flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none] [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] pb-1 -mx-6 px-6"
              >
              {[...SUGGESTIONS, ...SUGGESTIONS].map((s, idx) => (
                <button
                  key={`${s.label}-${idx}`}
                  onClick={() => pickSuggestion(s.prompt)}
                  className="text-[12.5px] text-zinc-300 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-full px-3 py-1.5 transition-colors whitespace-nowrap shrink-0"
                >
                  {s.label}
                </button>
              ))}
            </div>
            )}

          {error && <div className="text-[12px] text-red-400">{error}</div>}

          {!showIdentify && !identitySaved && (
            <button
              onClick={() => setShowIdentify(true)}
              className="text-[11px] text-zinc-500 hover:text-zinc-300 underline underline-offset-2 transition-colors"
            >
              tell anuj who you are. or don&apos;t. i&apos;ll guess.
            </button>
          )}

          {identitySaved && !showIdentify && (
            <div className="text-[11px] text-zinc-500">
              got it — anuj will follow up when he's back.{" "}
              <button
                onClick={() => setShowIdentify(true)}
                className="underline underline-offset-2 hover:text-zinc-300"
              >
                edit
              </button>
            </div>
          )}

          {showIdentify && (
            <div className="space-y-2 pt-1 border-t border-zinc-900">
              <div className="text-[11px] text-zinc-500 pt-3">
                name so i stop calling you &quot;random person&quot;. email so anuj can follow up when he&apos;s done finding himself.
              </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="your name"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-[16px] focus:outline-none focus:border-zinc-600"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-[16px] focus:outline-none focus:border-zinc-600"
                />
              <div className="flex gap-2">
                <button
                  onClick={saveIdentity}
                  className="text-[12px] bg-zinc-100 hover:bg-white text-zinc-900 font-medium px-3 py-1.5 rounded-md transition-colors"
                >
                  save
                </button>
                <button
                  onClick={() => setShowIdentify(false)}
                  className="text-[12px] text-zinc-500 hover:text-zinc-300 px-2 py-1.5 transition-colors"
                >
                  cancel
                </button>
              </div>
            </div>
          )}
          </section>
        </main>
      </div>
    </div>
  );
}
