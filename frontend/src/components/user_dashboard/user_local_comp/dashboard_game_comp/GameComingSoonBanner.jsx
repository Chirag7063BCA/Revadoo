const GameComingSoonBanner = ({ title, description }) => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-red-200 bg-gradient-to-br from-red-600 via-red-700 to-red-800 p-5 text-white shadow-[0_18px_40px_-28px_rgba(153,27,27,0.85)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.14),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_30%)]" />
      <div className="relative">
        <span className="inline-flex items-center rounded-full border border-white/20 bg-white/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-white/95">
          Coming Soon
        </span>
        <h3 className="mt-3 text-2xl font-black leading-tight text-white sm:text-[2rem]">
          {title}
        </h3>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/80">
          {description}
        </p>
      </div>
    </div>
  );
};

export default GameComingSoonBanner;