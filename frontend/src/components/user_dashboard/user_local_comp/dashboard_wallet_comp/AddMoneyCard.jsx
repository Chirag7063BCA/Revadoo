// AddMoneyCard.jsx
const AddMoneyCard = () => {
  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-gray-100 bg-gradient-to-br from-gray-50 via-white to-gray-50 p-5 font-['DM_Sans',sans-serif] shadow-sm sm:p-6">
      <div className="pointer-events-none absolute -left-10 -top-10 h-28 w-28 rounded-full bg-orange-100/50" />
      <div className="relative flex h-full min-h-[240px] flex-col justify-between gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-500">Add Funds</p>
          <h3 className="mt-2 text-2xl font-bold text-gray-900">Coming soon</h3>
          <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
            Card top-up will be available here in the next release. For now this section stays visible so the wallet layout remains balanced.
          </p>
        </div>

        <div className="rounded-2xl border border-dashed border-orange-200 bg-orange-50/60 p-4 text-sm text-orange-700">
          Stripe add-funds gateway is coming soon.
        </div>

        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-gray-400">Top-up gateway preview</p>
          <button
            type="button"
            disabled
            className="cursor-not-allowed rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-400"
          >
            Coming Soon
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMoneyCard;