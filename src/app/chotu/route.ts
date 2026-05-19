import { NextResponse } from "next/server";

const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>chotu — always present, never in the way</title>
<style>
  :root {
    --bg: #0c0c0c;
    --text: #efefef;
    --dim: rgba(239,239,239,0.4);
    --dimmer: rgba(239,239,239,0.15);
    --red: #ff3b3b;
    --red-dim: rgba(255,59,59,0.12);
    --red-glow: rgba(255,59,59,0.06);
    --border: rgba(255,255,255,0.06);
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  html, body {
    min-height: 100dvh;
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: -apple-system, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  /* grain */
  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.028'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 999;
  }

  main {
    max-width: 560px;
    min-height: 100dvh;
    margin: 0 auto;
    padding: 48px 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 28px;
    opacity: 0;
    animation: appear 0.7s ease 0.1s forwards;
  }

  @keyframes appear { to { opacity: 1; } }

  /* ---- WORDMARK ---- */
  .wordmark {
    display: flex;
    align-items: center;
    gap: 9px;
  }

  .wordmark-icon {
    width: 28px;
    height: 28px;
    background: var(--red);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .wordmark-icon svg {
    width: 16px;
    height: 16px;
    fill: #fff;
  }

  .wordmark-name {
    font-size: 16px;
    font-weight: 700;
    letter-spacing: -0.5px;
    color: var(--text);
  }

  /* ---- HEADLINE ---- */
  h1 {
    font-size: clamp(32px, 5vw, 48px);
    font-weight: 700;
    letter-spacing: -1.8px;
    line-height: 1.02;
    color: var(--text);
  }

  h1 em {
    font-style: normal;
    color: var(--red);
  }

  /* ---- DESC ---- */
  .desc {
    font-size: 14px;
    color: var(--dim);
    line-height: 1.6;
    letter-spacing: -0.1px;
    max-width: 440px;
  }

  /* ---- DEMO TRIGGER ---- */
  .demo-trigger {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    width: fit-content;
    padding: 9px 16px 9px 14px;
    border-radius: 999px;
    border: 1px solid var(--border);
    background: rgba(255,255,255,0.04);
    color: var(--text);
    font-family: inherit;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: -0.1px;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s, transform 0.15s;
  }

  .demo-trigger:hover {
    background: rgba(255,255,255,0.07);
    border-color: rgba(255,255,255,0.14);
  }

  .demo-trigger:active { transform: scale(0.98); }
  .demo-icon { opacity: 0.7; flex-shrink: 0; }
  .demo-trigger:hover .demo-icon { opacity: 1; }

  /* ---- MODAL ---- */
  .modal {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.82);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    z-index: 1000;
    align-items: center;
    justify-content: center;
    padding: 24px;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .modal.open {
    display: flex;
    opacity: 1;
  }

  .modal-inner {
    position: relative;
    width: 100%;
    max-width: 960px;
    aspect-ratio: 16 / 9;
    border-radius: 14px;
    overflow: hidden;
    background: #000;
    box-shadow: 0 30px 80px rgba(0,0,0,0.6);
  }

  .modal-close {
    position: absolute;
    top: -42px;
    right: -2px;
    width: 32px;
    height: 32px;
    background: rgba(255,255,255,0.06);
    border: 1px solid var(--border);
    border-radius: 999px;
    color: var(--text);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s, border-color 0.15s;
  }

  .modal-close:hover {
    background: rgba(255,255,255,0.12);
    border-color: rgba(255,255,255,0.18);
  }

  .modal-video {
    width: 100%;
    height: 100%;
  }

  .modal-video iframe {
    width: 100%;
    height: 100%;
    border: none;
    display: block;
  }

  /* ---- CAPABILITIES ---- */
  .capabilities {
    overflow: hidden;
    width: 100%;
    -webkit-mask-image: linear-gradient(to right, transparent, #000 8%, #000 92%, transparent);
    mask-image: linear-gradient(to right, transparent, #000 8%, #000 92%, transparent);
  }

  .cap-track {
    display: flex;
    width: max-content;
    animation: cap-scroll 14s linear infinite;
  }

  .cap-track:hover { animation-play-state: paused; }

  .cap-item {
    font-size: 13px;
    color: var(--text);
    letter-spacing: -0.1px;
    font-weight: 500;
    padding: 0 18px;
    white-space: nowrap;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  .cap-emoji {
    font-size: 14px;
    line-height: 1;
  }

  @keyframes cap-scroll {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }

  @media (prefers-reduced-motion: reduce) {
    .cap-track { animation: none; }
  }

  /* ---- CTA ---- */
  .cta-wrap {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .email-input {
    width: 100%;
    max-width: 380px;
    padding: 13px 16px;
    border-radius: 10px;
    border: 1px solid var(--border);
    background: rgba(255,255,255,0.04);
    color: var(--text);
    font-family: inherit;
    font-size: 14px;
    letter-spacing: -0.1px;
    outline: none;
    margin-bottom: 8px;
    transition: border-color 0.15s;
  }

  .email-input::placeholder { color: var(--dimmer); }
  .email-input:focus { border-color: rgba(255,255,255,0.18); }

  .cta-stack {
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-width: 380px;
  }

  .status-line {
    font-size: 11px;
    min-height: 16px;
    padding-left: 2px;
    margin-top: 4px;
  }
  .status-line.err { color: var(--red); }
  .status-line.ok  { color: rgba(239,239,239,0.35); }

  .done-msg {
    font-size: 14px;
    color: var(--dim);
    padding: 14px 0 6px;
  }

  .change-btn {
    background: none;
    border: none;
    font-family: inherit;
    font-size: 11px;
    color: var(--dimmer);
    cursor: pointer;
    padding: 0;
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  .change-btn:hover { color: var(--dim); }

  .btn {
    width: 100%;
    padding: 13px 18px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: -0.2px;
    cursor: pointer;
    border: none;
    font-family: inherit;
    transition: all 0.15s ease;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .btn-ghost {
    background: rgba(255,255,255,0.04);
    color: var(--text);
    border: 1px solid var(--border);
  }

  .btn-ghost:hover { background: rgba(255,255,255,0.07); }

  .btn-red {
    background: var(--red);
    color: #fff;
  }

  .btn-red:hover { background: #ff5555; }

  .btn-right {
    font-size: 11px;
    font-weight: 400;
    opacity: 0.5;
  }

  /* ---- FAQ ---- */
  .faq {
    max-width: 560px;
    margin: 0 auto;
    padding: 8px 40px 96px;
  }

  .faq-title {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1.8px;
    text-transform: uppercase;
    color: var(--dim);
    margin-bottom: 8px;
  }

  .faq-list {
    display: flex;
    flex-direction: column;
  }

  .faq-item {
    border-top: 1px solid var(--border);
    padding: 18px 0;
  }

  .faq-item:last-of-type {
    border-bottom: 1px solid var(--border);
  }

  .faq-item summary {
    list-style: none;
    cursor: pointer;
    font-size: 15px;
    font-weight: 500;
    letter-spacing: -0.2px;
    color: var(--text);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .faq-item summary::-webkit-details-marker { display: none; }

  .faq-icon {
    flex-shrink: 0;
    color: var(--dim);
    transition: transform 0.2s ease;
  }

  .faq-item[open] .faq-icon {
    transform: rotate(45deg);
    color: var(--text);
  }

  .faq-item .faq-body {
    margin-top: 12px;
    font-size: 13.5px;
    color: var(--dim);
    line-height: 1.65;
    letter-spacing: -0.1px;
  }

  @media (max-width: 480px) {
    main {
      justify-content: flex-start;
      padding: 40px 24px 56px;
      gap: 24px;
    }
    .cta-stack { max-width: 100%; }
    .email-input { max-width: 100%; }
    h1 { font-size: clamp(30px, 9vw, 40px); }
    .cap-item { padding: 0 14px; font-size: 12.5px; }
    .faq { padding: 0 24px 72px; }
    .faq-item summary { font-size: 14.5px; }
    .modal { padding: 16px; }
    .modal-close {
      top: 8px;
      right: 8px;
      background: rgba(0,0,0,0.6);
      border-color: rgba(255,255,255,0.2);
      z-index: 2;
    }
  }
</style>
</head>
<body>
<main>

  <!-- wordmark -->
  <div class="wordmark">
    <div class="wordmark-icon">
      <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="5" height="5" rx="1.5"/>
        <rect x="9" y="2" width="5" height="5" rx="1.5"/>
        <rect x="2" y="9" width="5" height="5" rx="1.5"/>
        <rect x="9" y="9" width="5" height="5" rx="1.5" opacity="0.4"/>
      </svg>
    </div>
    <span class="wordmark-name">chotu</span>
  </div>

  <!-- headline -->
  <h1>stay in flow.<br>chotu handles the <em>noise.</em></h1>

  <!-- desc -->
  <p class="desc">
    open your phone for one thing, end up doing five. chotu takes the task — you stay in your world.
  </p>

  <!-- demo trigger -->
  <button class="demo-trigger" onclick="openDemo()" aria-label="See why chotu">
    <svg class="demo-icon" width="9" height="11" viewBox="0 0 9 11" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0.75 0.75L8.25 5.5L0.75 10.25V0.75Z" fill="currentColor"/>
    </svg>
    <span>see why</span>
  </button>

  <!-- capabilities -->
  <div class="capabilities" aria-label="what chotu can do">
    <div class="cap-track" id="cap-track">
      <span class="cap-item"><span class="cap-emoji">🛒</span>orders groceries</span>
      <span class="cap-item"><span class="cap-emoji">💬</span>manages whatsapp</span>
      <span class="cap-item"><span class="cap-emoji">🔎</span>researches anything</span>
      <span class="cap-item"><span class="cap-emoji">✅</span>handles approvals</span>
      <span class="cap-item"><span class="cap-emoji">🧘</span>protects your focus</span>
      <span class="cap-item" aria-hidden="true"><span class="cap-emoji">🛒</span>orders groceries</span>
      <span class="cap-item" aria-hidden="true"><span class="cap-emoji">💬</span>manages whatsapp</span>
      <span class="cap-item" aria-hidden="true"><span class="cap-emoji">🔎</span>researches anything</span>
      <span class="cap-item" aria-hidden="true"><span class="cap-emoji">✅</span>handles approvals</span>
      <span class="cap-item" aria-hidden="true"><span class="cap-emoji">🧘</span>protects your focus</span>
    </div>
  </div>

  <!-- cta -->
  <div class="cta-wrap">
    <div id="cta-form">
      <input
        id="email-input"
        class="email-input"
        type="email"
        placeholder="your@email.com"
        autocomplete="email"
      />
      <div class="cta-stack">
        <div>
          <button class="btn btn-ghost" onclick="submit('curious')">
            <span>i'm curious — try it out</span>
            <span class="btn-right" id="curious-count"></span>
          </button>
        </div>
        <div>
          <button class="btn btn-red" onclick="submit('pay')">
            <span>i'll pay $9/month</span>
            <span class="btn-right" id="pay-count"></span>
          </button>
        </div>
      </div>
      <div class="status-line" id="status"></div>
    </div>

    <div id="cta-done" style="display:none">
      <div class="done-msg" id="done-msg"></div>
      <button class="change-btn" onclick="showForm()">change my mind</button>
    </div>
  </div>

</main>

<!-- faq -->
<section class="faq" aria-label="frequently asked questions">
  <div class="faq-title">questions</div>
  <div class="faq-list">

    <details class="faq-item">
      <summary>
        <span>why does chotu exist?</span>
        <svg class="faq-icon" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 1V11M1 6H11" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
      </summary>
      <div class="faq-body">
        i built chotu because i kept switching between tabs and tools and losing focus. i love deep work — writing, researching, editing videos, watching films — but distractions kept pulling me out, and i had to either remember the thought for later or let it go. neither felt right. chotu takes the task in the background so the thought doesn't break the focus.
      </div>
    </details>

    <details class="faq-item">
      <summary>
        <span>what does chotu actually do?</span>
        <svg class="faq-icon" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 1V11M1 6H11" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
      </summary>
      <div class="faq-body">
        researches anything on the web (3-bullet answers), creates / reads / updates calendar events, manages google tasks, sends and reads whatsapp messages, orders groceries on blinkit. also captures stray thoughts and tags them so they don't get lost.
      </div>
    </details>

    <details class="faq-item">
      <summary>
        <span>how do i use it?</span>
        <svg class="faq-icon" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 1V11M1 6H11" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
      </summary>
      <div class="faq-body">
        global hotkey opens a small overlay. type the task (or paste an image), hit enter, go back to what you were doing. chotu classifies, runs it in the background, and drops the result on a web dashboard for async review.
      </div>
    </details>

    <details class="faq-item">
      <summary>
        <span>who is it for?</span>
        <svg class="faq-icon" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 1V11M1 6H11" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
      </summary>
      <div class="faq-body">
        right now, just me. v1 is a validation build — one builder, one user. i'm certain personal chotus will exist for everyone eventually, but nothing today feels seamless enough to actually protect focus. if others find it valuable, i'll build it for them too.
      </div>
    </details>

    <details class="faq-item">
      <summary>
        <span>does anything need my approval?</span>
        <svg class="faq-icon" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 1V11M1 6H11" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
      </summary>
      <div class="faq-body">
        anything irreversible or sent on your behalf: whatsapp messages, calendar updates and deletes, blinkit orders. these wait for one click on the dashboard. reads, research, and calendar/task creation run on their own.
      </div>
    </details>

    <details class="faq-item">
      <summary>
        <span>what's it built on?</span>
        <svg class="faq-icon" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 1V11M1 6H11" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
      </summary>
      <div class="faq-body">
        next.js + tailwind on vercel, supabase for storage and real-time, inngest for background jobs, openai (gpt-4o-mini for routing, gpt-4o + web search for research), electron for the desktop overlay. typescript everywhere.
      </div>
    </details>

    <details class="faq-item">
      <summary>
        <span>what doesn't it do yet?</span>
        <svg class="faq-icon" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 1V11M1 6H11" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
      </summary>
      <div class="faq-body">
        no native mobile app, no email, no payments, no purchases beyond blinkit, no voice capture, no scheduled briefings, no multi-user, no memory across tasks, no follow-up questions — the overlay is one-shot.
      </div>
    </details>

    <details class="faq-item">
      <summary>
        <span>can i try it?</span>
        <svg class="faq-icon" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 1V11M1 6H11" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
      </summary>
      <div class="faq-body">
        not yet. drop your email above — if enough people want one, i'll build it for them.
      </div>
    </details>

  </div>
</section>

<!-- demo modal -->
<div class="modal" id="demo-modal" onclick="closeDemo()" role="dialog" aria-modal="true" aria-label="Demo video">
  <div class="modal-inner" onclick="event.stopPropagation()">
    <button class="modal-close" onclick="closeDemo()" aria-label="Close">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </button>
    <div class="modal-video" id="demo-video-mount"></div>
  </div>
</div>

<script>
  const STORAGE_KEY = 'chotu_email';

  function savedEmail() {
    try { return localStorage.getItem(STORAGE_KEY) || ''; } catch(e) { return ''; }
  }

  function saveEmail(email) {
    try { localStorage.setItem(STORAGE_KEY, email); } catch(e) {}
  }

  function showDone(type) {
    document.getElementById('cta-form').style.display = 'none';
    const done = document.getElementById('cta-done');
    done.style.display = 'block';
    document.getElementById('done-msg').textContent =
      type === 'pay' ? "you're in. we'll be in touch." : "noted. we'll let you know.";
  }

  function showForm() {
    document.getElementById('cta-done').style.display = 'none';
    document.getElementById('cta-form').style.display = 'block';
    const saved = savedEmail();
    if (saved) document.getElementById('email-input').value = saved;
  }

  function setStatus(msg, isError) {
    const el = document.getElementById('status');
    el.textContent = msg;
    el.className = 'status-line' + (isError ? ' err' : ' ok');
  }

  function renderCounts(counts) {
    const c = document.getElementById('curious-count');
    const p = document.getElementById('pay-count');
    if (c) c.textContent = counts.curious > 0 ? \`\${counts.curious} curious\` : '';
    if (p) p.textContent = counts.pay > 0 ? \`\${counts.pay} willing to pay\` : '';
  }

  async function loadCounts() {
    try {
      const res = await fetch('/api/chotu/signup');
      if (res.ok) renderCounts(await res.json());
    } catch(e) {}
  }

  async function submit(type) {
    const email = document.getElementById('email-input').value.trim();
    if (!email) { setStatus('enter your email first.', true); return; }

    const btns = document.querySelectorAll('.btn');
    btns.forEach(b => b.disabled = true);
    setStatus('...', false);

    try {
      const res = await fetch('/api/chotu/signup', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, type }),
      });
      const data = await res.json();

      if (res.ok) {
        saveEmail(email);
        showDone(type);
        loadCounts();
      } else if (data.error === 'invalid_email') {
        setStatus('that email looks off.', true);
        btns.forEach(b => b.disabled = false);
      } else {
        setStatus('something went wrong. try again.', true);
        btns.forEach(b => b.disabled = false);
      }
    } catch(e) {
      setStatus('something went wrong. try again.', true);
      btns.forEach(b => b.disabled = false);
    }
  }

  loadCounts();

  const saved = savedEmail();
  if (saved) {
    document.getElementById('email-input').value = saved;
  }

  // ---- demo modal ----
  function openDemo() {
    const modal = document.getElementById('demo-modal');
    const mount = document.getElementById('demo-video-mount');
    mount.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/pKvnko42WN8?autoplay=1&rel=0&modestbranding=1" title="chotu demo" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDemo() {
    const modal = document.getElementById('demo-modal');
    const mount = document.getElementById('demo-video-mount');
    modal.classList.remove('open');
    mount.innerHTML = '';
    document.body.style.overflow = '';
  }

  window.openDemo = openDemo;
  window.closeDemo = closeDemo;

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const modal = document.getElementById('demo-modal');
      if (modal && modal.classList.contains('open')) closeDemo();
    }
  });
</script>
</body>
</html>`;

export async function GET() {
  return new NextResponse(HTML, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
