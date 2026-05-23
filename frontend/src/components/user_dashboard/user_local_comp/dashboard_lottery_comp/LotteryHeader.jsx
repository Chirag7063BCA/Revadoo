import React, { useEffect, useMemo, useState } from 'react';
import { Clock3 } from 'lucide-react';

const LotteryHeader = ({ activeTab = 'home', onTabSelect }) => {
  const nextDrawAt = useMemo(() => {
    const now = new Date();
    const draw = new Date(now);
    draw.setMinutes(now.getMinutes() + 4);
    draw.setSeconds(now.getSeconds() + 35);
    return draw;
  }, []);

  const [timeLeft, setTimeLeft] = useState({ hours: '00', minutes: '00', seconds: '00' });

  useEffect(() => {
    const tick = () => {
      const now = new Date().getTime();
      const gap = Math.max(0, nextDrawAt.getTime() - now);
      const hours = String(Math.floor((gap / (1000 * 60 * 60)) % 24)).padStart(2, '0');
      const minutes = String(Math.floor((gap / (1000 * 60)) % 60)).padStart(2, '0');
      const seconds = String(Math.floor((gap / 1000) % 60)).padStart(2, '0');
      setTimeLeft({ hours, minutes, seconds });
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [nextDrawAt]);

  const tabs = [
    { id: 'home', label: 'Home' },
    { id: 'tickets', label: 'My Tickets' },
    { id: 'results', label: 'Results' },
  ];

  return (
    <header className="overflow-hidden rounded-3xl border border-black/10 bg-[#f7f7f7] shadow-[0_12px_28px_-24px_rgba(0,0,0,0.5)]">
      <div className="px-4 pt-4 sm:px-5 sm:pt-5">
        <nav className="scrollbar-hide flex items-center gap-2 overflow-x-auto rounded-xl bg-transparent">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabSelect?.(tab.id)}
              className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold transition ${
                activeTab === tab.id
                  ? 'bg-orange-500 text-white shadow-[0_8px_20px_-12px_rgba(249,115,22,0.9)]'
                  : 'border border-black/10 bg-white text-black/75 hover:border-orange-200 hover:text-orange-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-3 border-t border-black/10 px-4 py-5 sm:px-5 sm:py-6">
        <div className="rounded-2xl border border-black/10 bg-white p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-black/60">
            <Clock3 size={14} className="text-orange-500" />
            Next Lottery Starts In
          </div>

          <div className="flex items-center justify-center gap-3">
            {[timeLeft.hours, timeLeft.minutes, timeLeft.seconds].map((item, idx) => (
              <React.Fragment key={`${item}-${idx}`}>
                <div className="min-w-16 rounded-xl border border-orange-100 bg-[#fffaf5] px-3 py-2.5 text-center">
                  <p className="text-[2rem] font-black leading-none text-black/75">{item}</p>
                  <p className="mt-1 text-[10px] font-black tracking-[0.18em] text-orange-400">{idx === 0 ? 'HRS' : idx === 1 ? 'MIN' : 'SEC'}</p>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default LotteryHeader;
