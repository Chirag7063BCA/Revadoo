import { useEffect, useState } from 'react'
import React from 'react'

/* ════════════════════ PHONE MOCKUP DATA ════════════════════════ */
const SCREENS = [
  {
    id: 0, accent: '#FF6B00',
    bg: 'linear-gradient(160deg,#FFF5EE 0%,#FFE8CC 100%)',
    label: 'DASHBOARD', title: 'Your Earnings', value: '$128.50', valueSub: 'This Month',
    items: [
      { icon: '📋', name: 'Daily Survey', creds: '+320 CR', bar: 72,  color: '#FF6B00' },
      { icon: '🎮', name: 'Mini Game',    creds: '+550 CR', bar: 88,  color: '#3B82F6' },
      { icon: '🎨', name: 'Design Task',  creds: '+200 CR', bar: 45,  color: '#8B5CF6' },
    ],
    notif: '⚡ New task added — +450 Creds',
  },
  {
    id: 1, accent: '#3B82F6',
    bg: 'linear-gradient(160deg,#EFF6FF 0%,#DBEAFE 100%)',
    label: 'MINI GAMES', title: 'Play & Earn', value: '+1,240 CR', valueSub: 'Won Today',
    items: [
      { icon: '🏆', name: 'Speed Quiz',  creds: '+480 CR', bar: 90, color: '#F59E0B' },
      { icon: '🎯', name: 'Target Drop', creds: '+360 CR', bar: 65, color: '#10B981' },
      { icon: '🧩', name: 'Word Puzzle', creds: '+400 CR', bar: 78, color: '#3B82F6' },
    ],
    notif: '🏆 You beat 94% of players!',
  },
  {
    id: 2, accent: '#10B981',
    bg: 'linear-gradient(160deg,#ECFDF5 0%,#D1FAE5 100%)',
    label: 'REWARDS', title: 'Cash Out', value: '$50.00', valueSub: 'Ready to Redeem',
    items: [
      { icon: '💵', name: 'PayPal Cash', creds: '500 CR',   bar: 100, color: '#10B981' },
      { icon: '₿',  name: 'Bitcoin',     creds: '1,200 CR', bar: 55,  color: '#F59E0B' },
      { icon: '🎁', name: 'Amazon Card', creds: '1,000 CR', bar: 80,  color: '#EF4444' },
    ],
    notif: '✅ Payout sent to PayPal!',
  },
  {
    id: 3, accent: '#8B5CF6',
    bg: 'linear-gradient(160deg,#F5F3FF 0%,#EDE9FE 100%)',
    label: 'LEADERBOARD', title: 'Top Earners', value: '#4', valueSub: 'Your Rank',
    items: [
      { icon: '👑', name: 'Jordan K.', creds: '128,540 CR', bar: 100, color: '#FF6B00' },
      { icon: '🥈', name: 'Maya R.',   creds: '112,200 CR', bar: 87,  color: '#3B82F6' },
      { icon: '🥉', name: 'Ethan W.',  creds: '98,750 CR',  bar: 77,  color: '#10B981' },
    ],
    notif: '🔥 You moved up 2 spots!',
  },
]

const AVATARS = [
  { l: 'A', bg: '#FF6B00' }, { l: 'B', bg: '#3B82F6' }, { l: 'C', bg: '#10B981' },
  { l: 'D', bg: '#8B5CF6' }, { l: 'E', bg: '#EF4444' },
]

const words = ['Complete Tasks', 'Play Mini Games', 'Level Up', 'Beat Challenges', 'Get Paid']

/* ════════════════════ PHONE MOCKUP ════════════════════════ */
const PhoneMockup = () => {
  const [active, setActive] = useState(0)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    const t = setInterval(() => {
      setAnimating(true)
      setTimeout(() => {
        setActive(a => (a + 1) % SCREENS.length)
        setAnimating(false)
      }, 380)
    }, 3200)
    return () => clearInterval(t)
  }, [active])

  const s = SCREENS[active]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
      <div style={{
        width: 270, height: 520, borderRadius: 40, background: '#111', padding: 10,
        position: 'relative', animation: 'phoneFloat 5s ease-in-out infinite',
        boxShadow: '0 40px 100px rgba(0,0,0,0.22), inset 0 0 0 1px rgba(255,255,255,0.08)',
      }}>
        <div style={{
          width: '100%', height: '100%', borderRadius: 32, background: s.bg,
          overflow: 'hidden', position: 'relative',
          animation: 'screenGlow 4s ease-in-out infinite', transition: 'background 0.5s ease',
        }}>
          <div style={{ padding: '12px 18px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.58rem', color: 'rgba(0,0,0,0.35)', letterSpacing: '0.06em' }}>9:41</span>
            <div style={{ width: 60, height: 14, borderRadius: 99, background: 'rgba(0,0,0,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 36, height: 6, borderRadius: 99, background: 'rgba(0,0,0,0.2)' }} />
            </div>
            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              {[3, 2.5, 2].map((h, i) => <div key={i} style={{ width: 3, height: h * 3, borderRadius: 1, background: 'rgba(0,0,0,0.3)' }} />)}
            </div>
          </div>

          <div style={{
            padding: '10px 16px 16px',
            opacity: animating ? 0 : 1,
            transform: animating ? 'translateX(-20px)' : 'translateX(0)',
            transition: 'opacity 0.32s ease, transform 0.32s ease',
          }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.6rem', letterSpacing: '0.14em', color: s.accent, marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '1rem', letterSpacing: '0.04em', color: '#0A0A0A', marginBottom: 2 }}>{s.title}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 16 }}>
              <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '2rem', color: s.accent, lineHeight: 1 }}>{s.value}</span>
              <span style={{ fontSize: '0.65rem', color: 'rgba(0,0,0,0.4)', fontFamily: "'JetBrains Mono',monospace" }}>{s.valueSub}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {s.items.map((item, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.72)', borderRadius: 14, padding: '9px 12px', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.6)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <span style={{ fontSize: 14 }}>{item.icon}</span>
                      <span style={{ fontWeight: 700, fontSize: '0.72rem', color: '#0A0A0A' }}>{item.name}</span>
                    </div>
                    <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '0.85rem', color: item.color }}>{item.creds}</span>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.07)', borderRadius: 99, height: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 99, width: `${item.bar}%`, background: item.color, transition: 'width 0.8s cubic-bezier(0.16,1,0.3,1)' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            position: 'absolute', bottom: 16, left: 10, right: 10,
            background: 'rgba(10,10,10,0.88)', borderRadius: 14, padding: '9px 12px',
            backdropFilter: 'blur(12px)', fontFamily: "'Manrope',sans-serif",
            fontSize: '0.68rem', fontWeight: 600, color: '#fff',
            animation: 'notifSlide 3.2s ease-in-out infinite', letterSpacing: '0.01em',
          }}>{s.notif}</div>
        </div>
        <div style={{ position: 'absolute', top: 18, left: '50%', transform: 'translateX(-50%)', width: 70, height: 20, background: '#111', borderRadius: 99, zIndex: 5 }} />
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {SCREENS.map((_, i) => (
          <div key={i} onClick={() => setActive(i)} style={{
            width: i === active ? 20 : 6, height: 6, borderRadius: 99,
            background: i === active ? s.accent : 'rgba(0,0,0,0.15)',
            transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)', cursor: 'pointer',
          }} />
        ))}
      </div>
    </div>
  )
}

/* ════════════════════ HERO ════════════════════════ */
const Hero = () => {
  const [visible, setVisible] = useState({ badge: false, headline: false, sub: false, ctas: false, trust: false })
  const [wordIndex, setWordIndex] = useState(0)
  const [wordState, setWordState] = useState('visible')

  /* Staggered entrance */
  useEffect(() => {
    setTimeout(() => setVisible(v => ({ ...v, badge: true })),    300)
    setTimeout(() => setVisible(v => ({ ...v, headline: true })), 500)
    setTimeout(() => setVisible(v => ({ ...v, sub: true })),      700)
    setTimeout(() => setVisible(v => ({ ...v, ctas: true, trust: true })), 900)
  }, [])

  /* ── FIX: Rotating headline word — replaced double rAF with setTimeout(20ms)
     The double rAF was fragile on fast GPUs causing words to jump/teleport.
     A 20ms gap guarantees at least one paint cycle between 'enter' and 'visible'
     so the CSS transition always has a defined start state to animate from. ── */
  useEffect(() => {
    const interval = setInterval(() => {
      setWordState('exit')
      setTimeout(() => {
        setWordIndex(i => (i + 1) % words.length)
        setWordState('enter')
        setTimeout(() => setWordState('visible'), 20)
      }, 350)
    }, 2800)
    return () => clearInterval(interval)
  }, [])

  /* Three.js background — NOTE: Three.js CDN script must be loaded in
     public/index.html before </body>. JSX <script> tags don't execute in React. */
  useEffect(() => {
    const canvas = document.getElementById('three-canvas')
    if (!canvas) return
    const init = () => {
      if (!window.THREE) { setTimeout(init, 100); return }
      const THREE = window.THREE
      const scene    = new THREE.Scene()
      const camera   = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
      camera.position.z = 30
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
      renderer.setClearColor(0x000000, 0)

      const pCount = 150
      const geo = new THREE.BufferGeometry()
      const pos = new Float32Array(pCount * 3)
      for (let i = 0; i < pCount; i++) {
        pos[i * 3]     = (Math.random() - .5) * 90
        pos[i * 3 + 1] = (Math.random() - .5) * 70
        pos[i * 3 + 2] = (Math.random() - .5) * 50
      }
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      const particles = new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xFF6B00, size: 0.22, transparent: true, opacity: 0.55 }))
      scene.add(particles)

      const makeIco = (r, x, y, z, op) => {
        const m = new THREE.Mesh(
          new THREE.IcosahedronGeometry(r, 2),
          new THREE.MeshBasicMaterial({ color: 0xFF6B00, wireframe: true, transparent: true, opacity: op })
        )
        m.position.set(x, y, z); scene.add(m); return m
      }
      const ico1 = makeIco(14,  20, -4, -12, 0.055)
      const ico2 = makeIco(7,  -22, 10,  -5, 0.07)
      const ico3 = makeIco(4,    8, 16,  -8, 0.09)
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(18, .08, 6, 60),
        new THREE.MeshBasicMaterial({ color: 0xFF6B00, transparent: true, opacity: 0.04 })
      )
      ring.rotation.x = Math.PI / 4; scene.add(ring)

      let mx = 0, my = 0
      window.addEventListener('mousemove', e => {
        mx = (e.clientX / window.innerWidth - .5) * 2
        my = (e.clientY / window.innerHeight - .5) * 2
      })

      const clock = new THREE.Clock()
      const animate = () => {
        requestAnimationFrame(animate)
        const t = clock.getElapsedTime()
        particles.rotation.y = t * .025; particles.rotation.x = t * .008
        ico1.rotation.x = t * .07;  ico1.rotation.y = t * .11
        ico2.rotation.x = -t * .05; ico2.rotation.y = t * .08
        ico3.rotation.y = t * .14;  ico3.rotation.z = t * .05
        ring.rotation.z = t * .03
        camera.position.x += (mx * 4 - camera.position.x) * .018
        camera.position.y += (-my * 3 - camera.position.y) * .018
        camera.lookAt(scene.position)
        renderer.render(scene, camera)
      }
      animate()

      window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
      })
    }
    init()
  }, [])

  const wordStyle = {
    exit:    { opacity: 0, transform: 'translateY(-18px)', transition: 'all 0.3s' },
    enter:   { opacity: 0, transform: 'translateY(18px)',  transition: 'all 0.3s' },
    visible: { opacity: 1, transform: 'translateY(0)',     transition: 'all 0.3s' },
  }[wordState]

  return (
    <section
      id="hero"
      aria-label="Hero — Start earning with REVADOO"
      style={{ position: 'relative', display: 'flex', alignItems: 'center', minHeight: '100vh', background: '#fff', overflow: 'hidden' }}
    >
      {/* ── FIX: GLOBAL_CSS is now injected only once in LandingPage.jsx.
          Removed the duplicate <style> injection that was here previously. ── */}

      {/* Three.js canvas — Three.js must be loaded via public/index.html */}
      <canvas id="three-canvas" style={{ position: 'absolute', inset: 0, zIndex: 0 }} />

      {/* Grid overlay */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.03) 1px,transparent 1px)',
        backgroundSize: '64px 64px',
      }} />

      {/* Radial glow */}
      <div style={{
        position: 'absolute', zIndex: 1, pointerEvents: 'none',
        top: '50%', left: '50%', width: '900px', height: '700px',
        transform: 'translate(-50%,-50%)',
        background: 'radial-gradient(ellipse,rgba(255,107,0,0.07) 0%,transparent 65%)',
      }} />

      {/* Two-column layout */}
      <div className="hero-inner" style={{ position: 'relative', zIndex: 2 }}>

        {/* LEFT — copy */}
        <div className="hero-left">

          {/* Badge */}
          <div
            className="hero-badge"
            role="status"
            aria-label="2.4 million plus users earning daily"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              borderRadius: 999, background: '#FFF5EE',
              border: '1px solid rgba(255,107,0,0.3)', padding: '8px 20px', marginBottom: 36,
              opacity: visible.badge ? 1 : 0,
              transform: visible.badge ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.6s, transform 0.6s',
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF6B00', animation: 'pulse-dot 2s ease infinite' }} />
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.74rem', color: '#FF6B00', letterSpacing: '0.1em' }}>
              2.4M+ USERS EARNING DAILY
            </span>
          </div>

          {/* Headline — H1 is correct here as the only H1 on the page */}
          <h1 style={{
            fontFamily: "'Bebas Neue',sans-serif",
            fontSize: 'clamp(3.8rem,7vw,7.5rem)', lineHeight: 0.92,
            letterSpacing: '0.03em', color: '#0A0A0A', marginBottom: 32, maxWidth: 720,
            opacity: visible.headline ? 1 : 0,
            transform: visible.headline ? 'translateY(0) skewY(0)' : 'translateY(60px) skewY(2deg)',
            transition: 'opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)',
          }}>
            <span style={{ color: '#FF6B00', display: 'inline-block', ...wordStyle }}>{words[wordIndex]}</span>
            <br />
            &amp; Get{' '}
            <span style={{ position: 'relative', display: 'inline-block' }}>
              REWARDED
              <svg viewBox="0 0 240 10" fill="none" xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                style={{ position: 'absolute', left: 0, bottom: '-10px', width: '100%' }}>
                <path d="M2 8 Q60 2 120 6 Q180 10 238 3" stroke="#FF6B00" strokeWidth="3" strokeLinecap="round" fill="none" />
              </svg>
            </span>
          </h1>

          {/* Subheading */}
          <p style={{
            fontSize: 'clamp(1rem,1.5vw,1.15rem)', color: '#555', lineHeight: 1.75,
            maxWidth: 540, marginBottom: 48,
            opacity: visible.sub ? 1 : 0,
            transform: visible.sub ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.7s 0.3s cubic-bezier(0.16,1,0.3,1), transform 0.7s 0.3s',
          }}>
            REVADOO turns your everyday time into tangible gains. Browse hundreds of tasks across surveys, games, creative challenges, and more — then convert your Creds into real gift cards, cash, and premium rewards.
          </p>

          {/* CTAs */}
          <div
            className="hero-ctas"
            style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 56, opacity: visible.ctas ? 1 : 0, transition: 'opacity 0.6s 0.5s' }}
          >
            <a href="#tasks-section" className="btn-primary" style={{ fontSize: '1rem', padding: '15px 36px' }}>
              Start Earning Free &nbsp;→
            </a>
            <a href="#rewards-section" className="btn-outline" style={{ fontSize: '1rem', padding: '15px 36px' }}>
              View Rewards
            </a>
          </div>

          {/* Trust bar */}
          <div
            className="hero-trust"
            aria-label="Social proof"
            style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 28, opacity: visible.trust ? 1 : 0, transition: 'opacity 0.6s 0.65s' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ display: 'flex' }} aria-hidden="true">
                {AVATARS.map((av, i) => (
                  <div key={i} style={{
                    width: 34, height: 34, borderRadius: '50%', background: av.bg,
                    border: '2px solid #fff', color: '#fff', fontWeight: 700, fontSize: 13,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginLeft: i === 0 ? 0 : '-10px',
                  }}>{av.l}</div>
                ))}
              </div>
              <span style={{ fontSize: '0.85rem', color: '#999' }}>
                <strong style={{ color: '#0A0A0A' }}>2.4M+</strong> active earners
              </span>
            </div>

            <div className="hero-trust-divider" style={{ width: 1, height: 24, background: '#E0E0E0' }} aria-hidden="true" />

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: '#FF6B00', fontSize: 13 }} aria-hidden="true">★★★★★</span>
              <span style={{ fontSize: '0.85rem', color: '#999' }}>
                <strong style={{ color: '#0A0A0A' }}>4.9/5</strong> rating
              </span>
            </div>

            <div className="hero-trust-divider" style={{ width: 1, height: 24, background: '#E0E0E0' }} aria-hidden="true" />

            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.72rem', color: '#999', letterSpacing: '0.08em' }}>
              FREE TO JOIN
            </span>
          </div>
        </div>

        {/* RIGHT — phone mockup */}
        <div className="hero-right">
          <PhoneMockup />
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="hero-scroll"
        aria-hidden="true"
        style={{
          position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)',
          zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          animation: 'float 2s ease-in-out infinite',
        }}
      >
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.68rem', color: '#999', letterSpacing: '0.12em' }}>SCROLL</div>
        <div style={{ width: 24, height: 38, border: '2px solid rgba(0,0,0,0.12)', borderRadius: 12, padding: 5, display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 4, height: 9, borderRadius: 2, background: '#FF6B00', animation: 'float 1.6s ease-in-out infinite' }} />
        </div>
      </div>
    </section>
  )
}

export default Hero