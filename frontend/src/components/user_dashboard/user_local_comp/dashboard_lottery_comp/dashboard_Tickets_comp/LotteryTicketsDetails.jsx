import React from 'react';
import { ChevronRight, Clock3, Trophy } from 'lucide-react';

const LotteryTicketsDetails = ({ ticket, isActive = false, onSelect }) => {
  const statusClassName = ticket.announced
    ? 'border-orange-200 bg-orange-50 text-orange-700'
    : 'border-gray-200 bg-gray-50 text-gray-700';

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-2xl border px-4 py-4 text-left shadow-[0_10px_24px_-22px_rgba(0,0,0,0.35)] transition hover:-translate-y-0.5 hover:border-orange-200 hover:bg-orange-50/40 ${
        isActive ? 'border-orange-300 bg-orange-50 ring-2 ring-orange-100' : 'border-black/10 bg-white'
      }`}
    >
      <div className="grid grid-cols-1 gap-3 md:grid-cols-12 md:items-center md:gap-4">
        <div className="md:col-span-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-black/45 md:hidden">Lottery Name</p>
          <p className="text-base font-black text-black">{ticket.lotteryName}</p>
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-black/40">{ticket.ticketId}</p>
        </div>

        <div className="md:col-span-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-black/45 md:hidden">Your Number</p>
          <p className="font-mono text-sm font-bold tracking-[0.24em] text-black/80">{ticket.ticketNumber}</p>
        </div>

        <div className="md:col-span-2 md:text-right">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-black/45 md:hidden">Total Prize Pool</p>
          <p className="text-lg font-black text-black">{ticket.totalPrizePool}</p>
        </div>

        <div className="md:col-span-3 md:flex md:justify-end">
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] ${statusClassName}`}>
            {ticket.announced ? <Trophy size={12} /> : <Clock3 size={12} />}
            {ticket.announced ? 'Check Result' : 'Check Status'}
          </span>
          <ChevronRight className="ml-0 self-center text-black/25" size={18} />
        </div>
      </div>
    </button>
  );
};

export default LotteryTicketsDetails;