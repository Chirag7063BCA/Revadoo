import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    if (!document.getElementById('navbar-fonts')) {
      const link = document.createElement('link')
      link.id = 'navbar-fonts'
      link.rel = 'stylesheet'
      link.href = 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap'
      document.head.appendChild(link)
    }
  }, [])

  // Close menu on route change
  useEffect(() => { setMenuOpen(false) }, [location])

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const navLinks = [
    { to: '/',        label: 'Home' },
    { to: '/about',   label: 'About' },
    { to: '/Blog',    label: 'Blog' },
     { to: '/Infopage', label: 'Howitworks' },
    { to: '/contact', label: 'Contact Us' },
  ]

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)

  return (
    <>
      <style>{`
        .navbar-root *, .navbar-root *::before, .navbar-root *::after { box-sizing: border-box; }

        .nav-link {
          position: relative;
          text-decoration: none;
          display: inline-block;
          transition: color 0.2s;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          left: 0; right: 0; bottom: -3px;
          height: 2px;
          background: #FF6B00;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.25s ease;
        }
        .nav-link:hover { color: #FF6B00 !important; }
        .nav-link:hover::after, .nav-link.active::after { transform: scaleX(1); }

        .login-btn { transition: color 0.3s, border-color 0.3s, background 0.2s !important; }
        .login-btn:hover {
          color: #FF6B00 !important;
          border-color: #FF6B00 !important;
          background: rgba(255,107,0,0.08) !important;
        }

        
        .navbar-inner {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          max-width: 1380px;
          margin: 0 auto;
          padding: 0 48px;
          height: 70px;
        }

        .desktop-nav  { display: flex; }
        .desktop-btns { display: flex; justify-content: flex-end; }
        .hamburger    { display: none; }

        .drawer-link { transition: color 0.2s, padding-left 0.2s; }
        .drawer-link:hover { color: #FF6B00 !important; padding-left: 6px !important; }

        @media (max-width: 1023px) {
          .navbar-inner {
            grid-template-columns: 1fr auto;
            padding: 0 20px;
            height: 62px;
          }
          .desktop-nav  { display: none !important; }
          .desktop-btns { display: none !important; }
          .hamburger    { display: flex !important; }
        }

        @media (max-width: 480px) {
          .navbar-inner { padding: 0 16px; }
        }
      `}</style>

      <header className="navbar-root" style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        background: 'rgba(255,255,255,0.98)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0,0,0,0.07)',
        boxShadow: '0 2px 24px rgba(0,0,0,0.06)',
      }}>
        <div className="navbar-inner">

          {/* ── LOGO ── */}
          <Link to="/" style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '1.85rem',
            letterSpacing: '0.08em',
            textDecoration: 'none',
            color: '#0A0A0A',
            paddingLeft: '4px',
            justifySelf: 'start',
            lineHeight: 1,
            position: 'relative',
            zIndex: 1,
          }}>
            REVA<span style={{ color: '#FF6B00' }}>Doo</span>
          </Link>

          {/* ── DESKTOP NAV LINKS ── */}
          <ul className="desktop-nav" style={{
            alignItems: 'center',
            gap: '40px',
            listStyle: 'none',
            margin: 0,
            padding: 0,
            position: 'relative',
            zIndex: 1,
          }}>
            {navLinks.map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  className={`nav-link${isActive(to) ? ' active' : ''}`}
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    letterSpacing: '0.07em',
                    textTransform: 'uppercase',
                    color: isActive(to) ? '#FF6B00' : '#0A0A0A',
                    padding: '4px 0',
                  }}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* ── DESKTOP RIGHT BUTTONS ── */}
          <div className="desktop-btns" style={{ alignItems: 'center', gap: '17px', position: 'relative', zIndex: 1 }}>
            

            {/* Start Earning */}
            <Link
              to="/authpage"
              style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: '0.84rem', fontWeight: 700,
                color: '#fff', letterSpacing: '0.04em', padding: '9px 18px', borderRadius: '7px',
                background: 'linear-gradient(135deg, #FF6B00 0%, #FF8C00 100%)',
                boxShadow: '0 4px 14px rgba(255,107,0,0.32)', textDecoration: 'none',
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(255,107,0,0.45)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(255,107,0,0.32)' }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                <polyline points="17 6 23 6 23 12"/>
              </svg>
              Start Earning
            </Link>

            {/* Login */}
            <Link
              to="/authpage"
              className="login-btn"
              style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: '0.84rem', fontWeight: 600,
                color: '#555', letterSpacing: '0.02em', padding: '8px 5px', borderRadius: '7px',
                border: '1.5px solid #E0E0E0', textDecoration: 'none',
                display: 'inline-flex', alignItems: 'center', gap: '7px',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              Login / Sign Up
            </Link>
          </div>

          {/* ── HAMBURGER (mobile only) ── */}
          <button
            className="hamburger"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
            style={{
              flexDirection: 'column', gap: '5px',
              background: 'transparent', border: 'none',
              padding: '8px', cursor: 'pointer',
              justifySelf: 'end', borderRadius: '6px',
            }}
          >
            <span style={{ display: 'block', width: '23px', height: '2px', background: '#0A0A0A', borderRadius: '2px', transition: 'transform 0.3s, opacity 0.3s', transform: menuOpen ? 'rotate(45deg) translate(5px,5px)' : 'none' }} />
            <span style={{ display: 'block', width: '23px', height: '2px', background: '#0A0A0A', borderRadius: '2px', transition: 'opacity 0.3s', opacity: menuOpen ? 0 : 1 }} />
            <span style={{ display: 'block', width: '23px', height: '2px', background: '#0A0A0A', borderRadius: '2px', transition: 'transform 0.3s, opacity 0.3s', transform: menuOpen ? 'rotate(-45deg) translate(5px,-5px)' : 'none' }} />
          </button>
        </div>

        {/* Orange accent line */}
        <div style={{ height: '2px', background: 'linear-gradient(90deg, transparent 0%, #FF6B00 50%, transparent 100%)' }} />
      </header>

      {/* ── BACKDROP ── */}
      <div
        onClick={() => setMenuOpen(false)}
        style={{
          position: 'fixed', inset: 0, zIndex: 1098,
          background: 'rgba(0,0,0,0.55)',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'all' : 'none',
          transition: 'opacity 0.3s',
        }}
      />

      {/* ── MOBILE DRAWER ── */}
      <div style={{
        position: 'fixed', top: 0, right: 0,
        width: 'min(300px, 85vw)', height: '100dvh',
        zIndex: 1099,
        background: '#fff',
        boxShadow: '-8px 0 48px rgba(0,0,0,0.18)',
        transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex', flexDirection: 'column',
        overflowY: 'auto',
      }}>

        {/* Drawer header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 22px',
          borderBottom: '1px solid rgba(0,0,0,0.07)',
        }}>
          <Link to="/" onClick={() => setMenuOpen(false)} style={{
            fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.6rem',
            letterSpacing: '0.08em', textDecoration: 'none', color: '#0A0A0A',
          }}>
            REVA<span style={{ color: '#FF6B00' }}>Doo</span>
          </Link>
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            style={{
              background: 'rgba(0,0,0,0.05)', border: 'none', borderRadius: '8px',
              width: '36px', height: '36px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        

        {/* Nav links */}
        <nav style={{ padding: '4px 22px', flex: 1 }}>
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="drawer-link"
              style={{
                display: 'flex', alignItems: 'center',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.95rem',
                fontWeight: isActive(to) ? 600 : 500,
                letterSpacing: '0.07em', textTransform: 'uppercase',
                color: isActive(to) ? '#FF6B00' : '#1a1a1a',
                padding: '15px 0',
                borderBottom: '1px solid rgba(0,0,0,0.06)',
                textDecoration: 'none',
              }}
            >
              {isActive(to) && (
                <span style={{
                  display: 'inline-block', width: '5px', height: '5px',
                  borderRadius: '50%', background: '#FF6B00',
                  marginRight: '10px', flexShrink: 0,
                }} />
              )}
              {label}
            </Link>
          ))}
        </nav>

        {/* CTA buttons */}
        <div style={{
          padding: '20px 22px 36px',
          display: 'flex', flexDirection: 'column', gap: '10px',
          borderTop: '1px solid rgba(0,0,0,0.07)',
        }}>
          <Link
            to="/authpage"
            onClick={() => setMenuOpen(false)}
            style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: '0.92rem', fontWeight: 700,
              color: '#fff', padding: '14px 20px', borderRadius: '8px',
              textAlign: 'center', textDecoration: 'none',
              background: 'linear-gradient(135deg, #FF6B00, #FF8C00)',
              boxShadow: '0 4px 16px rgba(255,107,0,0.32)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
              <polyline points="17 6 23 6 23 12"/>
            </svg>
            Start Earning
          </Link>
          <Link
            to="/authpage"
            onClick={() => setMenuOpen(false)}
            style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: '0.92rem', fontWeight: 600,
              color: '#444', padding: '13px 20px', borderRadius: '8px',
              border: '1.5px solid #E0E0E0', textDecoration: 'none',
              textAlign: 'center',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            Login / Sign Up
          </Link>
        </div>
      </div>
    </>
  )
}
