import React, { useMemo, useState } from 'react';
import { ArrowRight, Star, Loader, X } from 'lucide-react';
import { useLotteries, useUserTickets, buyLotteryTicket } from '../../../../hooks/useLottery';
import lotteryPoster from '../../../../assets/Lottery/Lottery.png';

const Lotteryticket = ({ onViewTickets }) => {
  const { lotteries, loading } = useLotteries();
  const [reloadKey, setReloadKey] = useState(0);
  const { tickets: userTickets } = useUserTickets([reloadKey]);
  const [localLoading, setLocalLoading] = useState(false);
  const [showBuyForm, setShowBuyForm] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [formError, setFormError] = useState('');

  // Use first published lottery or fallback
  const lotteryData = lotteries[0] || {
    _id: '',
    name: 'Evening Mega Bumper',
    prizePool: 100000,
    entryFee: 50,
    totalTickets: 5000,
    ticketsSold: 4129,
  };

  const boughtTickets = useMemo(() => {
    const currentLotteryTickets = userTickets.filter(
      (ticket) => ticket?.lotteryId?._id === lotteryData._id
    );

    const source = currentLotteryTickets.length ? currentLotteryTickets : userTickets;
    return source.map((ticket) => ticket.ticketNumber).filter(Boolean);
  }, [userTickets, lotteryData._id]);

  const currentLotteryBoughtCount = useMemo(
    () =>
      userTickets.filter((ticket) => ticket?.lotteryId?._id === lotteryData._id)
        .length,
    [userTickets, lotteryData._id]
  );

  const maxAllowedPerUser = 3;
  const remainingAllowed = Math.max(maxAllowedPerUser - currentLotteryBoughtCount, 0);

  const openBuyForm = () => {
    setFormError('');
    setQuantity(remainingAllowed > 0 ? 1 : 0);
    setShowBuyForm(true);
  };

  const handleBuyTicket = async (event) => {
    event?.preventDefault();
    if (!lotteryData._id) return;

    if (remainingAllowed <= 0) {
      setFormError('You already reached the limit of 3 tickets for this draw.');
      return;
    }

    if (quantity < 1 || quantity > remainingAllowed) {
      setFormError(`You can buy between 1 and ${remainingAllowed} ticket(s).`);
      return;
    }

    setLocalLoading(true);
    setFormError('');

    try {
      const purchasedNumbers = [];

      for (let i = 0; i < quantity; i++) {
        const result = await buyLotteryTicket(lotteryData._id);
        if (result.success && result.data?.ticketNumber) {
          purchasedNumbers.push(result.data.ticketNumber);
        }
      }

      if (purchasedNumbers.length > 0) {
        alert(`Ticket purchased successfully! Ticket #${purchasedNumbers.join(', ')}`);
        setReloadKey((prev) => prev + 1);
        setShowBuyForm(false);
        onViewTickets?.();
      }
    } catch (error) {
      setFormError(error.message || 'Failed to buy ticket');
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <section id="home" className="space-y-4">
      <article className="lottery-enter overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_14px_34px_-26px_rgba(0,0,0,0.45)]">
        <div className="relative bg-black p-4 text-white sm:p-6">
          <img
            src={lotteryPoster}
            alt="Lottery promotional ticket"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-black/45" />

          <div className="relative max-w-lg">
            <span className="inline-flex items-center gap-2 rounded-full bg-orange-500/90 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-black sm:text-[11px] sm:tracking-[0.15em]">
              <Star size={12} />
              {loading ? 'Loading...' : 'Live Soon'}
            </span>
            <h3 className="mt-3 text-2xl font-black leading-tight text-white sm:text-[2rem]">
              {lotteryData.name}
            </h3>
            <p className="mt-2 max-w-xl text-sm text-white/80">
              Participate now for your chance to win the daily draw controlled by admin scheduled lottery timings.
            </p>
          </div> 

          <div className="relative mt-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/70 sm:text-[11px] sm:tracking-[0.2em]">
                Total Prize Pool
              </p>
              <p className="text-3xl font-black text-orange-400 sm:text-5xl">
                ₹{lotteryData.prizePool.toLocaleString('en-IN')}
              </p>
            </div>
            <button
              onClick={openBuyForm}
              disabled={localLoading || !lotteryData._id || remainingAllowed <= 0}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-black transition hover:bg-orange-500 hover:text-white disabled:opacity-50 sm:w-auto"
            >
              <>
                {remainingAllowed <= 0 ? 'Limit Reached' : 'Buy Ticket'}
                <ArrowRight size={16} className="transition group-hover:translate-x-1" />
              </>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 border-t border-black/10 bg-gradient-to-r from-orange-50 to-white px-4 py-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/45">Entry Fee</p>
            <p className="mt-1 text-3xl font-black text-black">₹{lotteryData.entryFee}</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/45">Tickets Sold</p>
            <p className="mt-1 text-3xl font-black text-black">
              {lotteryData.ticketsSold.toLocaleString('en-IN')}/{lotteryData.totalTickets.toLocaleString('en-IN')}
            </p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.1em] text-black/50">
              Your limit: {currentLotteryBoughtCount}/{maxAllowedPerUser}
            </p>
          </div>
        </div>
      </article>

      <article className="rounded-2xl border border-black/10 bg-white p-4 shadow-[0_14px_34px_-26px_rgba(0,0,0,0.45)] sm:p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-xl font-black text-black">Your Tickets</h3>
          <span className="font-bold uppercase text-red-600 writing-mode- text-orientation-upright tracking-wide">{boughtTickets.length} Bought</span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {boughtTickets.slice(0, 6).map((ticketNo) => (
            <article
              key={ticketNo}
              className="group relative overflow-hidden rounded-2xl"
            >
              <img
                src={lotteryPoster}
                alt="Lottery ticket"
                className="h-44 w-full object-cover transition-transform duration-300 ease-out group-hover:scale-110 sm:h-48"
              />
              <div className="absolute inset-0 " />
              <div className="absolute inset-0 flex items-center justify-center p-4 text-center text-white">
                <p
                  className="text-[2.7rem] font-black tracking-widest transition-transform duration-300 ease-out group-hover:scale-110"
                  style={{
                    color: '#7a0000',
                    fontFamily: 'Rockwell, \"Roboto Slab\", \"Courier New\", serif',
                    textShadow: '0 2px 0 rgba(0, 0, 0, 0.9), 0 4px 8px rgba(0, 0, 0, 0.65)',
                  }}
                >
                  {ticketNo}
                </p>
              </div>
            </article>
          ))}

          {boughtTickets.length === 0 && (
            <div className="rounded-2xl border border-dashed border-black/20 bg-black/[0.02] p-6 text-center text-sm font-semibold text-black/55 sm:col-span-3">
              No purchased tickets yet. Buy one ticket to start.
            </div>
          )}
        </div>

        {boughtTickets.length > 0 ? (
          <button
            type="button"
            onClick={() => onViewTickets?.()}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-500"
          >
            Check All Tickets
            <ArrowRight size={16} />
          </button>
        ) : (
          <button
            type="button"
            onClick={openBuyForm}
            disabled={!lotteryData._id || remainingAllowed <= 0}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-500 disabled:opacity-50"
          >
            Buy One Ticket
            <ArrowRight size={16} />
          </button>
        )}
      </article>

      {showBuyForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-black text-black">Buy Lottery Ticket</h3>
              <button
                type="button"
                onClick={() => setShowBuyForm(false)}
                className="rounded-lg border border-black/10 p-2 text-black/60 hover:text-black"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleBuyTicket} className="space-y-4">
              <div className="rounded-xl border border-black/10 bg-orange-50/40 p-4 text-sm">
                <p className="font-bold text-black">{lotteryData.name}</p>
                <p className="mt-1 text-black/70">Entry Fee: ₹{lotteryData.entryFee}</p>
                <p className="mt-1 text-black/70">Remaining allowed for your account: {remainingAllowed}</p>
              </div>

              <div>
                <label htmlFor="ticket-quantity" className="mb-2 block text-sm font-bold text-black/70">
                  Number of Tickets (Max {remainingAllowed})
                </label>
                <input
                  id="ticket-quantity"
                  type="number"
                  min="1"
                  max={Math.max(remainingAllowed, 1)}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value || 1))}
                  className="w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm font-semibold focus:border-orange-400 focus:outline-none"
                  disabled={remainingAllowed <= 0}
                />
              </div>

              <div className="rounded-xl border border-black/10 bg-black/[0.02] p-3 text-sm font-semibold text-black/75">
                Total Payable: ₹{Math.max(quantity, 0) * Number(lotteryData.entryFee || 0)}
              </div>

              {formError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-600">
                  {formError}
                </div>
              )}

              <div className="flex flex-wrap gap-3 pt-1">
                <button
                  type="submit"
                  disabled={localLoading || remainingAllowed <= 0}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-500 disabled:opacity-50"
                >
                  {localLoading ? <Loader size={16} className="animate-spin" /> : null}
                  {localLoading ? 'Buying...' : `Confirm Buy (${quantity})`}
                </button>
                <button
                  type="button"
                  onClick={() => setShowBuyForm(false)}
                  className="inline-flex items-center justify-center rounded-xl border border-black/10 px-5 py-3 text-sm font-bold text-black hover:bg-black/[0.03]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Lotteryticket;