import React, { useState, useEffect } from 'react';

import divyaImg from '../../assets/AboutTeam/Divya.jpeg';
import anmolImg from '../../assets/AboutTeam/anmolk.png';
import kapilImg from '../../assets/AboutTeam/kapilprofilepic.png';
import hardeepImg from '../../assets/AboutTeam/hardeepsingh.jpeg';
import chiragImg from '../../assets/AboutTeam/chirag.png';
import shagunImg from '../../assets/AboutTeam/shagun.png';
import sahilImg from '../../assets/AboutTeam/sahil.png';
import surajImg from '../../assets/AboutTeam/suraj.jpeg';
import HritImg from '../../assets/AboutTeam/Hrittik.png';
import CImg from '../../assets/AboutTeam/cparkash.jpeg';

const TeamSection = ({ gridBg, Label, Heading }) => {
  const team = [

    { name: 'Chandar Prakash', role: 'CEO & Founder', img: CImg },
    { name: 'Divya Gupta', role: 'AI&ML Developer', img: divyaImg },
    { name: 'Anmol', role: 'App Developer', img: anmolImg },
    { name: 'Suraj', role: 'Fullstack Developer', img: surajImg },
    { name: 'Kapil', role: 'Team Leader', img: kapilImg },
    { name: 'Hardeep singh Saini', role: 'MERN Stack Developer', img: hardeepImg },
    { name: 'Chirag', role: 'Full Stack Developer', img: chiragImg },
    { name: 'Shagun', role: 'UI/UX Designer', img: shagunImg },
    { name: 'Sahil', role: 'UI/UX Designer', img: sahilImg },
    { name: 'Hrittik', role: 'MERN Stack Developer', img: HritImg }, 
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-play loop logic
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % team.length);
    }, 1500); 

    return () => clearInterval(interval);
  }, [isPaused, team.length]);

  const handleCardClick = (index) => {
    setActiveIndex(index);
  };

  const prevCard = (e) => {
    e.stopPropagation(); 
    setActiveIndex((prevIndex) => (prevIndex - 1 + team.length) % team.length);
  };

  const nextCard = (e) => {
    e.stopPropagation();
    setActiveIndex((prevIndex) => (prevIndex + 1) % team.length);
  };

  const getCardClass = (index) => {
    const total = team.length;
    if (index === activeIndex) return 'card-center';
    if (index === (activeIndex + 1) % total) return 'card-right';
    if (index === (activeIndex - 1 + total) % total) return 'card-left';
    if (index === (activeIndex + 2) % total) return 'card-hidden-right';
    if (index === (activeIndex - 2 + total) % total) return 'card-hidden-left';
    return 'card-hidden';
  };

  return (
    <>
      <style>{`
        .slider-viewport {
          position: relative;
          width: 100%;
          /* ════ COMPRESSED HEIGHT ════ */
          height: clamp(340px, 45vw, 420px);
          overflow: hidden;
          margin-top: 10px;
          perspective: 2000px; 
        }

        .team-3d-card {
          position: absolute;
          top: 50%;
          left: 50%;
          /* ════ COMPRESSED CARD WIDTH ════ */
          width: clamp(200px, 22vw, 240px);
          background: #000;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid rgba(255,107,0,0.1);
          transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), 
                      opacity 0.4s ease, 
                      filter 0.4s ease,
                      box-shadow 0.3s ease;
          cursor: pointer;
          backface-visibility: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        
        .team-3d-card:hover {
          box-shadow: 0 10px 30px rgba(255,107,0,0.15) !important;
          border-color: rgba(255,107,0,0.3) !important;
        }

        .card-center {
          transform: translate(-50%, -50%) scale(1) rotateY(0deg);
          opacity: 1;
          z-index: 10;
          filter: grayscale(0) brightness(1);
          border-color: rgba(255,107,0,0.5);
          box-shadow: 0 15px 40px rgba(255,107,0,0.25);
        }

        .card-right {
          transform: translate(60%, -50%) scale(0.75) rotateY(-20deg);
          opacity: 0.5;
          z-index: 5;
          filter: grayscale(1) brightness(0.5); 
        }

        .card-left {
          transform: translate(-160%, -50%) scale(0.75) rotateY(20deg);
          opacity: 0.5;
          z-index: 5;
          filter: grayscale(1) brightness(0.5); 
        }

        .card-hidden-right {
          transform: translate(180%, -50%) scale(0.6) rotateY(-30deg);
          opacity: 0;
          z-index: 1;
        }

        .card-hidden-left {
          transform: translate(-280%, -50%) scale(0.6) rotateY(30deg);
          opacity: 0;
          z-index: 1;
        }

        .card-hidden {
          transform: translate(-50%, -50%) scale(0.5);
          opacity: 0;
          z-index: -1;
          pointer-events: none;
        }

        /* ════ COMPRESSED SIDE NAVIGATION BUTTONS ════ */
        .side-nav-btn {
          position: absolute;
          top: 50%;
          width: 46px; /* Reduced from 54px */
          height: 46px; /* Reduced from 54px */
          border-radius: 50%;
          background: #FF6B00;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid #FF6B00;
          color: #fff; 
          font-size: 1.2rem; /* Reduced from 1.5rem */
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
          z-index: 20; 
          outline: none;
          box-shadow: 0 4px 15px rgba(255,107,0,0.3);
        }

        .side-nav-btn:hover {
          background: #e55f00;
          color: #fff;
          border-color: #e55f00;
          transform: translateY(-50%) scale(1.1);
          box-shadow: 0 0 20px rgba(255,107,0,0.6);
        }

        .side-nav-btn:active {
          transform: translateY(-50%) scale(0.95);
        }

        .nav-left {
          left: clamp(10px, 4vw, 40px);
          transform: translateY(-50%);
        }

        .nav-right {
          right: clamp(10px, 4vw, 40px);
          transform: translateY(-50%);
        }

        /* Responsive Settings */
        @media (max-width: 900px) {
          .card-right { transform: translate(50%, -50%) scale(0.8) rotateY(-15deg); }
          .card-left { transform: translate(-150%, -50%) scale(0.8) rotateY(15deg); }
          .card-hidden-right { transform: translate(150%, -50%) scale(0.7); }
          .card-hidden-left { transform: translate(-250%, -50%) scale(0.7); }
        }
        
        @media (max-width: 600px) {
          /* Mobile Compressed */
          .team-3d-card { width: clamp(180px, 50vw, 210px); } 
          .card-right { transform: translate(-10%, -50%) scale(0.75) rotateY(-10deg); opacity: 0.3; } 
          .card-left { transform: translate(-90%, -50%) scale(0.75) rotateY(10deg); opacity: 0.3; } 
          .card-hidden-right { transform: translate(60%, -50%) scale(0.65); }
          .card-hidden-left { transform: translate(-160%, -50%) scale(0.65); }
          .side-nav-btn {
            width: 38px;
            height: 38px;
            font-size: 1rem;
          }
          .nav-left { left: 5px; }
          .nav-right { right: 5px; }
        }
      `}</style>

      {/* COMPRESSED PADDING: Inline style added to override huge default paddings */}
      <section style={{ padding: 'clamp(40px, 6vw, 80px) clamp(20px, 5vw, 48px)', background: '#ffffff', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, ...gridBg, pointerEvents: 'none' }} />
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          width: 'min(800px,90vw)', height: 600, pointerEvents: 'none',
          background: 'radial-gradient(ellipse,rgba(255,107,0,0.06) 0%,transparent 70%)',
        }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          
          <div style={{ 
            display: 'flex', 
            flexDirection: 'row', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            flexWrap: 'nowrap',
            marginBottom: '30px', /* Reduced margin */
            width: '100%'
          }}>
            <div>
              <Label text="Our Team" />
              <Heading>THE PEOPLE WHO<br /><span style={{ color: '#FF6B00' }}>MAKE IT HAPPEN</span></Heading>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, transform: 'translateY(-14px)' }}>
              <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 'clamp(3.5rem, 8vw, 7rem)', color: '#FF6B00', lineHeight: 1 }}>
                {team.length}
              </span>
              <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 400, fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)', color: 'rgba(0,0,0,0.4)', letterSpacing: '0.2em', textTransform: 'uppercase', lineHeight: 1.6 }}>
                CORE<br />TEAM<br />MEMBERS
              </span>
            </div>
          </div>
          
          <div 
            className="slider-viewport"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <button className="side-nav-btn nav-left" onClick={prevCard} aria-label="Previous team member">
              ←
            </button>

            {team.map((m, index) => {
              const cardClass = getCardClass(index);
              return (
                <div 
                  key={index} 
                  className={`team-3d-card ${cardClass}`}
                  onClick={() => handleCardClick(index)}
                >
                  {/* ════ COMPRESSED IMAGE HEIGHT ════ */}
                  <div style={{ width: '100%', height: 'clamp(180px, 26vw, 220px)', background: '#1a1a1a', position: 'relative' }}>
                    {m.img ? (
                      <img 
                        src={m.img} 
                        alt={`${m.name}`} 
                        // objectPosition added to fit profile pictures perfectly from the top/center
                        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }} 
                      />
                    ) : (
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <span style={{ color: '#FF6B00', fontFamily: "'Barlow Condensed',sans-serif", fontSize: '0.9rem', letterSpacing: '0.1em' }}>IMAGE PENDING</span>
                      </div>
                    )}
                  </div>
                  <div style={{ padding: 'clamp(12px,1.5vw,16px)', background: '#0A0A0A' }}>
                    <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 'clamp(1rem,1.2vw,1.15rem)', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: 4 }}>
                      {m.name}
                    </div>
                    <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 400, fontSize: '0.75rem', color: '#FF6B00', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                      {m.role}
                    </div>
                  </div>
                </div>
              );
            })}

            <button className="side-nav-btn nav-right" onClick={nextCard} aria-label="Next team member">
              →
            </button>
          </div>

        </div>
      </section>
    </>
  );
};

export default TeamSection;