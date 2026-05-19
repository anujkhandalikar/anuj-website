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
    max-width: 560px;
    height: 100dvh;
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

  /* ---- CAPABILITIES ---- */
  .capabilities {
    font-size: 13px;
    color: var(--text);
    line-height: 1.9;
    letter-spacing: -0.1px;
    font-weight: 500;
  }

  .capabilities .cap-sep {
    color: var(--dimmer);
    margin: 0 10px;
  }

  .capabilities .cap-more {
    color: var(--dimmer);
    font-weight: 400;
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

  @media (max-width: 480px) {
    main {
      height: auto;
      min-height: 100dvh;
      justify-content: flex-start;
      padding: 40px 24px 56px;
      gap: 24px;
    }
    .cta-stack { max-width: 100%; }
    .email-input { max-width: 100%; }
    h1 { font-size: clamp(30px, 9vw, 40px); }
    .capabilities { line-height: 2; }
    .capabilities .cap-sep { margin: 0 6px; }
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
    open your phone for one thing, end up doing five. chotu takes the task — you stay in your world.
  </p>

  <!-- capabilities -->
  <p class="capabilities">
    <span>orders groceries</span><span class="cap-sep">·</span><span>manages whatsapp</span><span class="cap-sep">·</span><span>researches anything</span><span class="cap-sep">·</span><span>handles approvals</span><span class="cap-sep">·</span><span>protects your focus</span><span class="cap-more"> &nbsp;and a lot more.</span>
  </p>

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
