import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { useLotteryResults, useUserTickets } from '../../../../../hooks/useLottery';

const LotteryResult = () => {
  const { results, loading, error } = useLotteryResults();
  const { tickets: userTickets } = useUserTickets([results.length]);

  const rows = useMemo(
    () =>
      results.map((result) => {
        const matchingTickets = userTickets.filter((ticket) => ticket?.lotteryId?._id === result._id);
        const yourNumbers = matchingTickets.map((ticket) => ticket.ticketNumber).filter(Boolean);
        const isWinner = matchingTickets.some((ticket) => ticket.isWinner);

        return {
          _id: result._id,
          date: new Date(result.drawEndAt || result.createdAt || Date.now()).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }),
          name: result.name,
          prizePool: Number(result.prizePool || 0),
          winningNumber: result.winningNumber || '—',
          yourNumber: yourNumbers.length ? yourNumbers.join(', ') : '—',
          result: isWinner ? 'Won' : 'No Match',
        };
      }),
    [results, userTickets]
  );

  if (error) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
        <AlertCircle size={20} className="text-red-600" />
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-3 rounded-3xl border border-black/10 bg-white p-4 shadow-[0_14px_34px_-26px_rgba(0,0,0,0.45)] sm:p-5">
        <div className="h-8 w-56 animate-pulse rounded-xl bg-gray-100" />
        <div className="h-12 animate-pulse rounded-2xl bg-gray-100" />
        <div className="h-12 animate-pulse rounded-2xl bg-gray-100" />
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="rounded-3xl border border-black/10 bg-white p-8 text-center shadow-[0_14px_34px_-26px_rgba(0,0,0,0.45)]">
        <p className="text-black/60">No lottery results available yet.</p>
      </div>
    );
  }

  return (
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-black/10 bg-white p-4 shadow-[0_12px_24px_-20px_rgba(0,0,0,0.45)] sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-black/45">Results</p>
          <h3 className="mt-2 text-xl font-black text-black">Latest Announced Draws</h3>
        </div>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-black/10">
        <div className="min-w-[880px] grid grid-cols-6 gap-3 bg-black px-4 py-3 text-[11px] font-black uppercase tracking-[0.13em] text-white/75">
          <p>Date</p>
          <p>Draw Name</p>
          <p>Prize Pool</p>
          <p>Winning Number</p>
          <p>Your Number</p>
          <p>Result</p>
        </div>

        {rows.map((result) => (
          <div key={result._id} className="min-w-[880px] grid grid-cols-6 gap-3 border-t border-black/10 px-4 py-4 text-sm text-black/80">
            <p className="font-semibold">{result.date}</p>
            <p className="font-semibold text-black">{result.name}</p>
            <p className="font-black">₹{result.prizePool.toLocaleString('en-IN')}</p>
            <p>
              <span className="inline-flex rounded-full bg-orange-100 px-3 py-1 font-mono text-xs font-black tracking-[0.24em] text-orange-700">
                {result.winningNumber}
              </span>
            </p>
            <p className="font-mono font-bold tracking-[0.18em]">{result.yourNumber}</p>
            <p>
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.16em] ${result.result === 'Won' ? 'bg-orange-500 text-black' : 'bg-gray-100 text-gray-700'}`}>
                {result.result}
              </span>
            </p>
          </div>
        ))}
      </div>
    </motion.section>
  );
};

export default LotteryResult;