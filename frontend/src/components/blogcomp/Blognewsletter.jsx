import React, { useState } from 'react';

const ORANGE = '#FF6B00';

const PERKS = [
  { icon:'⚡', text:'Weekly earning strategy digest'   },
  { icon:'🎯', text:'Exclusive bonus task alerts'      },
  { icon:'🔥', text:'Top earner interviews monthly'    },
  { icon:'💸', text:'Reward rate change notifications' },
];

export default function BlogNewsletter() {
  const [email,     setEmail]     = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error,     setError]     = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.includes('@')) { setError('Please enter a valid email address.'); return; }
    setSubmitted(true);
    setError('');
  };

  return (
    <section
      aria-labelledby="newsletter-heading"
      style={{ background:'#0A0A0A', padding:'clamp(64px,8vw,100px) clamp(16px,4vw,64px)', position:'relative', overflow:'hidden' }}
    >
      <div aria-hidden="true" style={{ position:'absolute', inset:0, pointerEvents:'none', backgroundImage:'linear-gradient(rgba(255,107,0,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,107,0,0.04) 1px,transparent 1px)', backgroundSize:'56px 56px' }} />
      <div aria-hidden="true" style={{ position:'absolute', bottom:-100, left:'50%', transform:'translateX(-50%)', width:'80%', maxWidth:600, height:400, background:'radial-gradient(ellipse,rgba(255,107,0,0.1) 0%,transparent 65%)', pointerEvents:'none' }} />

      <style>{`
        .nl-inner { max-width:1280px; margin:0 auto; display:grid; grid-template-columns:1fr 1fr; gap:clamp(32px,6vw,80px); align-items:center; position:relative; z-index:1; }
        .nl-form  { display:flex; gap:10px; }
        @media(max-width:900px){ .nl-inner{ grid-template-columns:1fr; gap:40px; } }
        @media(max-width:640px){ .nl-form{ flex-direction:column; } }
      `}</style>

      <div className="nl-inner">
        <div>
          <div className="sec-label" style={{ color:ORANGE }}>Newsletter</div>
          <h2 id="newsletter-heading" style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(2.4rem,5vw,4.2rem)', lineHeight:0.95, letterSpacing:'0.04em', color:'#fff', textTransform:'uppercase', marginBottom:20, wordBreak:'break-word' }}>
            FRESH TIPS.<br /><span style={{ color:ORANGE }}>EVERY WEEK.</span><br />FREE FOREVER.
          </h2>
          <p style={{ fontFamily:"'Manrope',sans-serif", fontSize:'clamp(13px,1.2vw,15px)', color:'rgba(255,255,255,0.45)', lineHeight:1.8, marginBottom:32, wordBreak:'break-word' }}>
            Join 40,000+ members getting the best reward strategies, bonus alerts, and member spotlights delivered straight to their inbox every week.
          </p>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {PERKS.map(({ icon, text }) => (
              <div key={text} style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:32, height:32, borderRadius:8, background:'rgba(255,107,0,0.12)', border:'1px solid rgba(255,107,0,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, flexShrink:0 }}>{icon}</div>
                <span style={{ fontFamily:"'Manrope',sans-serif", fontSize:14, color:'rgba(255,255,255,0.55)', fontWeight:500 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20, padding:'clamp(24px,4vw,40px)' }}>
          {submitted ? (
            <div style={{ textAlign:'center', padding:'24px 0' }}>
              <div style={{ fontSize:48, marginBottom:16 }}>🎉</div>
              <h3 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'2rem', color:'#fff', letterSpacing:'0.04em', marginBottom:8 }}>YOU&apos;RE IN!</h3>
              <p style={{ fontFamily:"'Manrope',sans-serif", fontSize:14, color:'rgba(255,255,255,0.45)', lineHeight:1.7 }}>
                Welcome to the Revadoo Blog newsletter. Your first issue drops this Sunday.
              </p>
            </div>
          ) : (
            <>
              <h3 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(1.4rem,2vw,1.8rem)', color:'#fff', letterSpacing:'0.04em', marginBottom:6 }}>JOIN 40K+ READERS</h3>
              <p style={{ fontFamily:"'Manrope',sans-serif", fontSize:13, color:'rgba(255,255,255,0.4)', lineHeight:1.65, marginBottom:28 }}>
                No spam. Unsubscribe in one click. We publish every Sunday at 9 AM EST.
              </p>
              <form onSubmit={handleSubmit} noValidate>
                <div className="nl-form" style={{ marginBottom:12 }}>
                  <input
                    type="email" value={email}
                    onChange={e => { setEmail(e.target.value); setError(''); }}
                    placeholder="your@email.com" aria-label="Email address" required
                    style={{ flex:1, minWidth:0, background:'rgba(255,255,255,0.07)', border:`1px solid ${error ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.12)'}`, borderRadius:10, padding:'clamp(10px,2vw,13px) clamp(12px,2vw,18px)', fontFamily:"'Manrope',sans-serif", fontSize:14, color:'#fff', outline:'none', width:'100%' }}
                  />
                  <button type="submit" className="btn-primary" style={{ padding:'clamp(10px,2vw,13px) clamp(18px,3vw,28px)', fontSize:14, borderRadius:10, whiteSpace:'nowrap', flexShrink:0 }}>
                    Subscribe →
                  </button>
                </div>
                {error && <p role="alert" style={{ fontFamily:"'Manrope',sans-serif", fontSize:12, color:'#ef4444', marginTop:4 }}>{error}</p>}
              </form>
              <p style={{ fontFamily:"'Manrope',sans-serif", fontSize:11, color:'rgba(255,255,255,0.2)', marginTop:16, lineHeight:1.6 }}>
                By subscribing you agree to receive weekly emails from Revadoo Blog. We never share your data with third parties.
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}