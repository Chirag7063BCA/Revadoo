import React, { useEffect, useState } from 'react';
import chiragImg from '../../assets/AboutTeam/chirag.png';

const AboutMeSection = ({ gridBg, Label, Heading }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Trigger animation after component mounts for a smooth entry
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <style>{`
        .about-container {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: clamp(40px, 6vw, 80px);
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        /* --- Animations --- */
        .slide-in-left {
          opacity: 0;
          transform: translateX(-80px);
          transition: opacity 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), 
                      transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .slide-in-right {
          opacity: 0;
          transform: translateX(80px);
          transition: opacity 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.2s, 
                      transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.2s;
        }

        .is-visible {
          opacity: 1;
          transform: translateX(0);
        }

        /* --- Image Section (Left) --- */
        .about-image-wrapper {
          flex: 0 0 45%;
          position: relative;
        }

        .image-frame {
          position: relative;
          width: 100%;
          aspect-ratio: 4/5;
          background: #000000; /* Black 10% */
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid rgba(255, 107, 0, 0.2);
          box-shadow: -15px 15px 0px rgba(255, 107, 0, 0.1); /* Orange accent shadow */
        }

        .image-frame img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          transition: transform 0.5s ease;
        }

        .image-frame:hover img {
          transform: scale(1.05);
        }

        .orange-corner {
          position: absolute;
          top: -15px;
          left: -15px;
          width: 60px;
          height: 60px;
          border-top: 4px solid #FF6B00;
          border-left: 4px solid #FF6B00;
          z-index: 3;
        }

        /* --- Text Section (Right) --- */
        .about-text-content {
          flex: 1;
          color: #000000; /* Black 10% */
        }

        .about-heading {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 900;
          font-size: clamp(2.5rem, 5vw, 3.5rem);
          text-transform: uppercase;
          line-height: 1.1;
          margin-bottom: 24px;
        }

        .about-heading span {
          color: #FF6B00; /* Orange 10% */
        }

        .about-paragraph {
          font-family: 'Inter', sans-serif; /* Standard clean readable font */
          font-size: clamp(1rem, 1.2vw, 1.1rem);
          line-height: 1.7;
          margin-bottom: 20px;
          color: rgba(0, 0, 0, 0.8);
        }

        .tech-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 24px;
        }

        .tech-tag {
          padding: 6px 16px;
          background: #000000;
          color: #ffffff;
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 600;
          font-size: 0.95rem;
          letter-spacing: 0.05em;
          border-radius: 4px;
          border-left: 3px solid #FF6B00;
        }

        /* --- Responsive --- */
        @media (max-width: 900px) {
          .about-container {
            flex-direction: column;
          }
          .about-image-wrapper {
            flex: 0 0 auto;
            width: 80%;
            max-width: 400px;
          }
          .about-text-content {
            text-align: center;
          }
          .tech-tags {
            justify-content: center;
          }
        }
      `}</style>

      <section style={{ 
        padding: 'clamp(60px, 8vw, 120px) clamp(20px, 5vw, 48px)', 
        background: '#ffffff', /* White 80% */
        position: 'relative', 
        overflow: 'hidden' 
      }}>
        {/* Subtle Background Grid */}
        <div style={{ position: 'absolute', inset: 0, ...gridBg, pointerEvents: 'none', opacity: 0.3 }} />
        
        <div className="about-container">
          
          {/* LEFT: Image Sliding In */}
          <div className={`about-image-wrapper slide-in-left ${isVisible ? 'is-visible' : ''}`}>
            <div className="orange-corner"></div>
            <div className="image-frame">
              {chiragImg ? (
                <img src={chiragImg} alt="Chirag - Full Stack Developer" />
              ) : (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: '#FF6B00', fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: '0.1em' }}>IMAGE PENDING</span>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Text Sliding In */}
          <div className={`about-text-content slide-in-right ${isVisible ? 'is-visible' : ''}`}>
            {Label ? <Label text="About Me" /> : (
               <div style={{ color: '#FF6B00', fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '10px' }}>
                 Get To Know Me
               </div>
            )}
            
            <h2 className="about-heading">
              BUILDING MODERN <br/>
              <span>WEB EXPERIENCES</span>
            </h2>

            <p className="about-paragraph">
              Hi, I'm <strong>Chirag</strong>, a passionate Full Stack Developer from Punjab, India. I specialize in building modern, responsive, and user-friendly web applications, transforming complex ideas into seamless real-world solutions.
            </p>

            <p className="about-paragraph">
              Throughout my journey, I've engineered diverse projects—from Vendor Marketplaces and College Management Systems to Movie Booking platforms. These experiences have given me deep, hands-on expertise in secure authentication, RESTful APIs, robust database management, and writing clean, maintainable code.
            </p>

            <p className="about-paragraph">
              My goal is to craft impactful software that makes technology accessible and highly functional for everyone. When I'm not coding, you'll find me exploring new technologies, watching gaming streams, or diving into creative design ideas.
            </p>

            <div className="tech-tags">
              <span className="tech-tag">React.js</span>
              <span className="tech-tag">Node.js</span>
              <span className="tech-tag">Express.js</span>
              <span className="tech-tag">MongoDB</span>
              <span className="tech-tag">JavaScript</span>
            </div>
          </div>

        </div>
      </section>
    </>
  );
};

export default AboutMeSection;