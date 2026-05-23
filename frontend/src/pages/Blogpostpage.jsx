/**
 * BlogPostPage.jsx
 * ─────────────────────────────────────────────
 * Rendered at /blog/:slug
 * Reads the slug from the URL, finds the post
 * in the store (or lets Blogpost fetch from Sanity),
 * and renders it as a real page below your navbar.
 * ─────────────────────────────────────────────
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBlogData, setNavigate } from '../components/blogcomp/Blogstore';
import BlogPost from '../components/blogcomp/Blogpost';

/* Global CSS (same keyframes Blog.jsx injects on the listing page) */
const PAGE_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Manrope:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  ::selection { background: #FF6B00; color: #fff; }
  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-thumb { background: #FF6B00; border-radius: 2px; }
  html, body { overflow-x: clip; }
  @keyframes fadeUp   { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  @keyframes shimmer  { 0% { background-position:-200% center; } 100% { background-position:200% center; } }
  @keyframes pulseDot { 0%,100% { box-shadow:0 0 0 0 rgba(255,107,0,.4); } 50% { box-shadow:0 0 0 8px rgba(255,107,0,0); } }
  @keyframes float    { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-8px); } }
  .btn-primary {
    display:inline-flex; align-items:center; gap:8px;
    background:#FF6B00; color:#fff; border:none; border-radius:12px;
    font-family:'Manrope',sans-serif; font-weight:700; cursor:pointer; text-decoration:none;
    transition:transform .2s,box-shadow .2s,background .2s;
    box-shadow:0 4px 20px rgba(255,107,0,.35);
  }
  .btn-primary:hover { background:#e55f00; transform:translateY(-2px); box-shadow:0 8px 32px rgba(255,107,0,.45); }
`;

export default function BlogPostPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { posts, loading } = useBlogData();
  const [post, setPost] = useState(null);

  // Register navigate so openPostBySlug (related posts) works
  useEffect(() => { setNavigate(navigate); }, [navigate]);

  // Find the post in the already-loaded store data
  useEffect(() => {
    if (!posts.length) return;
    const found = posts.find(p => p.slug === slug || String(p.id) === slug);
    if (found) setPost(found);
  }, [posts, slug]);

  // Scroll to top on mount
  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: PAGE_CSS }} />

      {/* Offset for your fixed global navbar */}
      <div style={{minHeight: '100vh', background: '#F9F7F5' }}>

        {/* Loading state — post data hasn't arrived yet */}
        {loading && !post && <LoadingSkeleton />}

        {/* Post not found */}
        {!loading && !post && (
          <div style={{ textAlign: 'center', padding: '100px 24px', fontFamily: "'Manrope',sans-serif" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '2rem', color: '#0A0A0A', marginBottom: 12 }}>
              POST NOT FOUND
            </h2>
            <p style={{ color: '#888', marginBottom: 32 }}>This article doesn't exist or may have been removed.</p>
            <button
              onClick={() => navigate('/blog')}
              style={{ background: '#FF6B00', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 28px', fontFamily: "'Manrope',sans-serif", fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
            >
              ← Back to Blog
            </button>
          </div>
        )}

        {/* The actual post */}
        {post && (
          <BlogPost
            post={post}
            onBack={() => navigate('/blog')}
            onReadRelated={(relSlug) => navigate(`/blog/${relSlug}`)}
          />
        )}
      </div>
    </>
  );
}

/* Simple full-page skeleton while data loads */
function LoadingSkeleton() {
  const sk = (w, h, mb = 12, r = 4) => (
    <div style={{ width: w, height: h, borderRadius: r, marginBottom: mb, background: 'linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s ease-in-out infinite' }} />
  );
  return (
    <div>
      {/* Hero image skeleton */}
      <div style={{ width: '100%', height: 'clamp(220px,38vw,520px)', background: 'linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s ease-in-out infinite' }} />
      <div style={{ maxWidth: 760, margin: '32px auto', padding: '0 clamp(16px,4vw,64px)' }}>
        {sk('120px', 24, 24, 100)}
        {sk('90%', 40, 12, 6)}
        {sk('70%', 40, 32, 6)}
        {[100, 82, 96, 70, 88, 60].map((w, i) => sk(`${w}%`, 15, 10, 4))}
      </div>
    </div>
  );
}