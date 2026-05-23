/**
 * Blog.jsx
 * ─────────────────────────────────────────────
 * Two responsibilities:
 *  1. Inject global CSS (animations, shared classes) — always
 *  2. Export BlogInit — mount this once inside your Router to
 *     wire up React Router's navigate to the store
 *
 * The full-screen overlay is REMOVED. Blog posts now open as
 * real pages at /blog/:slug via BlogPostPage.jsx
 * ─────────────────────────────────────────────
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setNavigate, initScrollReveal } from './Blogstore';

/* ─────────────────────────────────────────────
   GLOBAL CSS — injected once for all siblings
───────────────────────────────────────────── */
const BLOG_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Manrope:wght@400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  ::selection              { background: #FF6B00; color: #fff; }
  ::-webkit-scrollbar      { width: 3px; }
  ::-webkit-scrollbar-track  { background: #f5f5f5; }
  ::-webkit-scrollbar-thumb  { background: #FF6B00; border-radius: 2px; }

  html, body { overflow-x: clip; max-width: 100vw; }

  /* ── Keyframes ── */
  @keyframes fadeUp   { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  @keyframes ticker   { from { transform:translateX(0); }              to { transform:translateX(-50%); } }
  @keyframes pulseDot { 0%,100% { box-shadow:0 0 0 0 rgba(255,107,0,.4); } 50% { box-shadow:0 0 0 8px rgba(255,107,0,0); } }
  @keyframes shimmer  { 0% { background-position:-200% center; }       100% { background-position:200% center; } }
  @keyframes float    { 0%,100% { transform:translateY(0); }           50%  { transform:translateY(-8px); } }

  /* ── Shared components ── */
  .sec-label {
    display:inline-flex; align-items:center; gap:8px;
    font-family:'Manrope',sans-serif; font-weight:700; font-size:.7rem;
    letter-spacing:.2em; color:#FF6B00; text-transform:uppercase; margin-bottom:16px;
  }
  .sec-label::before {
    content:''; width:10px; height:10px; border-radius:50%;
    background:#FF6B00; display:inline-block; animation:pulseDot 2s ease infinite;
  }

  .btn-primary {
    display:inline-flex; align-items:center; gap:8px;
    background:#FF6B00; color:#fff; border:none; border-radius:12px;
    font-family:'Manrope',sans-serif; font-weight:700; cursor:pointer; text-decoration:none;
    transition:transform .2s,box-shadow .2s,background .2s;
    box-shadow:0 4px 20px rgba(255,107,0,.35);
  }
  .btn-primary:hover { background:#e55f00; transform:translateY(-2px); box-shadow:0 8px 32px rgba(255,107,0,.45); }

  .btn-outline {
    display:inline-flex; align-items:center; gap:8px;
    background:transparent; color:#0A0A0A; border:1.5px solid rgba(0,0,0,.14);
    border-radius:12px; font-family:'Manrope',sans-serif; font-weight:600;
    cursor:pointer; text-decoration:none; transition:transform .2s,border-color .2s,background .2s;
  }
  .btn-outline:hover { border-color:#FF6B00; color:#FF6B00; transform:translateY(-2px); }

  .reveal {
    opacity:0; transform:translateY(28px);
    transition:opacity .7s ease, transform .7s ease;
    will-change:opacity, transform;
  }
  .reveal.visible { opacity:1; transform:translateY(0); will-change:auto; }
`;

/* ─────────────────────────────────────────────
   SKELETON — reused by BlogHero, BlogGrid etc.
───────────────────────────────────────────── */
export function Skeleton({ w = '100%', h = 16, r = 4, mb = 0 }) {
  return (
    <div
      style={{
        width: w, height: h, borderRadius: r, marginBottom: mb,
        background: 'linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.4s ease-in-out infinite',
      }}
    />
  );
}

/* ─────────────────────────────────────────────
   BlogInit — mount once inside your <Router>
   Wires React Router's navigate to the store
   so openPost() navigates to /blog/:slug
───────────────────────────────────────────── */
export function BlogInit() {
  const navigate = useNavigate();
  useEffect(() => { setNavigate(navigate); }, [navigate]);
  return null;
}

/* ─────────────────────────────────────────────
   Blog — inject global CSS + boot scroll reveal
   Mount inside BlogPage (unchanged)
───────────────────────────────────────────── */
export default function Blog() {
  useEffect(() => { initScrollReveal(); }, []);
  return <style dangerouslySetInnerHTML={{ __html: BLOG_CSS }} />;
}