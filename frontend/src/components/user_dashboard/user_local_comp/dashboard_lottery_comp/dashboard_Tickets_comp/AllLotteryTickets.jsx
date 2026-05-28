import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Clock3, Ticket, Trophy } from 'lucide-react';
import { useUserTickets } from '../../../../../hooks/useLottery';
import LotteryTicketsDetails from './LotteryTicketsDetails';

const formatCountdown = (ms) => {
  const safeMs = Math.max(ms, 0);
  const totalSeconds = Math.floor(safeMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds };
};

const AllLotteryTickets = () => {
  const { tickets: fetchedTickets, loading, error } = useUserTickets();
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timerId = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timerId);
  }, []);

  const ticketRows = useMemo(
    () =>
      fetchedTickets.map((ticket) => ({
        ticketId: ticket._id || `#${ticket.ticketNumber}`,
        lotteryName: ticket.lotteryId?.name || 'Unknown Lottery',
        ticketNumber: ticket.ticketNumber,
        totalPrizePool: ticket.lotteryId?.prizePool ? `₹${ticket.lotteryId.prizePool.toLocaleString('en-IN')}` : '₹0',
        winningAmount: ticket.isWinner ? `₹${ticket.prizeAmount}` : '₹0',
        status: ticket.status,
        drawAt: ticket.lotteryId?.drawEndAt || new Date().toISOString(),
        purchaseDate: ticket.purchasedAt
          ? new Date(ticket.purchasedAt).toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })
          : '—',
        announced: ticket.lotteryId?.status === 'announced',
        winningNumber: ticket.lotteryId?.winningNumber,
        isWinner: Boolean(ticket.isWinner),
        prizeAmount: ticket.prizeAmount,
        _id: ticket._id,
      })),
    [fetchedTickets]
  );

  const selectedTicket = useMemo(
    () =>
      ticketRows.find((ticket) => ticket._id === selectedTicketId) ||
      ticketRows[0] || {
        ticketId: '#N/A',
        lotteryName: 'No Tickets',
        ticketNumber: '—',
        totalPrizePool: '₹0',
        winningAmount: '₹0',
        status: 'none',
        drawAt: new Date().toISOString(),
        purchaseDate: '—',
        announced: false,
        winningNumber: null,
        isWinner: false,
        prizeAmount: 0,
      },
    [selectedTicketId, ticketRows]
  );

  const countdown = useMemo(() => {
    if (selectedTicket.announced) {
      return null;
    }

    return formatCountdown(new Date(selectedTicket.drawAt).getTime() - now);
  }, [now, selectedTicket]);

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
      <div className="rounded-3xl border border-black/10 bg-white p-8 text-center shadow-[0_14px_34px_-26px_rgba(0,0,0,0.45)]">
        <p className="text-black/60">Loading your tickets...</p>
      </div>
    );
  }

  if (ticketRows.length === 0) {
    return (
      <div className="rounded-3xl border border-black/10 bg-white p-8 text-center shadow-[0_14px_34px_-26px_rgba(0,0,0,0.45)]">
        <p className="text-black/60">You haven't purchased any lottery tickets yet.</p>
      </div>
    );
  }

  return (
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-black/10 bg-white p-4 shadow-[0_18px_40px_-30px_rgba(0,0,0,0.45)] sm:p-5">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-orange-700">
            <Ticket size={12} />
            My Lottery Tickets
          </p>
          <h3 className="mt-3 text-2xl font-black tracking-tight text-black sm:text-3xl">All Bought Tickets</h3>
        </div>

        <span className="rounded-full bg-black px-3 py-1.5 text-xs font-black text-white">{ticketRows.length} Tickets</span>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-3 overflow-x-auto">
          <div className="hidden min-w-[720px] grid-cols-12 gap-3 rounded-2xl bg-black px-4 py-3 text-[11px] font-black uppercase tracking-[0.16em] text-white/70 md:grid">
            <div className="col-span-4">Lottery Name</div>
            <div className="col-span-3">Your Number</div>
            <div className="col-span-2 text-right">Total Prize Pool</div>
            <div className="col-span-3 text-right">Status</div>
          </div>

          {ticketRows.map((ticket) => (
            <LotteryTicketsDetails
              key={ticket._id || ticket.ticketNumber}
              ticket={ticket}
              isActive={selectedTicket._id === ticket._id}
              onSelect={() => setSelectedTicketId(ticket._id)}
            />
          ))}
        </div>

        <aside className="order-last xl:order-none xl:sticky xl:top-4">
          <div className="overflow-hidden rounded-3xl border border-black/10 bg-black text-white shadow-[0_18px_40px_-30px_rgba(0,0,0,0.55)]">
            <div className="relative min-h-[240px] overflow-hidden sm:min-h-[280px]">
              <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-orange-950" />

              <div className="relative flex min-h-[240px] flex-col justify-between p-5 sm:min-h-[280px] sm:p-6">
                <div>
                  <p className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-black">
                    <Trophy size={12} />
                    {selectedTicket.isWinner ? 'Winner Ticket' : 'Selected Ticket'}
                  </p>
                  <h4 className="mt-3 text-2xl font-black leading-tight sm:text-[2rem]">{selectedTicket.lotteryName}</h4>
                  <p className="mt-1 text-sm text-white/75">Ticket {selectedTicket.ticketId}</p>
                </div>

                {selectedTicket.isWinner ? (
                  <div className="rounded-3xl border border-orange-400/40 bg-orange-500/15 p-4 text-center">
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-orange-200">🏆 You Won!</p>
                    <p className="mt-2 text-3xl font-black text-orange-400">₹{Number(selectedTicket.prizeAmount || 0).toLocaleString('en-IN')}</p>
                  </div>
                ) : (
                  <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                    <p className="text-center text-[11px] font-black uppercase tracking-[0.18em] text-white/65">Lottery not announced yet</p>
                    <div className="mt-3 grid grid-cols-4 gap-2">
                      {[
                        { value: String(countdown?.days ?? 0).padStart(2, '0'), label: 'Days' },
                        { value: String(countdown?.hours ?? 0).padStart(2, '0'), label: 'Hours' },
                        { value: String(countdown?.minutes ?? 0).padStart(2, '0'), label: 'Mins' },
                        { value: String(countdown?.seconds ?? 0).padStart(2, '0'), label: 'Secs' },
                      ].map((part) => (
                        <div key={part.label} className="rounded-2xl border border-white/10 bg-black/30 px-2 py-3 text-center">
                          <p className="text-2xl font-black tracking-[0.12em] text-white">{part.value}</p>
                          <p className="mt-1 text-[10px] font-black uppercase tracking-[0.16em] text-white/55">{part.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white p-5 text-black sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-black/45">Ticket Summary</p>
                  <p className="mt-1 text-lg font-black">Read-only form preview</p>
                </div>
                <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.14em] ${selectedTicket.announced ? 'border-orange-200 bg-orange-100 text-orange-700' : 'border-gray-200 bg-gray-100 text-gray-700'}`}>
                  {selectedTicket.announced ? 'Result' : 'Pending'}
                </span>
              </div>

              {selectedTicket.isWinner && (
                <div className="mt-4 rounded-3xl border border-orange-200 bg-orange-50 p-4 text-center">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-orange-700">🏆 You Won! ₹{Number(selectedTicket.prizeAmount || 0).toLocaleString('en-IN')}</p>
                </div>
              )}

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <DetailField label="Lottery Name" value={selectedTicket.lotteryName} />
                <DetailField label="Ticket ID" value={selectedTicket.ticketId} />
                <DetailField label="Your Number" value={selectedTicket.ticketNumber} mono />
                <DetailField label="Total Prize Pool" value={selectedTicket.totalPrizePool} />
                <DetailField label="Winning Amount" value={selectedTicket.winningAmount} />
                <DetailField label="Purchased On" value={selectedTicket.purchaseDate} />
                <DetailField label="Draw Status" value={selectedTicket.announced ? 'Result announced' : 'Waiting for announcement'} />
              </div>

              <div className="mt-4 rounded-3xl border border-black/10 bg-white p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-black/45">What happens next</p>
                <p className="mt-2 text-sm leading-6 text-black/70">
                  {selectedTicket.announced
                    ? `The winning number is live. Match your ticket number with ${selectedTicket.winningNumber || 'the published result'} to review the payout.`
                    : 'The draw is still pending. The countdown will keep updating until the lottery is announced.'}
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </motion.section>
  );
};

const DetailField = ({ label, value, mono = false }) => (
  <div className="rounded-2xl border border-black/10 bg-white px-4 py-3 shadow-[0_10px_22px_-22px_rgba(0,0,0,0.2)]">
    <p className="text-[11px] font-black uppercase tracking-[0.16em] text-black/45">{label}</p>
    <p className={`mt-1 text-sm font-semibold text-black ${mono ? 'font-mono tracking-[0.16em]' : ''}`}>{value}</p>
  </div>
);

export default AllLotteryTickets;