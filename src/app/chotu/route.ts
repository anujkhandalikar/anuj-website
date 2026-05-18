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

  body {
    background: var(--bg);
    color: var(--text);
    font-family: -apple-system, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    min-height: 100vh;
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
    margin: 0 auto;
    padding: 88px 36px 80px;
    opacity: 0;
    animation: appear 0.7s ease 0.1s forwards;
  }

  @keyframes appear { to { opacity: 1; } }

  /* ---- NOTCH VISUAL ---- */
  .notch-wrap {
    margin-bottom: 64px;
  }

  .notch-bar {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #1a1a1a;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 100px;
    padding: 8px 16px 8px 10px;
    font-size: 13px;
    font-weight: 500;
    color: var(--dim);
    letter-spacing: -0.1px;
  }

  .notch-dot {
    width: 8px;
    height: 8px;
    background: var(--red);
    border-radius: 50%;
    animation: breathe 2.4s ease-in-out infinite;
    flex-shrink: 0;
  }

  @keyframes breathe {
    0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 0 0 rgba(255,59,59,0.4); }
    50% { opacity: 0.7; transform: scale(0.85); box-shadow: 0 0 0 4px rgba(255,59,59,0); }
  }

  /* ---- HEADLINE ---- */
  h1 {
    font-size: clamp(40px, 8vw, 68px);
    font-weight: 800;
    letter-spacing: -3px;
    line-height: 1.0;
    color: var(--text);
    margin-bottom: 24px;
  }

  h1 em {
    font-style: normal;
    color: var(--red);
  }

  /* ---- DESC ---- */
  .desc {
    font-size: 17px;
    color: var(--dim);
    line-height: 1.72;
    letter-spacing: -0.2px;
    max-width: 440px;
    margin-bottom: 52px;
  }

  /* ---- TASKS ---- */
  .tasks {
    display: flex;
    flex-direction: column;
    gap: 0;
    margin-bottom: 60px;
    border: 1px solid var(--border);
    border-radius: 14px;
    overflow: hidden;
    background: #111;
  }

  .task {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding: 16px 20px;
    border-bottom: 1px solid var(--border);
    transition: background 0.15s;
    cursor: default;
  }

  .task:last-child { border-bottom: none; }
  .task:hover { background: rgba(255,255,255,0.02); }

  .task-icon {
    font-size: 15px;
    line-height: 1;
    margin-top: 1px;
    flex-shrink: 0;
    width: 20px;
    text-align: center;
  }

  .task-text {
    font-size: 14px;
    color: var(--dim);
    letter-spacing: -0.1px;
    line-height: 1.5;
  }

  .task-text strong {
    color: var(--text);
    font-weight: 500;
  }

  /* ---- CTA ---- */
  .cta-pre {
    font-size: 13px;
    color: var(--dimmer);
    margin-bottom: 12px;
    letter-spacing: 0.2px;
  }

  .cta-stack {
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-width: 360px;
  }

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

  .btn-ghost:hover {
    background: rgba(255,255,255,0.07);
  }

  .btn-red {
    background: var(--red);
    color: #fff;
  }

  .btn-red:hover {
    background: #ff5555;
  }

  .btn-right {
    font-size: 12px;
    font-weight: 400;
    opacity: 0.5;
  }

  .count-line {
    font-size: 12px;
    color: var(--dimmer);
    margin-top: 5px;
    padding-left: 2px;
    min-height: 17px;
    transition: color 0.3s;
  }

  .count-line.lit { color: var(--red); }

  /* ---- CLOSER ---- */
  .sep { width: 28px; height: 1px; background: var(--border); margin: 52px 0; }

  .closer {
    font-size: 13px;
    color: var(--dimmer);
    line-height: 1.8;
    letter-spacing: 0.1px;
  }

  .closer span {
    color: var(--red);
    opacity: 0.8;
  }

  @media (max-width: 480px) {
    main { padding: 64px 22px 60px; }
    .cta-stack { max-width: 100%; }
    h1 { letter-spacing: -2px; }
  }
</style>
</head>
<body>
<main>

  <!-- notch indicator -->
  <div class="notch-wrap">
    <div class="notch-bar">
      <div class="notch-dot"></div>
      chotu is here
    </div>
  </div>

  <!-- headline -->
  <h1>lives in your notch.<br>handles the <em>rest.</em></h1>

  <!-- desc -->
  <p class="desc">
    you open your phone to do one thing and end up doing five other things. chotu sits in your notch, takes the task, and gets it done — while you stay in your world.
  </p>

  <!-- tasks list -->
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
  </div>

  <!-- cta -->
  <p class="cta-pre">want this?</p>

  <div class="cta-stack">
    <div>
      <button class="btn btn-ghost" onclick="increment('curious')">
        <span>i'm curious — try it out</span>
        <span class="btn-right">not sure yet →</span>
      </button>
      <div class="count-line" id="curious-count"></div>
    </div>
    <div>
      <button class="btn btn-red" onclick="increment('pay')">
        <span>i'll pay $9/month</span>
        <span class="btn-right">yes, take my money →</span>
      </button>
      <div class="count-line" id="pay-count"></div>
    </div>
  </div>

  <div class="sep"></div>

  <div class="closer">
    no gazillion tabs. no getting sucked in.<br>
    just you, your work, and <span>chotu</span> handling the noise.
  </div>

</main>

<script>
  let counts = { curious: 0, pay: 0 };
  try {
    const s = localStorage.getItem('chotu_counts');
    if (s) counts = JSON.parse(s);
  } catch(e) {}

  function save() {
    try { localStorage.setItem('chotu_counts', JSON.stringify(counts)); } catch(e) {}
  }

  function increment(type) {
    counts[type]++;
    save();
    render(type);
  }

  function render(type) {
    const n = counts[type];
    const el = document.getElementById(type + '-count');
    if (n === 0) { el.textContent = ''; return; }
    el.textContent = type === 'pay'
      ? \`\${n} \${n === 1 ? 'person' : 'people'} willing to pay\`
      : \`\${n} \${n === 1 ? 'person' : 'people'} curious\`;
    el.classList.add('lit');
    setTimeout(() => el.classList.remove('lit'), 1000);
  }

  if (counts.curious > 0) render('curious');
  if (counts.pay > 0) render('pay');
</script>
</body>
</html>`;

export async function GET() {
  return new NextResponse(HTML, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
