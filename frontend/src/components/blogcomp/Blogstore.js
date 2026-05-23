/**
 * Blogstore.js
 * ─────────────────────────────────────────────
 * Shared module-level store — every component
 * subscribes with zero props.
 *
 * Auto-update strategy (two layers):
 *  1. Sanity real-time listener (WebSocket) — instant
 *  2. Poll every 30 seconds — fallback if listener fails
 * ─────────────────────────────────────────────
 */

import { useState, useEffect } from 'react';
import { client, QUERY, FALLBACK_POSTS, normalizeSanity } from './sanity';

/* ═══════════════════════════════════════════════
   DATA STATE
═══════════════════════════════════════════════ */
let _data = { posts: [], loading: true, error: null, isSanity: false };
const _dataListeners = new Set();
let _fetchStarted    = false;
let _pollInterval    = null;

function _emitData() {
  _dataListeners.forEach(fn => fn({ ..._data }));
}

function _setData(patch) {
  _data = { ..._data, ...patch };
  _emitData();
}

/* Core fetch — called on init, by the listener, and by the poller */
function _fetchLatest() {
  return client.fetch(QUERY)
    .then(d => {
      const has = !!(d && d.length);
      _setData({
        posts:    has ? d.map(normalizeSanity) : FALLBACK_POSTS,
        loading:  false,
        error:    null,
        isSanity: has,
      });
    })
    .catch(() => {
      // Only switch to fallback if we have no posts yet
      if (!_data.posts.length) {
        _setData({ posts: FALLBACK_POSTS, loading: false, isSanity: false });
      }
    });
}

export function initBlogFetch() {
  if (_fetchStarted) return;
  _fetchStarted = true;

  // Initial fetch
  _fetchLatest();

  // Layer 1: Sanity real-time WebSocket listener
  // Fires instantly when a post is published/updated/deleted in Sanity Studio
  try {
    client.listen(QUERY).subscribe({
      next:  () => _fetchLatest(),
      error: () => {},  // silently ignore — poller is the fallback
    });
  } catch {
    // listener not available — poller handles it
  }

  // Layer 2: Poll every 30 seconds
  // Catches updates even if the WebSocket listener fails
  _pollInterval = setInterval(() => _fetchLatest(), 30_000);
}

export function stopBlogFetch() {
  if (_pollInterval) { clearInterval(_pollInterval); _pollInterval = null; }
  _fetchStarted = false;
}

export function useBlogData() {
  const [state, setState] = useState({ ..._data });

  useEffect(() => {
    setState({ ..._data });
    _dataListeners.add(setState);
    initBlogFetch();
    return () => _dataListeners.delete(setState);
  }, []);

  return state;
}

/* ═══════════════════════════════════════════════
   NAVIGATION STATE
═══════════════════════════════════════════════ */
let _navigate = null;

export function setNavigate(fn) {
  _navigate = fn;
}

let _currentPost = null;
const _navListeners = new Set();

function _emitNav() {
  _navListeners.forEach(fn => fn(_currentPost));
}

export function openPost(post) {
  _currentPost = post;
  _emitNav();
  if (_navigate) {
    const slug = post.slug || String(post.id);
    _navigate(`/blog/${slug}`);
  }
}

export function closePost() {
  _currentPost = null;
  _emitNav();
  if (_navigate) _navigate('/blog');
}

export function openPostBySlug(slug) {
  const found = _data.posts.find(p => p.slug === slug || String(p.id) === slug);
  if (found) openPost(found);
  else if (_navigate) _navigate(`/blog/${slug}`);
}

export function useCurrentPost() {
  const [post, setPost] = useState(_currentPost);
  useEffect(() => {
    setPost(_currentPost);
    _navListeners.add(setPost);
    return () => _navListeners.delete(setPost);
  }, []);
  return post;
}

/* ═══════════════════════════════════════════════
   SCROLL REVEAL
═══════════════════════════════════════════════ */
let _revealObserver = null;

export function initScrollReveal() {
  if (_revealObserver) return;

  _revealObserver = new IntersectionObserver(
    entries =>
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          _revealObserver.unobserve(e.target);
        }
      }),
    { threshold: 0.08 }
  );

  const observe = el => _revealObserver.observe(el);
  document.querySelectorAll('.reveal').forEach(observe);

  new MutationObserver(mutations =>
    mutations.forEach(m =>
      m.addedNodes.forEach(n => {
        if (n.nodeType !== 1) return;
        if (n.classList?.contains('reveal')) observe(n);
        n.querySelectorAll?.('.reveal').forEach(observe);
      })
    )
  ).observe(document.body, { childList: true, subtree: true });
}