import React from 'react';
import { AlertCircle } from 'lucide-react';
import { useLotteryResults } from '../../../../../hooks/useLottery';

const LotteryResult = () => {
  const { results, loading, error } = useLotteryResults();

  if (error) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
        <AlertCircle size={20} className="text-red-600" />
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="rounded-lg bg-white p-8 text-center">
        <p className="text-black/60">Loading results...</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="rounded-lg bg-white p-8 text-center">
        <p className="text-black/60">No lottery results available yet.</p>
      </div>
    );
  }

  return (
    <section id="results" className="rounded-2xl border border-black/10 bg-white p-4 shadow-[0_12px_24px_-20px_rgba(0,0,0,0.45)] sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h3 className="text-xl font-black text-black">Latest Results</h3>
        <button className="text-sm font-bold text-orange-600 transition hover:text-orange-700">View All</button>
      </div>

      <div className="overflow-hidden rounded-xl border border-black/10">
        <div className="grid grid-cols-5 gap-2 bg-black px-4 py-3 text-[11px] font-bold uppercase tracking-[0.13em] text-white/75">
          <p>Date</p>
          <p>Draw Name</p>
          <p>Winning Number</p>
          <p>Your Number</p>
          <p>Prize Pool</p>
        </div>

        {results.map((result) => (
          <div
            key={result._id}
            className="grid grid-cols-5 gap-2 border-t border-black/10 px-4 py-3 text-sm text-black/80"
          >
            <p className="font-semibold">
              {new Date(result.drawEndAt || result.drawDateTime || result.createdAt).toLocaleDateString('en-IN', {
                month: 'short',
                day: 'numeric',
                year: '2-digit',
              })}
            </p>
            <p className="font-semibold">{result.name}</p>
            <p>
              <span className="rounded-md bg-gray-100 px-2 py-1 font-black tracking-wider text-black">
                {result.winningNumber || '—'}
              </span>
            </p>
            <p className="font-mono font-bold">
              {result.yourNumber || '—'}
            </p>
            <p className="font-black">₹{result.prizePool.toLocaleString('en-IN')}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LotteryResult;