import React, { useState } from 'react';
import { useBlogData, openPost } from './Blogstore';
import { Skeleton } from './Blog';

const ORANGE = '#FF6B00';
const DARK   = '#0A0A0A';

/* ── Single post card ── */
function PostCard({ post }) {
  const [hov, setHov] = useState(false);

  return (
    <article
      className="blog-card"
      onClick={() => openPost(post)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      itemScope
      itemType="https://schema.org/BlogPosting"
      style={{
        background:'#fff', borderRadius:16, overflow:'hidden', cursor:'pointer',
        display:'flex', flexDirection:'column',
        border:`1px solid ${hov ? 'rgba(255,107,0,0.3)' : 'rgba(0,0,0,0.07)'}`,
        boxShadow:hov ? '0 16px 48px rgba(0,0,0,0.09)' : '0 2px 8px rgba(0,0,0,0.04)',
        transition:'border-color 0.2s, box-shadow 0.3s', minWidth:0,
      }}
    >
      <div style={{ height:200, overflow:'hidden', position:'relative', flexShrink:0 }}>
        <img
          src={post.img} alt={post.title} itemProp="image" loading="lazy"
          style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', transition:'transform 0.5s ease', transform:hov ? 'scale(1.05)' : 'scale(1)' }}
        />
        <span style={{ position:'absolute', top:12, left:12, background:ORANGE, color:'#fff', borderRadius:100, padding:'4px 12px', fontFamily:"'Manrope',sans-serif", fontWeight:700, fontSize:10, letterSpacing:'0.1em', textTransform:'uppercase', maxWidth:'calc(100% - 90px)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
          {post.tag}
        </span>
        <span style={{ position:'absolute', top:12, right:12, background:'rgba(255,255,255,0.92)', borderRadius:100, padding:'4px 12px', fontFamily:"'Manrope',sans-serif", fontSize:11, fontWeight:600, color:'#555', whiteSpace:'nowrap' }}>
          {post.readTime}
        </span>
      </div>

      <div style={{ padding:'20px 20px 24px', flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
        <span style={{ fontFamily:"'Manrope',sans-serif", fontWeight:700, fontSize:10, color:ORANGE, letterSpacing:'0.14em', textTransform:'uppercase', display:'block', marginBottom:8, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
          {post.category}
        </span>

        <h3
          itemProp="headline"
          style={{
            fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(1.05rem,1.5vw,1.25rem)',
            lineHeight:1.15, letterSpacing:'0.03em', color:DARK, textTransform:'uppercase',
            margin:'0 0 10px', display:'-webkit-box', WebkitLineClamp:2,
            WebkitBoxOrient:'vertical', overflow:'hidden', wordBreak:'break-word',
          }}
        >
          {post.title}
        </h3>

        <p
          itemProp="description"
          style={{
            fontFamily:"'Manrope',sans-serif", fontSize:13, lineHeight:1.72, color:'#888',
            flex:1, marginBottom:18, display:'-webkit-box', WebkitLineClamp:3,
            WebkitBoxOrient:'vertical', overflow:'hidden', wordBreak:'break-word',
          }}
        >
          {post.excerpt}
        </p>

        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', paddingTop:14, borderTop:'1px solid rgba(0,0,0,0.06)', gap:8, minWidth:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:9, minWidth:0, flex:1 }} itemProp="author" itemScope itemType="https://schema.org/Person">
            {post._avatar
              ? <img src={post._avatar} alt={post.author} width={30} height={30} style={{ width:30, height:30, borderRadius:'50%', objectFit:'cover', border:'1.5px solid #E8E8E8', flexShrink:0 }} />
              : <div style={{ width:30, height:30, borderRadius:'50%', background:ORANGE, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Bebas Neue',sans-serif", fontSize:13, color:'#fff', flexShrink:0 }}>{post.author[0]}</div>
            }
            <div style={{ minWidth:0, flex:1 }}>
              <div itemProp="name" style={{ fontFamily:"'Manrope',sans-serif", fontWeight:700, fontSize:12, color:DARK, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{post.author}</div>
              <div style={{ fontFamily:"'Manrope',sans-serif", fontSize:11, color:'#aaa', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }} itemProp="datePublished">{post.date}</div>
            </div>
          </div>
          <span style={{ display:'flex', alignItems:'center', gap:4, fontFamily:"'Manrope',sans-serif", fontWeight:700, fontSize:12, color:hov ? ORANGE : '#bbb', transition:'color 0.2s', flexShrink:0 }}>
            Read
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </span>
        </div>
      </div>
    </article>
  );
}

/* ── Card skeleton ── */
function CardSkeleton() {
  return (
    <div style={{ background:'#fff', borderRadius:16, overflow:'hidden', border:'1px solid rgba(0,0,0,0.06)' }}>
      <Skeleton w="100%" h={200} r={0} />
      <div style={{ padding:20 }}>
        <Skeleton w="70px" h={18} r={100} mb={12} />
        <Skeleton w="95%" h={15} r={3} mb={8} />
        <Skeleton w="80%" h={15} r={3} mb={18} />
        <Skeleton w="100%" h={12} r={3} mb={6} />
        <Skeleton w="68%" h={12} r={3} />
      </div>
    </div>
  );
}

/* ── Main grid ── */
export default function BlogGrid() {
  const { posts, loading, isSanity } = useBlogData();
  const [activeFilter, setActiveFilter] = useState('All');
  const [visibleCount, setVisibleCount] = useState(9);

  /* Exclude featured post (first flagged or first overall) */
  const featured = posts.find(p => p.featured) || posts[0];
  const rest      = posts.filter(p => p.id !== featured?.id);

  const allCats  = ['All', ...new Set(posts.map(p => p.category))];
  const filtered = activeFilter === 'All' ? rest : rest.filter(p => p.category === activeFilter);

  return (
    <section
      aria-labelledby="articles-heading"
      style={{ background:'#F9F7F5', padding:'clamp(40px,5vw,80px) clamp(16px,4vw,64px)', overflowX:'clip' }}
    >
      <style>{`
        .b-filter-row  { display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:32px; }
        .b-grid-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:28px; flex-wrap:wrap; gap:8px; }
        .b-post-grid   { display:grid; grid-template-columns:repeat(3,1fr); gap:24px; }
        .b-filter-btn  { border:1px solid; border-radius:100px; padding:6px 18px; font-family:'Manrope',sans-serif; font-weight:700; font-size:12px; cursor:pointer; transition:all 0.18s ease; white-space:nowrap; }
        @media(max-width:1024px){ .b-post-grid{ grid-template-columns:repeat(2,1fr); } }
        @media(max-width:640px){
          .b-post-grid  { grid-template-columns:1fr; }
          .b-filter-row { gap:6px; overflow-x:auto; flex-wrap:nowrap; padding-bottom:4px; -webkit-overflow-scrolling:touch; scrollbar-width:none; }
          .b-filter-row::-webkit-scrollbar{ display:none; }
        }
      `}</style>

      <div style={{ maxWidth:1280, margin:'0 auto' }}>
        <div className="sec-label">Articles & Guides</div>

        {/* Filter pills */}
        <div className="b-filter-row" role="group" aria-label="Filter articles by category">
          <span style={{ fontFamily:"'Manrope',sans-serif", fontSize:11, fontWeight:700, color:'#999', letterSpacing:'0.12em', textTransform:'uppercase', marginRight:4, flexShrink:0 }}>Filter:</span>
          {allCats.map(cat => (
            <button
              key={cat}
              onClick={() => { setActiveFilter(cat); setVisibleCount(9); }}
              aria-pressed={activeFilter === cat}
              className="b-filter-btn"
              style={{
                borderColor: activeFilter === cat ? ORANGE : 'rgba(0,0,0,0.12)',
                background:  activeFilter === cat ? ORANGE : '#fff',
                color:       activeFilter === cat ? '#fff' : '#555',
                flexShrink:0,
              }}
            >{cat}</button>
          ))}
        </div>

        {/* Header */}
        <div className="b-grid-header">
          <div style={{ display:'flex', alignItems:'center', gap:10, minWidth:0 }}>
            <div style={{ width:3, height:20, background:ORANGE, borderRadius:2, flexShrink:0 }} aria-hidden="true" />
            <h2 id="articles-heading" style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'1.2rem', letterSpacing:'0.06em', color:DARK, whiteSpace:'nowrap' }}>
              {activeFilter === 'All' ? 'ALL ARTICLES' : activeFilter.toUpperCase()}
            </h2>
            <span style={{ fontFamily:"'Manrope',sans-serif", fontSize:13, color:'#999', whiteSpace:'nowrap' }}>
              · {filtered.length} {filtered.length === 1 ? 'post' : 'posts'}
            </span>
          </div>
          {isSanity && (
            <span style={{ display:'flex', alignItems:'center', gap:6, fontFamily:"'Manrope',sans-serif", fontSize:12, color:'#22c55e', fontWeight:600, flexShrink:0 }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:'#22c55e', animation:'pulseDot 2s infinite' }} />
              Live from Sanity
            </span>
          )}
        </div>

        {/* Skeletons */}
        {loading && (
          <div className="b-post-grid">{[0,1,2,3,4,5].map(i => <CardSkeleton key={i} />)}</div>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <div style={{ textAlign:'center', padding:'72px 0', color:'#999', fontFamily:"'Manrope',sans-serif", fontSize:15 }}>
            No posts in this category yet.{isSanity && ' Publish one in Sanity Studio.'}
          </div>
        )}

        {/* Cards */}
        {!loading && filtered.length > 0 && (
          <>
            <div className="b-post-grid">
              {filtered.slice(0, visibleCount).map(post => (
                <div key={post.id} className="reveal" style={{ minWidth:0 }}>
                  <PostCard post={post} />
                </div>
              ))}
            </div>

            {visibleCount < filtered.length && (
              <div style={{ textAlign:'center', marginTop:48 }}>
                <button
                  onClick={() => setVisibleCount(v => v + 6)}
                  className="btn-outline"
                  style={{ padding:'13px 44px', fontSize:'0.95rem' }}
                >
                  Load More Articles
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}