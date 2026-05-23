import React from 'react';

const WhyUsSection = ({ gridBg, Label, Heading, Body }) => {
  const pillars = [
    { icon: '⚡', title: 'Instant Rewards', desc: 'Complete tasks and get paid fast. No waiting periods, no minimums — your Creds are yours the moment you earn them.' },
    { icon: '🎯', title: 'Real Opportunities', desc: 'Every task on our platform is vetted and valued. We connect you with brands and surveys that respect your time.' },
    { icon: '🔒', title: 'Safe & Transparent', desc: 'No hidden fees. No data selling. Your earnings and personal information are always protected on our platform.' },
  ];

  return (
    <section className="about-section-pad" style={{ position: 'relative', overflow: 'hidden' }}>
      <img
        src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&h=700&fit=crop&q=80"
        alt="Analytics and earning data on screen"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,10,10,0.85)' }} />
      <div style={{ position: 'absolute', inset: 0, ...gridBg, pointerEvents: 'none' }} />
      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(40px,6vw,72px)' }}>
          <Label text="Why Us?" center />
          <Heading light center>WHY MILLIONS<br /><span style={{ color: '#FF6B00' }}>TRUST OUR PLATFORM</span></Heading>
          <div style={{ maxWidth: 520, margin: '0 auto' }}>
            <Body light center>
              We built this platform around one principle: if you put in the work, you deserve to get paid — fast, fairly, and without hassle.
            </Body>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 24 }}>
          {pillars.map((p, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.04)', borderRadius: 22,
              border: '1px solid rgba(255,255,255,0.08)', padding: 'clamp(24px,4vw,36px) clamp(20px,3vw,32px)',
              transition: 'border-color 0.3s, background 0.3s, transform 0.3s', cursor: 'default',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,107,0,0.4)'; e.currentTarget.style.background = 'rgba(255,107,0,0.06)'; e.currentTarget.style.transform = 'translateY(-6px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              <div style={{ fontSize: 36, marginBottom: 16 }}>{p.icon}</div>
              <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: '1.4rem', color: '#fff', letterSpacing: '-0.01em', textTransform: 'uppercase', marginBottom: 12 }}>{p.title}</div>
              <Body light>{p.desc}</Body>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;