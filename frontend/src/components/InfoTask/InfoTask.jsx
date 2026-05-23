import { useEffect } from "react";
import Loops from "../InfoTask/Loops"; 

export default function InfoTask() {
  // Added hardware acceleration (will-change) and optimized timing for buttery-smooth, fast loading animations
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Anton&family=Barlow:wght@400;600;700&display=swap');
      .font-anton { font-family: 'Anton', sans-serif !important; }
      .font-barlow { font-family: 'Barlow', sans-serif !important; }
      .orange-glow:hover { box-shadow: 0 12px 36px rgba(255,107,0,0.3); }
      
      @keyframes float-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
      @keyframes float-medium { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
      @keyframes float-fast { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
      
      @keyframes fade-in-up { 
        0% { opacity: 0; transform: translateY(20px); } 
        100% { opacity: 1; transform: translateY(0); } 
      }
      @keyframes draw-line { 
        0% { stroke-dashoffset: 1000; opacity: 0; } 
        10% { opacity: 1; }
        100% { stroke-dashoffset: 0; opacity: 1; } 
      }
      @keyframes glow-pulse {
        0%, 100% { opacity: 0.1; filter: blur(80px); }
        50% { opacity: 0.15; filter: blur(100px); }
      }
      
      .animate-float-slow { animation: float-slow 5s ease-in-out infinite; will-change: transform; }
      .animate-float-medium { animation: float-medium 3.5s ease-in-out infinite; will-change: transform; }
      .animate-float-fast { animation: float-fast 2.5s ease-in-out infinite; will-change: transform; }
      
      .animate-fade-up { animation: fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; will-change: transform, opacity; }
      .animate-draw { stroke-dasharray: 1000; stroke-dashoffset: 1000; animation: draw-line 1.8s cubic-bezier(0.25, 1, 0.5, 1) forwards; animation-delay: 0.15s; will-change: stroke-dashoffset, opacity; }
      .animate-glow { animation: glow-pulse 4s ease-in-out infinite; will-change: opacity, filter; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div className="font-barlow bg-[#FAFAFA] text-neutral-900 min-h-screen overflow-x-hidden">
      {/* HERO / HOW IT WORKS SECTION - Reduced Top Padding here (pt-8 md:pt-12) */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 pt-8 md:pt-12 pb-16">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          
          {/* LEFT — Text Content */}
          <div className="flex-1 w-full">
            <div className="inline-flex items-center gap-2 bg-white border border-neutral-200 border-l-4 border-l-[#FF6B00] px-4 py-1.5 rounded-sm text-[#FF6B00] text-xs font-bold tracking-widest uppercase mb-8 shadow-sm hover:bg-orange-50 hover:scale-105 transition-all duration-200 ease-out cursor-default animate-fade-up" style={{ animationDelay: '0s' }}>
              <span>●</span> How It Works
            </div>
            <h1 className="font-anton text-6xl sm:text-7xl md:text-8xl lg:text-7xl xl:text-[90px] leading-none tracking-tight uppercase mb-7 animate-fade-up" style={{ animationDelay: '0.1s' }}>
              <span className="text-[#FF6B00] hover:drop-shadow-[0_0_15px_rgba(255,107,0,0.4)] transition-all duration-200 ease-out cursor-default">DO</span> TASKS<br />
              <span style={{ WebkitTextStroke: "2px #171717", color: "transparent" }} className="hover:text-neutral-900 transition-colors duration-300 ease-out cursor-default">EARN</span><br />
              REWARDS
            </h1>
            <p className="text-lg text-neutral-600 max-w-md leading-relaxed mb-10 animate-fade-up hover:text-neutral-900 transition-colors duration-200 ease-out" style={{ animationDelay: '0.2s' }}>
              The simplest way to turn spare time into real money. No skills required — just pick a task, do it, and get paid.
            </p>
            <div className="flex flex-wrap items-center gap-4 animate-fade-up" style={{ animationDelay: '0.3s' }}>
              <button
                className="bg-[#FF6B00] hover:bg-[#e66000] text-white font-bold text-sm uppercase tracking-wide px-8 py-4 rounded transition-all duration-200 ease-out hover:-translate-y-1 orange-glow active:scale-95"
                onClick={() => window.location.href = "/login"}
              >
                Start Earning Free →
              </button>
              <button className="bg-white text-neutral-700 border border-neutral-300 hover:border-[#FF6B00] hover:text-[#FF6B00] hover:bg-orange-50 hover:shadow-lg hover:-translate-y-1 font-semibold text-sm uppercase tracking-wide px-8 py-4 rounded transition-all duration-200 ease-out active:scale-95">
                Watch Demo
              </button>
              <div className="flex items-center gap-2 text-sm text-neutral-500 hover:text-[#FF6B00] transition-colors duration-200 ease-out cursor-default group">
                <span className="text-[#FF6B00] font-bold group-hover:animate-ping">●</span> 2.4M earners active right now
              </div>
            </div>
          </div>

          {/* RIGHT — Futuristic UI Illustration */}
          <div className="flex-1 w-full relative perspective-1000 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            {/* Outer Decorative Glow with pulse */}
            <div className="absolute inset-0 bg-[#FF6B00] opacity-10 rounded-full w-3/4 h-3/4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-glow z-0"></div>

            {/* Main Dashboard Card */}
            <div className="relative w-full aspect-[4/3] md:aspect-[16/11] bg-white border border-neutral-200 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_60px_rgba(255,107,0,0.12)] hover:border-[#FF6B00]/40 overflow-hidden flex flex-col p-6 animate-float-slow transition-all duration-500 ease-out group cursor-default z-10">
              
              {/* Subtle Grid Background */}
              <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.05] pointer-events-none transition-opacity duration-300 ease-out" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

              {/* Header */}
              <div className="flex justify-between items-center mb-8 relative z-10">
                <div className="flex items-center gap-3 group/balance">
                  <div className="w-10 h-10 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-lg shadow-sm group-hover/balance:bg-orange-50 group-hover/balance:border-orange-200 transition-colors duration-200 ease-out">👤</div>
                  <div>
                    <div className="text-xs text-neutral-500 font-semibold uppercase tracking-wider mb-0.5">Total Balance</div>
                    <div className="text-2xl font-anton text-neutral-900 tracking-wide group-hover/balance:scale-105 transition-transform duration-200 ease-out origin-left">$4,250<span className="text-[#FF6B00]">.00</span></div>
                  </div>
                </div>
                <div className="bg-[#FF6B00]/10 text-[#FF6B00] border border-[#FF6B00]/20 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5 hover:bg-[#FF6B00]/20 hover:scale-105 transition-all duration-200 ease-out cursor-pointer">
                  <span className="w-1.5 h-1.5 bg-[#FF6B00] rounded-full animate-pulse"></span>
                  Live Earnings
                </div>
              </div>

              {/* Chart Area */}
              <div className="flex-1 w-full relative z-10 mt-4">
                {/* Y-axis labels */}
                <div className="absolute left-0 h-full flex flex-col justify-between text-[10px] text-neutral-400 font-semibold pb-4">
                  <span className="hover:text-[#FF6B00] hover:-translate-y-0.5 transition-all duration-200 ease-out cursor-default">$5k</span>
                  <span className="hover:text-[#FF6B00] hover:-translate-y-0.5 transition-all duration-200 ease-out cursor-default">$3k</span>
                  <span className="hover:text-[#FF6B00] hover:-translate-y-0.5 transition-all duration-200 ease-out cursor-default">$1k</span>
                </div>
                
                {/* SVG Glowing Chart */}
                <div className="absolute inset-0 ml-8">
                  <svg className="w-full h-full group-hover:scale-[1.02] transition-transform duration-500 ease-out origin-bottom" viewBox="0 0 400 150" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="gradientLine" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#FF6B00" stopOpacity="0.2" />
                        <stop offset="50%" stopColor="#FF6B00" />
                        <stop offset="100%" stopColor="#FF6B00" />
                      </linearGradient>
                      <linearGradient id="gradientFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FF6B00" stopOpacity="0.15" />
                        <stop offset="100%" stopColor="#FF6B00" stopOpacity="0" />
                      </linearGradient>
                      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>
                    {/* Fill Area */}
                    <path d="M0,120 C50,110 100,130 150,80 C200,30 250,90 300,50 C350,10 380,20 400,10 L400,150 L0,150 Z" fill="url(#gradientFill)" className="opacity-0 animate-fade-up" style={{ animationDelay: '0.8s' }} />
                    {/* Chart Line with drawing animation */}
                    <path d="M0,120 C50,110 100,130 150,80 C200,30 250,90 300,50 C350,10 380,20 400,10" fill="none" stroke="url(#gradientLine)" strokeWidth="4" filter="url(#glow)" className="animate-draw" />
                    {/* Data Point Dots with hover interactions */}
                    <circle cx="150" cy="80" r="4" fill="white" stroke="#FF6B00" strokeWidth="2" className="opacity-0 animate-fade-up hover:r-[6px] hover:fill-[#FF6B00] transition-all duration-200 ease-out cursor-pointer" style={{ animationDelay: '0.6s' }} />
                    <circle cx="300" cy="50" r="4" fill="white" stroke="#FF6B00" strokeWidth="2" className="opacity-0 animate-fade-up hover:r-[6px] hover:fill-[#FF6B00] transition-all duration-200 ease-out cursor-pointer" style={{ animationDelay: '1s' }} />
                    <circle cx="400" cy="10" r="5" fill="#FF6B00" stroke="white" strokeWidth="2" className="animate-pulse hover:r-[8px] hover:fill-white hover:stroke-[3px] transition-all duration-200 ease-out cursor-pointer" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Floating Task Completed Card - Moved higher to avoid overlapping the inner content */}
            <div className="absolute -top-12 md:-top-16 right-2 md:-right-4 animate-float-medium z-20">
              <div className="w-44 md:w-48 bg-white border border-neutral-200 shadow-[0_15px_30px_rgba(0,0,0,0.08)] rounded-xl p-3 flex items-center gap-3 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(34,197,94,0.15)] hover:border-green-200 transition-all duration-200 ease-out cursor-pointer group/card">
                <div className="w-10 h-10 rounded-full bg-green-50 border border-green-100 flex items-center justify-center text-green-500 shadow-inner group-hover/card:scale-110 group-hover/card:bg-green-100 transition-transform duration-200 ease-out">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider group-hover/card:text-green-600 transition-colors duration-200 ease-out">Task Done</span>
                  <span className="text-sm font-bold text-neutral-900 group-hover/card:scale-105 origin-left transition-transform duration-200 ease-out">+ $15.50</span>
                </div>
              </div>
            </div>

            {/* Floating Reward Coin - Bottom Left */}
            <div className="absolute -bottom-4 -left-4 md:-left-6 animate-float-fast z-20">
              <div className="w-16 h-16 bg-white border border-[#FF6B00]/30 shadow-[0_15px_30px_rgba(255,107,0,0.15)] rounded-full flex items-center justify-center hover:scale-110 hover:shadow-[0_20px_40px_rgba(255,107,0,0.3)] hover:rotate-12 transition-all duration-200 ease-out cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF6B00] to-[#e66000] flex items-center justify-center text-white text-xl shadow-inner">
                  ✦
                </div>
              </div>
            </div>

            {/* Small Action Card - Bottom Right */}
            <div className="absolute -bottom-8 right-8 animate-float-slow z-20" style={{ animationDelay: '0.8s' }}>
              <div className="w-36 bg-white border border-neutral-200 shadow-[0_10px_25px_rgba(0,0,0,0.06)] rounded-lg p-2.5 flex items-center gap-2 hover:scale-105 hover:shadow-[0_15px_30px_rgba(255,107,0,0.1)] hover:border-[#FF6B00]/30 transition-all duration-200 ease-out cursor-pointer group/action">
                 <div className="w-6 h-6 rounded bg-[#FF6B00]/10 flex items-center justify-center text-[10px] group-hover/action:scale-110 group-hover/action:-rotate-12 transition-all duration-200 ease-out">🕹️</div>
                 <div className="flex flex-col w-full">
                   <span className="text-[9px] text-neutral-500 font-bold uppercase group-hover/action:text-neutral-800 transition-colors duration-200 ease-out">Playing Game</span>
                   <div className="w-full h-1.5 bg-neutral-100 rounded-full mt-1 overflow-hidden">
                     <div className="h-full bg-[#FF6B00] rounded-full group-hover/action:w-[85%] w-[70%] transition-all duration-500 ease-out"></div>
                   </div>
                 </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>
      
      {/* Light Theme Timeline Component */}
      <Loops />
    </div>
  );
}