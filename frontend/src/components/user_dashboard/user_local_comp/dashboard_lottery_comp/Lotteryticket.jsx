import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Clock3, Loader2, Ticket, X } from 'lucide-react';
import { buyLotteryTicket, useLotteries, useUserTickets } from '../../../../hooks/useLottery';
import lotteryPoster from '../../../../assets/Lottery/Lottery.png';

const getToken = () => localStorage.getItem('token') || localStorage.getItem('authToken') || '';

const formatRemaining = (drawEndAt) => {
  if (!drawEndAt) return 'No upcoming draws';
  const timestamp = new Date(drawEndAt).getTime();
  if (!Number.isFinite(timestamp)) return 'No upcoming draws';

  const gap = timestamp - Date.now();
  if (gap <= 0) return 'Result pending';

  const totalSeconds = Math.floor(gap / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${String(days).padStart(2, '0')}d ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m`;
};

const Lotteryticket = ({ lotteryData = null, loading = false, onViewTickets }) => {
  const navigate = useNavigate();
  const { lotteries } = useLotteries();
  const [reloadKey, setReloadKey] = useState(0);
  const { tickets: userTickets } = useUserTickets([reloadKey]);
  const [buying, setBuying] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [toast, setToast] = useState(null);

  const currentLottery = lotteryData || lotteries[0] || null;
  const hasToken = Boolean(getToken());

  const lotteryTickets = useMemo(
    () => userTickets.filter((ticket) => ticket?.lotteryId?._id === currentLottery?._id),
    [userTickets, currentLottery?._id]
  );

  const boughtCount = lotteryTickets.length;
  const maxAllowed = Number(currentLottery?.maxTicketsPerUser || 3);
  const remainingAllowed = Math.max(maxAllowed - boughtCount, 0);

  const ticketCards = useMemo(
    () =>
      lotteryTickets.map((ticket) => ({
        id: ticket._id,
        number: ticket.ticketNumber,
        announced: ticket.lotteryId?.status === 'announced' || ticket.lotteryId?.status === 'completed',
        winningNumber: ticket.lotteryId?.winningNumber,
        isWinner: Boolean(ticket.isWinner),
      })),
    [lotteryTickets]
  );

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(null), 3000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const showToast = (message, type = 'success') => setToast({ message, type });

  const handleOpenBuyModal = () => {
    if (!hasToken) {
      navigate('/authpage');
      return;
    }

    setShowBuyModal(true);
  };

  const handleBuy = async () => {
    if (!currentLottery?._id) {
      showToast('No live lottery is available right now.', 'error');
      return;
    }

    if (!hasToken) {
      navigate('/authpage');
      return;
    }

    if (remainingAllowed <= 0) {
      showToast(`You can only buy ${maxAllowed} tickets per lottery`, 'error');
      return;
    }

    setBuying(true);
    try {
      const response = await buyLotteryTicket(currentLottery._id);
      const ticketNumber = response?.data?.ticket?.ticketNumber || response?.ticket?.ticketNumber || '—';
      showToast(`Ticket purchased successfully: #${ticketNumber}`);
      setShowBuyModal(false);
      setReloadKey((value) => value + 1);
      onViewTickets?.();
    } catch (error) {
      showToast(error.message || 'Failed to buy ticket', 'error');
    } finally {
      setBuying(false);
    }
  };

  if (loading && !currentLottery) {
    return (
      <div className="animate-pulse rounded-3xl border border-black/10 bg-white p-5">
        <div className="h-64 rounded-2xl bg-gray-100" />
        <div className="mt-4 h-24 rounded-2xl bg-gray-100" />
      </div>
    );
  }

  if (!currentLottery) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-black/10 bg-white p-6 text-center shadow-[0_16px_40px_-30px_rgba(0,0,0,0.45)]">
        <p className="text-lg font-black text-black">No live lottery is available right now.</p>
        <p className="mt-2 text-sm text-black/55">Check back when the admin publishes the next draw.</p>
      </motion.div>
    );
  }

  return (
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <article className="overflow-hidden rounded-3xl border border-black/10 bg-black text-white shadow-[0_22px_50px_-32px_rgba(0,0,0,0.85)]">
        <div className="relative min-h-[280px] overflow-hidden p-5 sm:p-6">
          <img src={lotteryPoster} alt="Lottery promotional ticket" className="absolute inset-0 h-full w-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-br from-black/45 via-black/65 to-black/95" />

          <div className="relative flex min-h-[280px] flex-col justify-between gap-6">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-black">
                <Ticket size={12} />
                Live Lottery
              </span>
              <h3 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-5xl">{currentLottery.name}</h3>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/75 sm:text-base">
                Participate now for the current draw. Purchases are limited per user and enforced on the backend.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-white/55">Prize Pool</p>
                <p className="mt-2 text-3xl font-black text-orange-400">₹{Number(currentLottery.prizePool || 0).toLocaleString('en-IN')}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-white/55">Entry Fee</p>
                <p className="mt-2 text-3xl font-black text-white">₹{Number(currentLottery.entryFee || 0).toLocaleString('en-IN')}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-white/55">Tickets Sold</p>
                <p className="mt-2 text-3xl font-black text-white">
                  {Number(currentLottery.ticketsSold || 0).toLocaleString('en-IN')}/{Number(currentLottery.totalTickets || 0).toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 border-t border-white/10 bg-white px-5 py-5 text-black sm:grid-cols-2 sm:px-6">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-black/45">Your Limit</p>
            <p className="mt-1 text-2xl font-black">{boughtCount}/{maxAllowed}</p>
            <p className="mt-1 text-sm text-black/55">Remaining allowed: {remainingAllowed}</p>
          </div>
          <div className="flex items-end justify-start sm:justify-end">
            <button
              type="button"
              onClick={handleOpenBuyModal}
              disabled={!currentLottery._id || remainingAllowed <= 0 || buying}
              className="inline-flex items-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-black text-white transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {!hasToken ? 'Login to Buy' : remainingAllowed <= 0 ? 'Limit Reached' : 'Buy Ticket'}
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </article>

      <article className="rounded-3xl border border-black/10 bg-white p-4 shadow-[0_18px_40px_-30px_rgba(0,0,0,0.45)] sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-orange-700">
              <Clock3 size={12} />
              Bought Tickets
            </p>
            <h4 className="mt-3 text-2xl font-black text-black">Your Tickets</h4>
          </div>
          <button type="button" onClick={() => onViewTickets?.()} className="text-sm font-black text-orange-600 hover:text-orange-700">
            View All
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ticketCards.map((ticket) => (
            <motion.div
              key={ticket.id}
              whileHover={{ scale: 1.02 }}
              className="relative overflow-hidden rounded-3xl border border-black/10 bg-[#0a0a0a] p-4 text-white shadow-[0_18px_40px_-24px_rgba(0,0,0,0.85)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-orange-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative flex h-full flex-col justify-between gap-4">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/55">Lottery Name</p>
                  <p className="mt-2 text-lg font-black text-white">{currentLottery.name}</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5 text-center backdrop-blur-sm">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-orange-300">Ticket Number</p>
                  <p className="mt-2 font-serif text-[2.4rem] font-black tracking-[0.3em] text-orange-400 drop-shadow-[0_0_18px_rgba(255,107,0,0.35)]">{ticket.number}</p>
                </div>

                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-white/75">
                    {ticket.announced ? `Result: #${ticket.winningNumber || '------'}` : formatRemaining(currentLottery.drawEndAt)}
                  </span>
                  {ticket.isWinner && <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-black">Winner</span>}
                </div>
              </div>
            </motion.div>
          ))}

          {!ticketCards.length && (
            <div className="rounded-3xl border border-dashed border-black/15 bg-black/2 p-6 text-center text-sm font-semibold text-black/55 sm:col-span-2 lg:col-span-3">
              You have not purchased a ticket in this lottery yet.
            </div>
          )}
        </div>
      </article>

      {showBuyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-black text-black">Buy Lottery Ticket</h3>
                <p className="mt-1 text-sm text-black/60">Confirm one ticket purchase for {currentLottery.name}.</p>
              </div>
              <button type="button" onClick={() => setShowBuyModal(false)} className="rounded-full border border-black/10 p-2 text-black/60 hover:text-black">
                <X size={16} />
              </button>
            </div>

            <div className="mt-5 rounded-2xl border border-black/10 bg-orange-50/50 p-4 text-sm text-black/70">
              Entry fee: <span className="font-black text-black">₹{Number(currentLottery.entryFee || 0).toLocaleString('en-IN')}</span>
              <br />
              Remaining allowed after this purchase: <span className="font-black text-black">{Math.max(remainingAllowed - 1, 0)}</span>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={handleBuy}
                disabled={buying}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-black px-4 py-3 font-black text-white transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {buying ? <Loader2 size={16} className="animate-spin" /> : null}
                {buying ? 'Buying...' : 'Confirm Purchase'}
              </button>
              <button type="button" onClick={() => setShowBuyModal(false)} disabled={buying} className="rounded-2xl border border-black/10 px-4 py-3 font-black text-black hover:bg-black/5 disabled:opacity-50">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`fixed bottom-5 right-5 z-[60] max-w-sm rounded-2xl px-4 py-3 text-sm font-black text-white shadow-2xl ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.message}
        </div>
      )}
    </motion.section>
  );
};

export default Lotteryticket;