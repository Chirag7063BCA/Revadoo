import React, { useState, useEffect, useRef } from 'react';
import { useBlogData, openPost } from './Blogstore';
import { Skeleton } from './Blog';

const ORANGE = '#FF6B00';
const DARK   = '#0A0A0A';

/* ─────────────────────────────────────────────
   Returns "2h ago", "3d ago" etc. for recent posts
   Returns null if older than 7 days
───────────────────────────────────────────── */
function timeAgo(dateStr) {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  if (isNaN(date)) return null;
  const mins  = Math.floor((Date.now() - date) / 60000);
  const hours = Math.floor(mins  / 60);
  const days  = Math.floor(hours / 24);
  if (mins  < 1)  return 'Just now';
  if (mins  < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days  < 7)  return `${days}d ago`;
  return null;
}

/* ─────────────────────────────────────────────
   NEW POST TOAST
   Shows at top of hero when a newer post arrives
   while the user is already on the page
───────────────────────────────────────────── */
function NewPostToast({ post, onView }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Small delay so it animates in cleanly
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, [post?.id]);

  if (!post) return null;

  return (
    <div
      role="alert"
      aria-live="polite"
      style={{
        position: 'fixed',
        top: 'calc(var(--global-nav-height, 64px) + 16px)',
        left: '50%',
        transform: visible ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(-20px)',
        opacity: visible ? 1 : 0,
        transition: 'all 0.4s cubic-bezier(0.34,1.56,0.64,1)',
        zIndex: 999,
        background: '#0A0A0A',
        border: '1px solid rgba(255,107,0,0.4)',
        borderRadius: 12,
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        boxShadow: '0 8px 40px rgba(0,0,0,0.25)',
        maxWidth: 'calc(100vw - 32px)',
        pointerEvents: 'all',
      }}
    >
      {/* Pulsing dot */}
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: ORANGE, flexShrink: 0, animation: 'pulseDot 2s infinite' }} />

      <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 13, fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 220 }}>
        New post: {post.title}
      </span>

      <button
        onClick={() => onView(post)}
        style={{ background: ORANGE, border: 'none', borderRadius: 8, padding: '6px 14px', fontFamily: "'Manrope',sans-serif", fontWeight: 700, fontSize: 12, color: '#fff', cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap' }}
      >
        View →
      </button>

      <button
        onClick={() => setVisible(false)}
        aria-label="Dismiss"
        style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 16, lineHeight: 1, padding: 0, flexShrink: 0 }}
      >
        ×
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────
   HERO SKELETON
───────────────────────────────────────────── */
function HeroSkeleton() {
  return (
    <>
      <style>{`
        .hero-skel-grid { display:grid; grid-template-columns:1fr 1fr; gap:64px; align-items:center; }
        @media(max-width:900px){ .hero-skel-grid{ grid-template-columns:1fr; gap:32px; } }
      `}</style>
      <div className="hero-skel-grid">
        <div>
          <Skeleton w="130px" h={24} r={100} mb={24} />
          <Skeleton w="95%"   h={48} r={6}   mb={14} />
          <Skeleton w="78%"   h={48} r={6}   mb={28} />
          <Skeleton w="100%"  h={16} r={4}   mb={10} />
          <Skeleton w="88%"   h={16} r={4}   mb={10} />
          <Skeleton w="70%"   h={16} r={4}   mb={36} />
          <Skeleton w="170px" h={50} r={12}  mb={0}  />
        </div>
        <Skeleton w="100%" h={420} r={16} />
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────────── */
export default function BlogHero() {
  const { posts, loading } = useBlogData();

  // Track the post id that was showing when the page first loaded
  const initialPostId = useRef(null);
  const [newPost, setNewPost] = useState(null);

  /*
    posts[0] is always the latest because:
    - Sanity GROQ query uses `order(publishedAt desc)`
    - Fallback array is also newest-first
    No manual `featured` flag needed.
  */
  const latestPost = posts[0] || null;

  // Detect when a genuinely new post arrives after initial load
  useEffect(() => {
    if (!latestPost || loading) return;

    if (!initialPostId.current) {
      // First load — store the id, nothing to notify
      initialPostId.current = latestPost.id;
      return;
    }

    if (latestPost.id !== initialPostId.current) {
      // A new post is now at position [0] — show the toast
      setNewPost(latestPost);
      initialPostId.current = latestPost.id;
    }
  }, [latestPost?.id, loading]);

  return (
    <>
      {/* New-post toast — only appears mid-session when a post is published */}
      <NewPostToast post={newPost} onView={(post) => { setNewPost(null); openPost(post); }} />

      <section
        aria-labelledby="hero-post-title"
        style={{
          background: '#fff',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          padding: 'clamp(40px,6vw,80px) clamp(16px,5vw,64px)',
          overflowX: 'clip',
        }}
      >
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          {loading    ? <HeroSkeleton /> :
           latestPost ? <HeroContent post={latestPost} /> :
           null}
        </div>
      </section>
    </>
  );
}

/* ─────────────────────────────────────────────
   HERO CONTENT
───────────────────────────────────────────── */
function HeroContent({ post }) {
  const ago = timeAgo(post.date || post.publishedAt);

  return (
    <article
      itemScope
      itemType="https://schema.org/BlogPosting"
      className="hero-grid"
    >
      <style>{`
        .hero-grid {
          display:grid; grid-template-columns:1fr 1fr;
          gap:clamp(28px,5vw,72px); align-items:center;
          animation:fadeUp 0.55s ease forwards;
        }
        .hero-img-col { position:relative; }
        @media(max-width:900px){
          .hero-grid { grid-template-columns:1fr; }
          .hero-img-col { order:-1; }
        }
        @media(max-width:640px){ .hero-floats{ display:none !important; } }
        .hero-float-badge { will-change:transform; transform:translateZ(0); }
      `}</style>

      {/* Left: copy */}
      <div style={{ minWidth: 0 }}>

        {/* Badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, marginBottom: 22 }}>

          {/* Latest post badge — always shown */}
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: '#FFF5EE', border: '1px solid rgba(255,107,0,0.25)',
            borderRadius: 100, padding: '5px 14px',
            fontFamily: "'Manrope',sans-serif", fontWeight: 700,
            fontSize: 10, color: ORANGE, letterSpacing: '0.1em', textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%', background: ORANGE,
              display: 'inline-block',
              // Pulse only if the post is recent
              animation: ago ? 'pulseDot 1.8s ease-in-out infinite' : 'none',
            }} />
            Latest Post
          </span>

          {/* Category */}
          <span style={{
            background: ORANGE, color: '#fff', borderRadius: 100, padding: '5px 16px',
            fontFamily: "'Manrope',sans-serif", fontWeight: 700,
            fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
            maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {post.category}
          </span>

          {/* Read time */}
          <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 13, color: '#999', whiteSpace: 'nowrap' }}>
            {post.readTime}
          </span>

          {/* Green "time ago" badge — only if post is less than 7 days old */}
          {ago && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: '#F0FAF4', border: '1px solid #BBF0D0',
              borderRadius: 100, padding: '4px 12px',
              fontFamily: "'Manrope',sans-serif", fontWeight: 700,
              fontSize: 10, color: '#16a34a', letterSpacing: '0.08em',
              whiteSpace: 'nowrap',
            }}>
              🟢 {ago}
            </span>
          )}
        </div>

        {/* Title */}
        <h1
          id="hero-post-title"
          itemProp="headline"
          style={{
            fontFamily: "'Bebas Neue',sans-serif",
            fontSize: 'clamp(2rem,4.5vw,4rem)',
            lineHeight: 0.95, letterSpacing: '0.03em', color: DARK,
            marginBottom: 18, textTransform: 'uppercase',
            wordBreak: 'break-word', overflowWrap: 'break-word',
            display: '-webkit-box', WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}
        >
          {post.title}
        </h1>

        {/* Excerpt */}
        <p
          itemProp="description"
          style={{
            fontFamily: "'Manrope',sans-serif",
            fontSize: 'clamp(14px,1.1vw,16px)',
            lineHeight: 1.8, color: '#666', marginBottom: 28,
            wordBreak: 'break-word', overflowWrap: 'break-word',
            display: '-webkit-box', WebkitLineClamp: 4,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}
        >
          {post.excerpt}
        </p>

        {/* Author */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32, minWidth: 0 }}
          itemProp="author" itemScope itemType="https://schema.org/Person"
        >
          {post._avatar
            ? <img src={post._avatar} alt={post.author} width={40} height={40} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '2px solid #E8E8E8', flexShrink: 0 }} />
            : <div style={{ width: 40, height: 40, borderRadius: '50%', background: ORANGE, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Bebas Neue',sans-serif", fontSize: 18, color: '#fff', flexShrink: 0 }}>{post.author[0]}</div>
          }
          <div style={{ minWidth: 0 }}>
            <div itemProp="name" style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 700, fontSize: 14, color: DARK, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.author}</div>
            <div style={{ fontFamily: "'Manrope',sans-serif", fontSize: 12, color: '#999', marginTop: 1 }} itemProp="datePublished">{post.date}</div>
          </div>
        </div>

        {/* CTA */}
        <button
          className="btn-primary"
          onClick={() => openPost(post)}
          style={{ fontSize: 'clamp(0.85rem,1.2vw,0.95rem)', padding: 'clamp(12px,2vw,14px) clamp(24px,3vw,32px)' }}
          aria-label={`Read article: ${post.title}`}
        >
          Read Article
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </div>

      {/* Right: image */}
      <div className="hero-img-col">
        <div
          onClick={() => openPost(post)}
          style={{ borderRadius: 16, overflow: 'hidden', aspectRatio: '4/3', cursor: 'pointer', boxShadow: '0 24px 80px rgba(0,0,0,0.1)', width: '100%' }}
        >
          <img
            src={post.img} alt={post.title} itemProp="image" loading="eager"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block', transition: 'transform 0.6s ease' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          />
        </div>

        {/* Float badges */}
        <div className="hero-floats hero-float-badge" style={{ position: 'absolute', bottom: -20, left: -24, background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, padding: '14px 20px', boxShadow: '0 8px 30px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: 12, animation: 'float 3s ease-in-out infinite' }}>
          <span style={{ fontSize: 22 }}>🔥</span>
          <div>
            <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 18, color: ORANGE, lineHeight: 1 }}>7-Day</div>
            <div style={{ fontFamily: "'Manrope',sans-serif", fontSize: 11, color: '#999' }}>Streak active</div>
          </div>
        </div>

        <div className="hero-floats hero-float-badge" style={{ position: 'absolute', top: -16, right: -16, background: ORANGE, borderRadius: 12, padding: '12px 18px', boxShadow: '0 8px 30px rgba(255,107,0,0.35)', color: '#fff', animation: 'float 3.5s ease-in-out infinite 0.5s' }}>
          <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 20, lineHeight: 1 }}>+500</div>
          <div style={{ fontFamily: "'Manrope',sans-serif", fontSize: 10, fontWeight: 700, opacity: 0.85, letterSpacing: '0.05em' }}>BONUS PTS</div>
        </div>
      </div>
    </article>
  );
}