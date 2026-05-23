const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=JetBrains+Mono:wght@400;600&family=Manrope:wght@400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }

  body {
    font-family: 'Manrope', sans-serif;
    background: #FAFAFA;
    color: #0A0A0A;
    overflow-x: hidden;
  }

  :root {
    --orange: #FF6B00;
    --orange-light: #FFF5EE;
    --orange-mid: rgba(255,107,0,0.12);
    --dark: #0A0A0A;
    --mid: #555555;
    --soft: #999999;
    --line: rgba(0,0,0,0.08);
  }

  /* ── Scrollbar ── */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #f0f0f0; }
  ::-webkit-scrollbar-thumb { background: var(--orange); border-radius: 4px; }

  /* ── Keyframes ── */
  @keyframes float {
    0%,100% { transform: translateY(0px); }
    50%      { transform: translateY(-12px); }
  }
  @keyframes floatX {
    0%,100% { transform: translate(0,0) rotate(0deg); }
    33%      { transform: translate(8px,-14px) rotate(6deg); }
    66%      { transform: translate(-6px,-8px) rotate(-4deg); }
  }
  @keyframes pulse-dot {
    0%,100% { box-shadow: 0 0 0 0 rgba(255,107,0,0.4); }
    50%      { box-shadow: 0 0 0 8px rgba(255,107,0,0); }
  }
  @keyframes spin-slow { from { transform: rotate(0deg); }   to { transform: rotate(360deg); } }
  @keyframes spin-rev  { from { transform: rotate(0deg); }   to { transform: rotate(-360deg); } }
  @keyframes orbit {
    from { transform: rotate(0deg) translateX(52px) rotate(0deg); }
    to   { transform: rotate(360deg) translateX(52px) rotate(-360deg); }
  }
  @keyframes orbit2 {
    from { transform: rotate(180deg) translateX(36px) rotate(-180deg); }
    to   { transform: rotate(540deg) translateX(36px) rotate(-540deg); }
  }
  @keyframes reveal-up {
    from { opacity:0; transform:translateY(40px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes bar-fill  { from { width: 0%; } to { width: var(--w); } }
  @keyframes barGrow   { from { width: 0%; } to { width: var(--bw, 70%); } }
  @keyframes count-up {
    from { opacity:0; transform: scale(0.7); }
    to   { opacity:1; transform: scale(1); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes card-hover-glow {
    0%,100% { box-shadow: 0 8px 32px rgba(255,107,0,0.08); }
    50%      { box-shadow: 0 16px 48px rgba(255,107,0,0.18); }
  }
  @keyframes ticker   { from { transform: translateX(0); } to { transform: translateX(-50%); } }
  @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
  @keyframes coinFlip {
    0%   { transform: rotateY(0deg) scale(1); }
    50%  { transform: rotateY(90deg) scale(1.1); }
    100% { transform: rotateY(180deg) scale(1); }
  }
  @keyframes levelPulse {
    0%,100% { transform: scale(1); }
    50%      { transform: scale(1.06); }
  }
  @keyframes gradMove {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes phoneFloat {
    0%,100% { transform: translateY(0px) rotate(1.5deg); }
    50%      { transform: translateY(-20px) rotate(-1deg); }
  }
  @keyframes screenGlow {
    0%,100% { box-shadow: 0 32px 80px rgba(255,107,0,0.18), 0 0 0 1px rgba(255,107,0,0.1); }
    50%      { box-shadow: 0 40px 100px rgba(255,107,0,0.28), 0 0 0 1px rgba(255,107,0,0.18); }
  }
  @keyframes notifSlide {
    0%   { opacity:0; transform: translateY(-12px); }
    15%  { opacity:1; transform: translateY(0); }
    80%  { opacity:1; transform: translateY(0); }
    100% { opacity:0; transform: translateY(-12px); }
  }
  @keyframes slideInRight {
    from { opacity:0; transform: translateX(32px); }
    to   { opacity:1; transform: translateX(0); }
  }
  @keyframes slideOutLeft {
    from { opacity:1; transform: translateX(0); }
    to   { opacity:0; transform: translateX(-32px); }
  }
  @keyframes dotPop {
    0%,100% { transform: scale(1); }
    50%      { transform: scale(1.35); }
  }

  /* ── Buttons ── */
  .btn-primary {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--orange); color: #fff; border: none;
    border-radius: 12px; font-family: 'Manrope', sans-serif;
    font-weight: 700; cursor: pointer; text-decoration: none;
    transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
    box-shadow: 0 4px 20px rgba(255,107,0,0.35);
  }
  .btn-primary:hover {
    background: #e55f00; transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(255,107,0,0.45);
  }
  .btn-outline {
    display: inline-flex; align-items: center; gap: 8px;
    background: transparent; color: var(--dark);
    border: 1.5px solid rgba(0,0,0,0.14); border-radius: 12px;
    font-family: 'Manrope', sans-serif; font-weight: 600;
    cursor: pointer; text-decoration: none;
    transition: transform 0.2s, border-color 0.2s, background 0.2s;
  }
  .btn-outline:hover { border-color: var(--orange); color: var(--orange); transform: translateY(-2px); }

  /* ── Section label ── */
  .sec-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.72rem; letter-spacing: 0.14em;
    color: var(--orange); text-transform: uppercase;
    margin-bottom: 16px; display: inline-flex; align-items: center; gap: 8px;
  }
  .sec-label::before {
    content: ''; display: inline-block;
    width: 24px; height: 2px;
    background: var(--orange); border-radius: 2px;
  }

  /* ── Scroll reveal ── */
  .reveal { opacity: 0; transform: translateY(30px); transition: opacity 0.7s ease, transform 0.7s ease; }
  .reveal.visible { opacity: 1; transform: translateY(0); }

  /* ── Hero two-column layout ── */
  .hero-inner {
    display: flex; align-items: center; justify-content: space-between;
    gap: 48px; width: 100%; max-width: 1380px; margin: 0 auto; padding: 80px 48px;
  }
  .hero-left { flex: 1 1 0; min-width: 0; }
  .hero-right {
    flex: 0 0 auto; display: flex;
    align-items: center; justify-content: center; padding: 40px 0;
  }

  /* ── Responsive: tablet (≤ 900px) ──
     Stack vertically, show phone below copy (scaled down) */
  @media (max-width: 900px) {
    .hero-inner {
      flex-direction: column !important;
      align-items: center !important;
      padding: 80px 32px 60px !important;
      gap: 32px !important;
      text-align: center !important;
    }
    .hero-left {
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
    }
    .hero-right {
      display: flex !important;
      transform: scale(0.88) !important;
      transform-origin: top center !important;
    }
    .hero-ctas { justify-content: center !important; }
    .hero-trust { justify-content: center !important; }
    .hero-scroll { display: none !important; }
  }

  /* ── Responsive: mobile (≤ 600px) ── */
  @media (max-width: 600px) {
    .hero-inner         { padding: 72px 16px 48px !important; gap: 24px !important; }
    .hero-right         { transform: scale(0.78) !important; transform-origin: top center !important; }
    .hero-trust-divider { display: none !important; }
    .hero-trust         { gap: 16px !important; flex-direction: column !important; align-items: center !important; }
    .hero-ctas          { flex-direction: column !important; gap: 12px !important; align-items: center !important; }
    .hero-ctas a        { width: 100% !important; max-width: 320px !important; justify-content: center !important; }
    .hero-badge span    { font-size: 0.64rem !important; }
  }

  /* ── Responsive: small phones (≤ 380px) ── */
  @media (max-width: 380px) {
    .hero-inner { padding: 64px 12px 40px !important; }
    .hero-right { transform: scale(0.68) !important; }
  }
`

export default GLOBAL_CSS