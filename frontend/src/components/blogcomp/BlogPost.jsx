/**
 * Blogpost.jsx
 * ─────────────────────────────────────────────
 * Full post view rendered as a real page.
 * Reading progress now tracks window scroll.
 * Overlay-specific padding removed — BlogPostPage
 * handles spacing via --global-nav-height.
 * ─────────────────────────────────────────────
 */

import { useState, useEffect } from 'react';
import { client, urlFor, POST_QUERY, fmtDate } from './sanity';
import { closePost, openPostBySlug } from './Blogstore';

const ORANGE = '#FF6B00';
const DARK   = '#0A0A0A';

/* ─────────────────────────────────────────────
   READING PROGRESS BAR
   Fixed at top of viewport, tracks window scroll
───────────────────────────────────────────── */
function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fn = () => {
      const el = document.documentElement;
      const pct = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;
      setProgress(Math.min(100, Math.max(0, pct)));
    };
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{ position: 'fixed', top: 'var(--global-nav-height, 64px)', left: 0, right: 0, height: 3, zIndex: 99, background: 'rgba(0,0,0,0.08)' }}
    >
      <div style={{ height: '100%', width: `${progress}%`, background: ORANGE, transition: 'width 0.1s linear' }} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   HERO IMAGE
───────────────────────────────────────────── */
function PostHero({ heroImg, title }) {
  return (
    <header style={{ position: 'relative', width: '100%', overflow: 'hidden', background: '#111' }}>
      <img
        src={heroImg}
        alt={title || ''}
        style={{ width: '100%', height: 'clamp(220px,38vw,520px)', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
      />
      <div
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom,rgba(249,247,245,0) 30%,rgba(249,247,245,0.6) 70%,rgba(249,247,245,1) 100%)', pointerEvents: 'none' }}
      />
    </header>
  );
}

/* ─────────────────────────────────────────────
   POST META  (category · date · title · excerpt)
───────────────────────────────────────────── */
function PostMeta({ category, date, readTime, title, excerpt }) {
  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 clamp(16px,4vw,64px)', animation: 'fadeUp 0.5s ease forwards' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 'clamp(-12px,-2vw,-24px)', marginBottom: 16, position: 'relative', zIndex: 2, flexWrap: 'wrap' }}>
        <span style={{ background: ORANGE, color: '#fff', borderRadius: 100, padding: '5px 16px', fontFamily: "'Manrope',sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{category}</span>
        <span style={{ color: '#aaa', fontSize: 13, fontFamily: "'Manrope',sans-serif" }}>{date}</span>
        <span style={{ color: '#ddd' }}>·</span>
        <span style={{ color: '#aaa', fontSize: 13, fontFamily: "'Manrope',sans-serif" }}>{readTime}</span>
      </div>
      <h1
        itemProp="headline"
        style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(1.8rem,5vw,3.6rem)', letterSpacing: '0.03em', lineHeight: 0.95, color: DARK, marginBottom: 16, textTransform: 'uppercase', wordBreak: 'break-word' }}
      >
        {title}
      </h1>
      {excerpt && (
        <p
          itemProp="description"
          style={{ fontFamily: "'Manrope',sans-serif", fontSize: 'clamp(14px,1vw,17px)', lineHeight: 1.8, color: '#666', marginBottom: 24, wordBreak: 'break-word', display: '-webkit-box', WebkitLineClamp: 5, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
        >
          {excerpt}
        </p>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   SHARE BAR
───────────────────────────────────────────── */
function ShareBar({ title }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
      <span style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: '0.14em', color: '#aaa', textTransform: 'uppercase', marginRight: 4 }}>Share</span>
      {[
        { label: 'Twitter',  href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(window.location.href)}` },
        { label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}` },
      ].map(s => (
        <a
          key={s.label}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 100, padding: '6px 14px', fontFamily: "'Manrope',sans-serif", fontWeight: 700, fontSize: 12, color: '#666', textDecoration: 'none', transition: 'all 0.18s' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = ORANGE; e.currentTarget.style.color = ORANGE; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)'; e.currentTarget.style.color = '#666'; }}
        >
          {s.label}
        </a>
      ))}
      <button
        onClick={copy}
        style={{ background: copied ? '#F0FAF4' : '#fff', border: `1px solid ${copied ? '#BBF0D0' : 'rgba(0,0,0,0.1)'}`, borderRadius: 100, padding: '6px 14px', fontFamily: "'Manrope',sans-serif", fontWeight: 700, fontSize: 12, color: copied ? '#16a34a' : '#666', cursor: 'pointer', transition: 'all 0.25s' }}
      >
        {copied ? '✓ Copied!' : 'Copy Link'}
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────
   TABLE OF CONTENTS
───────────────────────────────────────────── */
function TableOfContents({ headings, activeId }) {
  if (!headings.length) return null;
  return (
    <nav aria-label="Table of contents" style={{ position: 'sticky', top: 'calc(var(--global-nav-height, 64px) + 24px)', maxHeight: 'calc(100vh - 100px)', overflowY: 'auto', paddingBottom: 20 }}>
      <div style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: '0.16em', color: '#aaa', textTransform: 'uppercase', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 18, height: 2, background: ORANGE, borderRadius: 1 }} /> Contents
      </div>
      {headings.map(h => (
        <a
          key={h.id}
          href={`#${h.id}`}
          onClick={e => { e.preventDefault(); document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
          style={{ display: 'block', fontFamily: "'Manrope',sans-serif", fontWeight: h.level === 'h2' ? 700 : 400, fontSize: h.level === 'h2' ? 13 : 12, lineHeight: 1.45, color: activeId === h.id ? ORANGE : '#aaa', textDecoration: 'none', borderLeft: `2px solid ${activeId === h.id ? ORANGE : 'rgba(0,0,0,0.1)'}`, paddingLeft: `${(h.level === 'h3' ? 12 : 0) + 12}px`, paddingTop: 7, paddingBottom: 7, transition: 'all 0.18s ease' }}
        >
          {h.text}
        </a>
      ))}
    </nav>
  );
}

/* ─────────────────────────────────────────────
   ROTATING TIP
───────────────────────────────────────────── */
function RotatingTip({ items = [], label = 'Quick Tip' }) {
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    if (!items.length) return;
    const t = setInterval(() => {
      setFade(false);
      setTimeout(() => { setIdx(i => (i + 1) % items.length); setFade(true); }, 300);
    }, 4000);
    return () => clearInterval(t);
  }, [items.length]);

  if (!items.length) return null;
  return (
    <div style={{ marginTop: 20, background: '#FFF5EE', border: '1px solid rgba(255,107,0,0.2)', borderRadius: 12, padding: '18px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: ORANGE, animation: 'pulseDot 2s infinite' }} />
        <span style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 700, fontSize: 10, color: ORANGE, letterSpacing: '0.16em', textTransform: 'uppercase' }}>{label}</span>
      </div>
      <p style={{ fontFamily: "'Manrope',sans-serif", fontSize: 13, lineHeight: 1.65, color: '#555', margin: 0, opacity: fade ? 1 : 0, transform: fade ? 'translateY(0)' : 'translateY(6px)', transition: 'opacity 0.3s, transform 0.3s' }}>
        {items[idx]}
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────
   VIDEO EMBED
───────────────────────────────────────────── */
function VideoEmbed({ url, caption }) {
  if (!url) return null;
  const embed = raw => {
    if (raw.includes('youtube.com/watch')) return raw.replace('watch?v=', 'embed/');
    if (raw.includes('youtu.be/'))         return raw.replace('youtu.be/', 'www.youtube.com/embed/');
    if (raw.includes('vimeo.com/') && !raw.includes('player.vimeo')) return raw.replace('vimeo.com/', 'player.vimeo.com/video/');
    return raw;
  };
  return (
    <figure style={{ margin: '48px 0', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 8px 40px rgba(0,0,0,0.08)' }}>
      <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, background: '#000' }}>
        <iframe
          src={embed(url)}
          title={caption || 'Article video'}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        />
      </div>
      {caption && (
        <figcaption style={{ padding: '12px 20px', fontFamily: "'Manrope',sans-serif", fontSize: 12, color: '#999', fontStyle: 'italic', background: '#FAFAFA', textAlign: 'center' }}>
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/* ─────────────────────────────────────────────
   PORTABLE TEXT RENDERER
───────────────────────────────────────────── */
function PortableText({ blocks }) {
  if (!blocks?.length) return (
    <p style={{ color: '#888', fontFamily: "'Manrope',sans-serif", fontSize: 16, lineHeight: 1.85 }}>
      No content available yet.
    </p>
  );

  const applyMarks = (text, marks = []) => {
    let node = text;
    if (marks.includes('strong')) node = <strong style={{ color: DARK, fontWeight: 700 }}>{node}</strong>;
    if (marks.includes('em'))     node = <em style={{ fontStyle: 'italic' }}>{node}</em>;
    if (marks.includes('code'))   node = <code style={{ background: '#FFF5F2', border: '1px solid rgba(255,107,0,0.15)', borderRadius: 4, padding: '2px 7px', fontFamily: 'monospace', fontSize: '0.88em', color: ORANGE }}>{node}</code>;
    return node;
  };

  const renderSpan = (s, markDefs = []) => {
    const marks = s.marks || [];
    const linkMark = marks.find(m => markDefs.find(d => d._key === m && d._type === 'link'));
    if (linkMark) {
      const def = markDefs.find(d => d._key === linkMark);
      return <a href={def?.href} target="_blank" rel="noopener noreferrer" style={{ color: ORANGE, textDecoration: 'underline', textDecorationColor: 'rgba(255,107,0,0.35)', textUnderlineOffset: 3 }}>{applyMarks(s.text, marks.filter(m => m !== linkMark))}</a>;
    }
    return applyMarks(s.text, marks);
  };

  const hStyle = { fontFamily: "'Bebas Neue',sans-serif", letterSpacing: '0.04em', color: DARK, lineHeight: 1.1, textTransform: 'uppercase' };

  const renderBlock = (block, idx) => {
    const style = block.style || 'normal';
    const children = (block.children || []).map((c, ci) => <span key={ci}>{renderSpan(c, block.markDefs || [])}</span>);

    if (style === 'h1') return <h1 key={idx} id={`h-${idx}`} style={{ ...hStyle, fontSize: 'clamp(2rem,3.5vw,3rem)', margin: '52px 0 18px', wordBreak: 'break-word' }}>{children}</h1>;
    if (style === 'h2') return <h2 key={idx} id={`h-${idx}`} style={{ ...hStyle, fontSize: 'clamp(1.5rem,2.5vw,2.2rem)', margin: '44px 0 16px', wordBreak: 'break-word' }}>{children}</h2>;
    if (style === 'h3') return <h3 key={idx} id={`h-${idx}`} style={{ ...hStyle, fontSize: 'clamp(1.15rem,1.8vw,1.6rem)', margin: '32px 0 12px', fontWeight: 600, wordBreak: 'break-word' }}>{children}</h3>;
    if (style === 'blockquote') return (
      <blockquote key={idx} style={{ borderLeft: `3px solid ${ORANGE}`, margin: '36px 0', padding: '20px 28px', background: '#FFF5EE', borderRadius: '0 10px 10px 0' }}>
        <p style={{ fontFamily: "'Bebas Neue',sans-serif", fontWeight: 600, fontSize: 'clamp(1.2rem,2vw,1.5rem)', color: DARK, lineHeight: 1.4, margin: 0, letterSpacing: '0.03em', wordBreak: 'break-word' }}>{children}</p>
      </blockquote>
    );
    return <p key={idx} style={{ fontFamily: "'Manrope',sans-serif", fontSize: 'clamp(15px,1vw,17px)', lineHeight: 1.85, color: '#555', margin: '0 0 22px', wordBreak: 'break-word', overflowWrap: 'break-word' }}>{children}</p>;
  };

  const elements = [];
  let listItems = [];
  let listType = null;

  const flushList = k => {
    if (!listItems.length) return;
    const Tag = listType === 'bullet' ? 'ul' : 'ol';
    elements.push(
      <Tag key={`l-${k}`} style={{ fontFamily: "'Manrope',sans-serif", fontSize: 'clamp(15px,1vw,17px)', lineHeight: 1.85, color: '#555', margin: '20px 0 26px', paddingLeft: 26 }}>
        {listItems.map((li, i) => (
          <li key={i} style={{ marginBottom: 8, paddingLeft: 4, wordBreak: 'break-word' }}>
            {(li.children || []).map((c, ci) => <span key={ci}>{renderSpan(c, li.markDefs || [])}</span>)}
          </li>
        ))}
      </Tag>
    );
    listItems = [];
    listType = null;
  };

  blocks.forEach((b, idx) => {
    if (b._type === 'block' && b.listItem) {
      if (listType && listType !== b.listItem) flushList(idx);
      listType = b.listItem;
      listItems.push(b);
    } else {
      flushList(idx);
      if (b._type === 'image') {
        const src = urlFor(b)?.width(900).url();
        elements.push(
          <figure key={idx} style={{ margin: '44px 0', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.07)' }}>
            <img src={src} alt={b.alt || ''} style={{ width: '100%', display: 'block', objectFit: 'cover' }} loading="lazy" />
            {b.caption && <figcaption style={{ padding: '10px 16px', fontFamily: "'Manrope',sans-serif", fontSize: 12, color: '#999', fontStyle: 'italic', background: '#FAFAFA', textAlign: 'center' }}>{b.caption}</figcaption>}
          </figure>
        );
      } else if (b._type === 'block') {
        elements.push(renderBlock(b, idx));
      }
    }
  });
  flushList('end');

  return <>{elements}</>;
}

/* ─────────────────────────────────────────────
   RELATED CARD
───────────────────────────────────────────── */
function RelatedCard({ post, onRead }) {
  const [hov, setHov] = useState(false);
  const img  = post.mainImage ? urlFor(post.mainImage).width(600).height(380).fit('crop').url() : 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&q=80';
  const date = post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';

  return (
    <article
      onClick={() => onRead(post.slug)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ background: '#fff', border: `1px solid ${hov ? ORANGE : 'rgba(0,0,0,0.08)'}`, borderRadius: 12, overflow: 'hidden', cursor: 'pointer', transform: hov ? 'translateY(-3px)' : 'translateY(0)', boxShadow: hov ? '0 12px 40px rgba(0,0,0,0.09)' : '0 2px 8px rgba(0,0,0,0.04)', transition: 'all 0.25s ease' }}
    >
      <div style={{ height: 160, overflow: 'hidden' }}>
        <img src={img} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: hov ? 'scale(1.05)' : 'scale(1)', transition: 'transform 0.45s ease' }} loading="lazy" />
      </div>
      <div style={{ padding: '16px 18px 20px' }}>
        <span style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 700, fontSize: 9, color: ORANGE, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{post.tag || 'General'}</span>
        <h4 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '1rem', letterSpacing: '0.03em', color: DARK, margin: '6px 0', lineHeight: 1.1, textTransform: 'uppercase', wordBreak: 'break-word' }}>{post.title}</h4>
        <div style={{ fontFamily: "'Manrope',sans-serif", fontSize: 11, color: '#aaa' }}>{date}</div>
      </div>
    </article>
  );
}

/* ─────────────────────────────────────────────
   INLINE SKELETON (body loading)
───────────────────────────────────────────── */
function Sk({ w = '100%', h = 16, r = 4, mb = 14 }) {
  return <div style={{ width: w, height: h, borderRadius: r, marginBottom: mb, background: 'linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s ease-in-out infinite' }} />;
}

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
function extractHeadings(blocks) {
  if (!blocks) return [];
  return blocks
    .filter(b => b._type === 'block' && ['h2', 'h3'].includes(b.style))
    .map(b => ({ id: `h-${blocks.indexOf(b)}`, text: (b.children || []).map(c => c.text).join(''), level: b.style }));
}

const FALLBACK_BODY = [
  { _type:'block', style:'normal',     _key:'1', markDefs:[], children:[{_type:'span',_key:'s1',marks:[],text:'This is a sample article. Connect your Sanity Studio to see full rich-text content here.'}] },
  { _type:'block', style:'h2',         _key:'2', markDefs:[], children:[{_type:'span',_key:'s2',marks:[],text:'Getting Started With Rewards'}] },
  { _type:'block', style:'normal',     _key:'3', markDefs:[], children:[{_type:'span',_key:'s3',marks:[],text:'The Revadoo rewards program is designed to make earning points as simple as possible. Whether you\'re completing daily tasks, participating in quizzes, or shopping through our partner network, every action brings you closer to your next reward.'}] },
  { _type:'block', style:'blockquote', _key:'4', markDefs:[], children:[{_type:'span',_key:'s4',marks:[],text:'The key to maximising your earnings is consistency — small daily actions compound into massive rewards over time.'}] },
  { _type:'block', style:'h2',         _key:'5', markDefs:[], children:[{_type:'span',_key:'s5',marks:[],text:'Top Strategies for Power Users'}] },
  { _type:'block', style:'normal',     _key:'6', markDefs:[], children:[{_type:'span',_key:'s6',marks:['strong'],text:'Daily streaks '},{_type:'span',_key:'s7',marks:[],text:'are the single most impactful multiplier. A 7-day streak activates a 3× bonus on all point-earning activities.'}] },
  { _type:'block', listItem:'bullet',  _key:'7', markDefs:[], children:[{_type:'span',_key:'s8',marks:[],text:'Complete the daily quiz every morning for bonus points'}] },
  { _type:'block', listItem:'bullet',  _key:'8', markDefs:[], children:[{_type:'span',_key:'s9',marks:[],text:'Use the shopping portal for all online purchases to earn cashback'}] },
  { _type:'block', listItem:'bullet',  _key:'9', markDefs:[], children:[{_type:'span',_key:'s10',marks:[],text:'Refer friends to unlock milestone bonuses worth up to 5,000 points per referral'}] },
];

function buildFallback(card) {
  return {
    _id: 'fallback', title: card?.title || 'Blog Post', body: FALLBACK_BODY,
    mainImage: null, publishedAt: null, author: card?.author || 'Revadoo Team', avatar: null,
    tag: card?.category || 'General', relatedPosts: [],
    videoUrl: card?.videoUrl || null, videoCaption: card?.videoCaption || null,
    sidebarText: card?.sidebarText || [], sidebarLabel: card?.sidebarLabel || 'Quick Tip',
  };
}

/* ─────────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────────── */
export default function BlogPost({ post: initialPost, onBack, onReadRelated }) {
  const [post,     setPost]     = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [activeId, setActiveId] = useState(null);

  // Fetch full post from Sanity (or use fallback)
  useEffect(() => {
    setLoading(true);
    if (initialPost?._isSanity && initialPost.slug) {
      client.fetch(POST_QUERY(initialPost.slug), { slug: initialPost.slug })
        .then(d  => { setPost(d || buildFallback(initialPost)); setLoading(false); })
        .catch(() => { setPost(buildFallback(initialPost));     setLoading(false); });
    } else {
      setTimeout(() => { setPost(buildFallback(initialPost)); setLoading(false); }, 400);
    }
  }, [initialPost?._id]);

  // Active heading tracking via IntersectionObserver
  useEffect(() => {
    if (!post) return;
    const headingEls = document.querySelectorAll("[id^='h-']");
    if (!headingEls.length) return;
    const obs = new IntersectionObserver(
      entries => { const visible = entries.filter(e => e.isIntersecting); if (visible.length) setActiveId(visible[0].target.id); },
      { rootMargin: '-20% 0px -70% 0px' }
    );
    headingEls.forEach(h => obs.observe(h));
    return () => obs.disconnect();
  }, [post, loading]);

  // Derived values
  const body       = post?.body     || FALLBACK_BODY;
  const headings   = extractHeadings(body);
  const heroImg    = post?.mainImage ? urlFor(post.mainImage).width(1400).height(700).fit('crop').url() : initialPost?.img || 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1400&q=80';
  const authorName = post?.author   || initialPost?.author   || 'Revadoo Team';
  const authorAv   = post?.avatar   ? urlFor(post.avatar).width(100).height(100).fit('crop').url() : null;
  const category   = post?.tag      || initialPost?.category || 'General';
  const date       = post?.publishedAt ? fmtDate(post.publishedAt) : initialPost?.date || '';
  const readTime   = post?.readTime  || initialPost?.readTime  || '5 min read';
  const title      = post?.title     || initialPost?.title     || '';
  const excerpt    = post?.desc      || initialPost?.excerpt   || '';
  const related    = post?.relatedPosts || [];
  const videoUrl   = post?.videoUrl  || initialPost?.videoUrl  || null;
  const videoCap   = post?.videoCaption || initialPost?.videoCaption || null;
  const sbText     = post?.sidebarText  || initialPost?.sidebarText  || [];
  const sbLabel    = post?.sidebarLabel || initialPost?.sidebarLabel || 'Quick Tip';

  return (
    <div style={{ background: '#F9F7F5', color: DARK, minHeight: '100vh', fontFamily: "'Manrope',sans-serif", overflowX: 'clip' }}>
      <style>{`
        .bp-layout { max-width:1200px; margin:0 auto; padding:0 clamp(16px,4vw,64px); display:grid; grid-template-columns:1fr 280px; gap:64px; align-items:start; }
        @media(max-width:1024px){ .bp-layout{ grid-template-columns:1fr; } .bp-sidebar{ display:none; } }
        @media(max-width:640px) { .bp-layout{ padding:0 16px; } }
      `}</style>

      {/* Reading progress — tracks window scroll now (not overlay) */}
      <ReadingProgress />

      {/* Hero image */}
      {loading
        ? <div style={{ width: '100%', height: 'clamp(220px,38vw,520px)', background: 'linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s ease-in-out infinite' }} />
        : <PostHero heroImg={heroImg} title={title} />
      }

      {/* Post meta */}
      {!loading && <PostMeta category={category} date={date} readTime={readTime} title={title} excerpt={excerpt} />}

      {/* Two-column layout */}
      <div className="bp-layout">
        <main style={{ minWidth: 0 }}>

          {/* Author + share bar */}
          {!loading && (
            <div
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 0 28px', borderBottom: '1px solid rgba(0,0,0,0.08)', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}
              itemProp="author" itemScope itemType="https://schema.org/Person"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {authorAv
                  ? <img src={authorAv} alt={authorName} width={44} height={44} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(0,0,0,0.08)', flexShrink: 0 }} />
                  : <div style={{ width: 44, height: 44, borderRadius: '50%', background: ORANGE, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Bebas Neue',sans-serif", fontSize: 20, color: '#fff', flexShrink: 0 }}>{authorName[0]}</div>
                }
                <div>
                  <div itemProp="name" style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 700, fontSize: 14, color: DARK }}>{authorName}</div>
                  <div style={{ fontFamily: "'Manrope',sans-serif", fontSize: 12, color: '#aaa', marginTop: 1 }}>{date} · {category}</div>
                </div>
              </div>
              <ShareBar title={title} />
            </div>
          )}

          {/* Article body */}
          <div style={{ maxWidth: '100%', overflowX: 'hidden' }}>
            {loading
              ? <div>{[100,82,96,70,88,60,92,76,55].map((w, i) => <Sk key={i} w={`${w}%`} h={i % 4 === 0 ? 22 : 14} />)}</div>
              : <PortableText blocks={body} />
            }
          </div>

          {/* Inline video */}
          {!loading && <VideoEmbed url={videoUrl} caption={videoCap} />}

          {/* Bottom actions */}
          {!loading && (
            <div style={{ marginTop: 64, paddingTop: 28, borderTop: '1px solid rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
              <ShareBar title={title} />
              <button
                onClick={onBack}
                style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 8, padding: '10px 20px', fontFamily: "'Manrope',sans-serif", fontWeight: 700, fontSize: 13, color: '#666', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = ORANGE; e.currentTarget.style.color = ORANGE; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)'; e.currentTarget.style.color = '#666'; }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
                Back to Blog
              </button>
            </div>
          )}

          {/* Related posts */}
          {!loading && related.length > 0 && (
            <section style={{ marginTop: 72, paddingBottom: 80 }} aria-labelledby="related-heading">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
                <div style={{ width: 3, height: 20, background: ORANGE, borderRadius: 2 }} aria-hidden="true" />
                <h3 id="related-heading" style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.5rem', letterSpacing: '0.04em', color: DARK, textTransform: 'uppercase' }}>Related Articles</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(related.length, 2)},1fr)`, gap: 16 }}>
                {related.map(r => <RelatedCard key={r._id} post={r} onRead={onReadRelated} />)}
              </div>
            </section>
          )}

          <div style={{ height: 80 }} />
        </main>

        {/* Sidebar — hidden on mobile via CSS */}
        {!loading && (
          <aside className="bp-sidebar" style={{ minWidth: 0, paddingTop: 40 }}>
            <TableOfContents headings={headings} activeId={activeId} />
            <RotatingTip items={sbText} label={sbLabel} />

            {/* Author card */}
            <div style={{ marginTop: 20, background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, padding: '18px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {authorAv
                  ? <img src={authorAv} alt={authorName} width={40} height={40} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                  : <div style={{ width: 40, height: 40, borderRadius: '50%', background: ORANGE, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Bebas Neue',sans-serif", fontSize: 17, color: '#fff', flexShrink: 0 }}>{authorName[0]}</div>
                }
                <div>
                  <div style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 700, fontSize: 13, color: DARK }}>{authorName}</div>
                  <div style={{ fontFamily: "'Manrope',sans-serif", fontSize: 11, color: ORANGE, fontWeight: 700, marginTop: 1 }}>Author</div>
                </div>
              </div>
            </div>

            {/* Newsletter widget */}
            <div style={{ marginTop: 16, background: '#0A0A0A', borderRadius: 12, padding: '20px 18px' }}>
              <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.4rem', color: '#fff', letterSpacing: '0.04em', marginBottom: 6, textTransform: 'uppercase' }}>Get weekly tips free</div>
              <p style={{ fontFamily: "'Manrope',sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.65, marginBottom: 14 }}>Join 40,000+ members getting the best reward strategies.</p>
              <input
                placeholder="your@email.com"
                aria-label="Email for newsletter"
                style={{ width: '100%', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 13px', fontFamily: "'Manrope',sans-serif", fontSize: 13, color: '#fff', outline: 'none', marginBottom: 8, boxSizing: 'border-box' }}
              />
              <button className="btn-primary" style={{ width: '100%', padding: '10px', fontSize: 13, borderRadius: 8, justifyContent: 'center' }}>Subscribe →</button>
            </div>

            {/* Share widget */}
            <div style={{ marginTop: 16, background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, padding: 16 }}>
              <div style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#aaa', marginBottom: 12 }}>Share Article</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: 'Share on Twitter',  href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(window.location.href)}` },
                  { label: 'Share on LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}` },
                ].map(s => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'block', textAlign: 'center', background: '#F9F7F5', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 8, padding: '9px 12px', fontFamily: "'Manrope',sans-serif", fontWeight: 700, fontSize: 12, color: '#666', textDecoration: 'none', transition: 'all 0.18s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = ORANGE; e.currentTarget.style.color = ORANGE; e.currentTarget.style.background = '#FFF5EE'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)'; e.currentTarget.style.color = '#666'; e.currentTarget.style.background = '#F9F7F5'; }}
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}