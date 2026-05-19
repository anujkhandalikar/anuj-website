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
    height: 100dvh;
    overflow: hidden;
  }

  @media (max-width: 480px) {
    html, body { height: auto; overflow: auto; }
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
    max-width: 620px;
    height: 100dvh;
    margin: 0 auto;
    padding: 40px 36px 36px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 16px;
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
    font-size: clamp(26px, 4.5vw, 42px);
    font-weight: 800;
    letter-spacing: -2px;
    line-height: 1.05;
    color: var(--text);
  }

  h1 em {
    font-style: normal;
    color: var(--red);
  }

  /* ---- DESC ---- */
  .desc {
    font-size: 13px;
    color: var(--dim);
    line-height: 1.6;
    letter-spacing: -0.1px;
    max-width: 400px;
  }

  /* ---- TASKS ---- */
  .tasks-wrap {
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
    background: #111;
  }

  .tasks {
    display: flex;
    flex-direction: column;
  }

  .task {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 9px 16px;
    border-bottom: 1px solid var(--border);
    transition: background 0.15s;
    cursor: default;
  }

  .task:last-child { border-bottom: none; }
  .task:hover { background: rgba(255,255,255,0.02); }

  .task-more { cursor: default; }
  .task-more .task-text { font-size: 11px; color: var(--dimmer); font-style: italic; }

  .task-icon {
    font-size: 14px;
    line-height: 1;
    flex-shrink: 0;
    width: 18px;
    text-align: center;
  }

  .task-text {
    font-size: 13px;
    color: var(--dim);
    letter-spacing: -0.1px;
    line-height: 1.4;
  }

  .task-text strong {
    color: var(--text);
    font-weight: 500;
  }

  /* ---- CTA ---- */
  .cta-wrap {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .cta-pre {
    font-size: 15px;
    font-weight: 600;
    color: var(--text);
    letter-spacing: -0.2px;
  }

  .email-input {
    width: 100%;
    max-width: 360px;
    padding: 11px 14px;
    border-radius: 10px;
    border: 1px solid var(--border);
    background: rgba(255,255,255,0.04);
    color: var(--text);
    font-family: inherit;
    font-size: 13px;
    letter-spacing: -0.1px;
    outline: none;
    margin-bottom: 6px;
    transition: border-color 0.15s;
  }

  .email-input::placeholder { color: var(--dimmer); }
  .email-input:focus { border-color: rgba(255,255,255,0.18); }

  .cta-stack {
    display: flex;
    flex-direction: column;
    gap: 6px;
    max-width: 360px;
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
    padding: 11px 16px;
    border-radius: 10px;
    font-size: 13px;
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

  /* ---- CLOSER ---- */
  .sep { width: 24px; height: 1px; background: var(--border); }

  .closer {
    font-size: 12px;
    color: var(--dimmer);
    line-height: 1.8;
    letter-spacing: 0.1px;
  }

  .closer span {
    color: var(--red);
    opacity: 0.8;
  }

  @media (max-width: 480px) {
    main { padding: 32px 22px 40px; gap: 20px; }
    .cta-stack { max-width: 100%; }
    .email-input { max-width: 100%; }
    h1 { font-size: clamp(28px, 8vw, 38px); letter-spacing: -1px; line-height: 1.08; }
    .desc { font-size: 14px; line-height: 1.7; letter-spacing: 0px; }
    .task { padding: 11px 16px; }
    .task-text { font-size: 14px; line-height: 1.5; letter-spacing: 0px; }
    .btn { font-size: 14px; padding: 13px 16px; }
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
  <h1>lives in your notch.<br>handles the <em>rest.</em></h1>

  <!-- desc -->
  <p class="desc">
    you open your phone to do one thing and end up doing five other things. chotu sits in your notch, takes the task, and gets it done — while you stay in your world.
  </p>

  <!-- tasks list -->
  <div class="tasks-wrap">
    <div class="tasks">
      <div class="task">
        <span class="task-icon">🛒</span>
        <span class="task-text"><strong>order groceries</strong> — "get the usual from blinkit"</span>
      </div>
      <div class="task">
        <span class="task-icon">💬</span>
        <span class="task-text"><strong>manage whatsapp</strong> — drafts replies, summarises threads</span>
      </div>
      <div class="task">
        <span class="task-icon">🔍</span>
        <span class="task-text"><strong>research anything</strong> — no new tabs, no rabbit holes</span>
      </div>
      <div class="task">
        <span class="task-icon">✅</span>
        <span class="task-text"><strong>approve & move on</strong> — one tap dashboard when you need control</span>
      </div>
      <div class="task">
        <span class="task-icon">🔕</span>
        <span class="task-text"><strong>protect your focus</strong> — always present, never a distraction</span>
      </div>
      <div class="task task-more">
        <span class="task-text">and a lot more...</span>
      </div>
    </div>
  </div>

  <!-- cta -->
  <div class="cta-wrap">
    <p class="cta-pre">want this?</p>

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

  <div class="sep"></div>

  <div class="closer">
    no gazillion tabs. no getting sucked in.<br>
    just you, your work, and <span>chotu</span> handling the noise.
  </div>

</main>

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
</script>
</body>
</html>`;

export async function GET() {
  return new NextResponse(HTML, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
