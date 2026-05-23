import React from "react";

const CurveLeftToRight = () => (
  <svg className="hidden md:block absolute top-[50%] left-[42%] lg:left-[38%] w-[58%] lg:w-[62%] h-[calc(100%+8rem)] z-0 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
    <path d="M 0,0 C 60,0 40,100 100,100" stroke="#ff5c00" strokeWidth="2" strokeDasharray="6,6" fill="none" vectorEffect="non-scaling-stroke" opacity="0.5" className="drop-shadow-[0_0_8px_rgba(255,92,0,0.3)] animate-dash-flow" />
  </svg>
);

const CurveRightToLeft = () => (
  <svg className="hidden md:block absolute top-[50%] right-[42%] lg:right-[38%] w-[58%] lg:w-[62%] h-[calc(100%+8rem)] z-0 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
    <path d="M 100,0 C 40,0 60,100 0,100" stroke="#ff5c00" strokeWidth="2" strokeDasharray="6,6" fill="none" vectorEffect="non-scaling-stroke" opacity="0.5" className="drop-shadow-[0_0_8px_rgba(255,92,0,0.3)] animate-dash-flow" />
  </svg>
);

const MiniMockup = ({ type }) => {
  if (type === "form") return (
    <div className="w-full max-w-[180px] flex flex-col gap-2 opacity-90 transition-transform duration-500 group-hover:scale-105">
      <div className="w-2/3 h-1.5 bg-orange-500 rounded mb-1 shadow-[0_0_10px_rgba(255,92,0,0.3)]"></div>
      <div className="w-full h-5 bg-white rounded border border-neutral-200"></div>
      <div className="w-full h-5 bg-white rounded border border-neutral-200"></div>
      <div className="w-full h-7 bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center rounded mt-1">SUBMIT</div>
    </div>
  );
  if (type === "id") return (
    <div className="w-[80%] h-[60%] bg-white border-2 border-dashed border-neutral-300 rounded-xl flex items-center justify-center p-3 gap-3 opacity-90 transition-all duration-500 group-hover:border-orange-500 group-hover:scale-105">
      <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center group-hover:bg-orange-500/10 transition-colors">
        <span className="text-lg">📸</span>
      </div>
      <div className="flex-1 flex flex-col gap-2">
        <div className="w-full h-1.5 bg-neutral-200 rounded"></div>
        <div className="w-1/2 h-1.5 bg-neutral-200 rounded"></div>
      </div>
    </div>
  );
  if (type === "plans") return (
    <div className="w-full h-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
      <div className="relative">
        <div className="absolute -inset-4 bg-orange-500/20 rounded-full blur-xl animate-pulse"></div>
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative drop-shadow-[0_0_15px_rgba(255,92,0,0.4)]">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#ff5c00" stroke="#ff5c00" strokeWidth="1" strokeLinejoin="round"/>
          <path d="M12 17.77V2L8.91 8.26L2 9.27L7 14.14L5.82 21.02L12 17.77Z" fill="white" opacity="0.3"/>
        </svg>
        <div className="absolute -bottom-2 -right-2 bg-white rounded-lg shadow-lg p-1 px-2 border border-orange-100">
          <span className="text-[10px] font-bold text-orange-500">BONUS</span>
        </div>
      </div>
    </div>
  );
  if (type === "ads") return (
    <div className="w-[80%] h-[70%] bg-white rounded-xl border border-neutral-200 flex flex-col overflow-hidden opacity-90 transition-transform duration-500 group-hover:scale-105">
      <div className="w-full flex-1 bg-neutral-50 flex items-center justify-center group-hover:bg-neutral-100 transition-colors">
        <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white pl-1 shadow-[0_0_15px_rgba(255,92,0,0.3)] text-sm">▶</div>
      </div>
      <div className="w-full h-6 bg-white border-t border-neutral-100 flex justify-between items-center px-3">
        <div className="w-1/2 h-1.5 bg-neutral-200 rounded"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-orange-500"></div>
      </div>
    </div>
  );
  if (type === "tasks") return (
    <div className="w-[80%] h-[75%] bg-white rounded-xl border border-neutral-200 p-3 flex flex-col gap-2 opacity-90 transition-transform duration-500 group-hover:scale-105">
      <div className="w-1/3 h-1.5 bg-neutral-300 rounded mb-1"></div>
      <div className="flex items-center gap-2 bg-neutral-50 p-2 rounded border border-neutral-200 group-hover:border-orange-500/50 transition-colors">
        <div className="w-3 h-3 rounded-sm border border-orange-500 bg-orange-500/10 flex-shrink-0 flex items-center justify-center"><span className="text-[8px] text-orange-500">✓</span></div>
        <div className="w-full h-1.5 bg-neutral-200 rounded"></div>
      </div>
      <div className="flex items-center gap-2 bg-neutral-50 p-2 rounded border border-neutral-200 group-hover:border-orange-500/50 transition-colors">
        <div className="w-3 h-3 rounded-sm border border-orange-500 bg-orange-500/10 flex-shrink-0 flex items-center justify-center"><span className="text-[8px] text-orange-500">✓</span></div>
        <div className="w-2/3 h-1.5 bg-neutral-200 rounded"></div>
      </div>
    </div>
  );
  if (type === "links") return (
    <div className="w-[85%] h-[40%] bg-white rounded-full border border-neutral-200 flex items-center px-4 justify-between opacity-90 transition-all duration-500 group-hover:scale-105 group-hover:border-orange-500 group-hover:shadow-[0_0_15px_rgba(255,92,0,0.15)]">
      <div className="flex items-center gap-2 w-2/3">
        <span className="text-orange-500 text-sm">🔗</span>
        <div className="w-full h-1.5 bg-neutral-200 rounded"></div>
      </div>
      <div className="w-4 h-4 rounded-full bg-neutral-100 group-hover:bg-orange-500 transition-colors"></div>
    </div>
  );
  if (type === "games") return (
    <div className="w-[85%] h-[80%] bg-white border border-neutral-200 rounded-xl p-2.5 flex flex-col gap-2 group-hover:border-orange-500/40 transition-all duration-500 shadow-sm opacity-90">
      <div className="flex justify-between items-center border-b border-neutral-100 pb-1.5 px-1">
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-400"></div>
          <div className="w-2 h-2 rounded-full bg-amber-400"></div>
          <div className="w-2 h-2 rounded-full bg-green-400"></div>
        </div>
        <span className="text-orange-500 text-[9px] font-bold tracking-widest uppercase">Arcade</span>
      </div>
      <div className="flex-1 bg-neutral-50 rounded-lg border border-neutral-200 relative overflow-hidden flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(255,92,0,0.1)] transition-all duration-500">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,92,0,0.1)_0,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <span className="text-4xl relative z-10 group-hover:scale-125 transition-transform duration-500 filter drop-shadow-[0_0_10px_rgba(255,92,0,0.3)]">🕹️</span>
      </div>
    </div>
  );
  if (type === "referral") return (
    <div className="w-[90%] h-[85%] flex flex-col items-center justify-center relative gap-3 opacity-90 transition-all duration-500 group-hover:scale-105">
      <div className="w-full h-16 relative flex items-center justify-center mt-2">
        <svg className="absolute inset-0 w-full h-full z-0" style={{ overflow: 'visible' }}>
          <path d="M 50,45 L 20,15" stroke="#ff5c00" strokeWidth="1.5" strokeDasharray="3,3" fill="none" opacity="0.3" className="group-hover:opacity-100 transition-opacity" />
          <path d="M 50,45 L 80,15" stroke="#ff5c00" strokeWidth="1.5" strokeDasharray="3,3" fill="none" opacity="0.3" className="group-hover:opacity-100 transition-opacity" />
        </svg>
        <div className="absolute top-0 left-3 w-7 h-7 bg-white border border-neutral-300 rounded-full flex items-center justify-center text-[10px] z-10 group-hover:border-orange-500 transition-colors shadow-sm">👤</div>
        <div className="absolute top-0 right-3 w-7 h-7 bg-white border border-neutral-300 rounded-full flex items-center justify-center text-[10px] z-10 group-hover:border-orange-500 transition-colors shadow-sm">👤</div>
        <div className="relative w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-xl z-20 shadow-[0_0_15px_rgba(255,92,0,0.3)] group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(255,92,0,0.4)] transition-all duration-500 text-white">
          🤝
        </div>
      </div>
      <div className="w-[85%] h-8 bg-white border border-neutral-200 rounded-full flex items-center justify-between p-1 pl-3 group-hover:border-orange-500/50 transition-colors z-20 shadow-sm">
        <div className="w-1/2 h-1.5 bg-neutral-200 rounded-full"></div>
        <div className="bg-orange-50 text-orange-500 text-[9px] font-bold px-3 py-1 rounded-full group-hover:bg-orange-500 group-hover:text-white transition-colors cursor-pointer tracking-wider">COPY</div>
      </div>
    </div>
  );
  if (type === "withdraw") return (
    <div className="w-[85%] h-[80%] bg-white border border-neutral-200 rounded-xl p-3 flex flex-col gap-2 opacity-90 transition-all duration-500 group-hover:scale-105 group-hover:border-orange-500/50 shadow-sm">
      <div className="flex justify-between items-center border-b border-neutral-100 pb-2">
        <div className="flex flex-col gap-1.5 w-1/2">
          <div className="w-full h-1.5 bg-neutral-200 rounded"></div>
          <div className="w-2/3 h-1.5 bg-neutral-200 rounded"></div>
        </div>
        <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-colors duration-300 shadow-sm">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12l5 5L20 7"></path>
          </svg>
        </div>
      </div>
      <div className="flex-1 bg-neutral-50 rounded-lg border border-neutral-200 flex items-center justify-center relative overflow-hidden group-hover:bg-orange-50/50 transition-colors">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,92,0,0.05)_0,transparent_70%)]"></div>
        <div className="flex items-center gap-2 z-10">
          <span className="text-2xl group-hover:-translate-y-1 transition-transform duration-300 drop-shadow-md">💳</span>
          <div className="flex flex-col gap-1 group-hover:translate-x-1 transition-transform duration-300">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff5c00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
  return null;
};

export default function Loops() {
  const steps = [
    { num: "01", title: "Sign Up Free", desc: "Get started with Revadoo in seconds! Register now to start earning real cash.", mockup: "form", btnText: "Create Account" },
    { num: "02", title: "Verify Account", desc: "Secure your account by completing verification, ensuring a safe platform experience with genuine users and trusted rewards.", mockup: "id", btnText: "Verify ID Now" },
    { num: "03", title: "Welcome Reward", desc: "Start your journey with a reward! Claim your bonus and boost your earnings from day one.", mockup: "plans", btnText: "Claim Now" },
    { num: "04", title: "View Ads", desc: "Watch ads at your convenience and start earning. View tailored ads to grow your rewards and enjoy effortless online income.", mockup: "ads", btnText: "Start Earning" },
    { num: "05", title: "Complete Tasks", desc: "Engage with various micro-tasks available on the platform to boost your daily earnings effortlessly.", mockup: "tasks", btnText: "View Tasks" },
    { num: "06", title: "Shortlinks", desc: "Navigate through our sponsored shortlinks. A quick and easy way to add more to your balance.", mockup: "links", btnText: "Visit Links" },
    { num: "07", title: "Play Games", desc: "Have fun while earning! Play exciting browser games and get rewarded for your time and high scores.", mockup: "games", btnText: "Play Now" },
    { num: "08", title: "Referrals Code", desc: "Invite friends using your unique referral code and earn a percentage of their earnings for life.", mockup: "referral", btnText: "Get Code" },
    { num: "09", title: "Withdrawals", desc: "Easily withdraw your hard-earned cash directly to your preferred wallet or bank account quickly and securely.", mockup: "withdraw", btnText: "Cash Out" }
  ];

  return (
    <section className="bg-[#FAFAFA] text-neutral-900 font-barlow py-16 md:py-24 overflow-hidden border-t border-neutral-200">
      
      {/* Added Inline Keyframes for Realistic Flow Motion */}
      <style>{`
        @keyframes dashFlow {
          from { stroke-dashoffset: 24; }
          to { stroke-dashoffset: 0; }
        }
        .animate-dash-flow {
          animation: dashFlow 1.2s linear infinite;
        }
      `}</style>

      <div className="text-center mb-16 md:mb-24 px-6">
        <h2 className="font-anton text-4xl md:text-6xl uppercase leading-none text-neutral-900">
          THE EARNING <span className="text-orange-500">PATH</span>
        </h2>
        <p className="text-neutral-600 mt-3 text-base md:text-lg">Follow these simple steps to maximize your income.</p>
      </div>
      
      {/* Compressed Gaps for Better Responsiveness */}
      <div className="max-w-6xl mx-auto px-6 relative flex flex-col gap-10 md:gap-20 lg:gap-24">
        <div className="md:hidden absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] border-l-2 border-dashed border-orange-500/30 z-0"></div>
        {steps.map((step, i) => {
          const isLeft = i % 2 === 0;
          return (
            <div key={i} className={`relative flex w-full ${isLeft ? 'md:justify-start' : 'md:justify-end'}`}>
              {i < steps.length - 1 && (
                isLeft ? <CurveLeftToRight /> : <CurveRightToLeft />
              )}
              
              {/* Cards are now compressed slightly: changed paddings, margins, sizes */}
              <div className="relative z-10 w-[92%] sm:w-[75%] md:w-[42%] lg:w-[38%] mx-auto md:mx-0 bg-white border border-neutral-200 hover:border-orange-500 rounded-3xl p-4 md:p-5 shadow-[0_4px_24px_rgba(0,0,0,0.04)] group transition-all duration-500 hover:-translate-y-2">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-[#FFF5EE] border border-orange-100 flex items-center justify-center text-lg font-anton text-neutral-600 group-hover:bg-orange-500 group-hover:text-white group-hover:border-orange-500 group-hover:shadow-[0_0_20px_rgba(255,92,0,0.3)] transition-all duration-300">
                    {step.num}
                  </div>
                  <h3 className="font-anton text-xl md:text-2xl uppercase tracking-wide text-neutral-900">
                    {step.title}
                  </h3>
                </div>
                <p className="text-neutral-600 text-sm md:text-sm leading-relaxed mb-3">
                  {step.desc}
                </p>
                <div className="mb-4">
                  <button 
                    onClick={() => {}} 
                    className="px-4 py-2 bg-transparent border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white font-bold uppercase tracking-widest text-xs rounded transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,92,0,0.2)]"
                  >
                    {step.btnText} →
                  </button>
                </div>
                {/* Mockup height compressed slightly (h-28 instead of h-36) */}
                <div className="w-full h-28 bg-[#FAFAFA] rounded-xl border border-neutral-200 flex items-center justify-center overflow-hidden relative group-hover:border-orange-500/50 transition-colors duration-500">
                  <MiniMockup type={step.mockup} />
                  <div className="absolute inset-0 bg-gradient-to-t from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}