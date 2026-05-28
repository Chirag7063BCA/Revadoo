import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock3 } from 'lucide-react';

const getCountdownState = (nextDrawAt) => {
  if (!nextDrawAt) {
    return { label: 'No upcoming draws', parts: null };
  }

  const timestamp = new Date(nextDrawAt).getTime();
  if (!Number.isFinite(timestamp)) {
    return { label: 'No upcoming draws', parts: null };
  }

  const gap = timestamp - Date.now();
  if (gap <= 0) {
    return { label: 'Draw Ended', parts: null };
  }

  const totalSeconds = Math.floor(gap / 1000);
  const hours = String(Math.floor((totalSeconds / 3600) % 24)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds / 60) % 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');

  return {
    label: null,
    parts: [
      { label: 'HRS', value: hours },
      { label: 'MIN', value: minutes },
      { label: 'SEC', value: seconds },
    ],
  };
};

const LotteryHeader = ({ activeTab = 'home', onTabSelect, nextDrawAt = null, lotteryName = null }) => {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setTick((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const countdown = useMemo(() => getCountdownState(nextDrawAt), [nextDrawAt, tick]);

  const tabs = [
    { id: 'home', label: 'Home' },
    { id: 'tickets', label: 'My Tickets' },
    { id: 'results', label: 'Results' },
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-[0_18px_40px_-28px_rgba(0,0,0,0.55)]"
    >
      <div className="border-b border-black/10 px-4 py-4 sm:px-5">
        <div className="flex items-center gap-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabSelect?.(tab.id)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-black transition ${
                activeTab === tab.id
                  ? 'bg-orange-500 text-white shadow-[0_10px_24px_-16px_rgba(255,107,0,0.9)]'
                  : 'border border-black/10 bg-white text-black/70 hover:border-orange-200 hover:text-orange-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-white via-white to-orange-50/60 px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-3xl rounded-3xl border border-black/10 bg-black p-5 text-white shadow-[0_18px_50px_-28px_rgba(0,0,0,0.7)] sm:p-6">
          <div className="mb-3 flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-[0.22em] text-white/70">
            <Clock3 size={14} className="text-orange-400" />
            {countdown.label || 'Next Lottery Starts In'}
          </div>

          {countdown.parts ? (
            <div className="flex flex-wrap items-center justify-center gap-3">
              {countdown.parts.map((part) => (
                <div key={part.label} className="min-w-20 rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-center backdrop-blur-sm">
                  <p className="font-mono text-3xl font-black tracking-[0.18em] text-white">{part.value}</p>
                  <p className="mt-1 text-[10px] font-black uppercase tracking-[0.2em] text-orange-300">{part.label}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-4 text-center">
              <p className="text-2xl font-black text-white">{countdown.label}</p>
            </div>
          )}

          <div className="mt-4 text-center">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-white/55">Upcoming Draw</p>
            <p className="mt-2 text-lg font-black text-orange-400 sm:text-xl">{lotteryName || 'No upcoming draws'}</p>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default LotteryHeader;
