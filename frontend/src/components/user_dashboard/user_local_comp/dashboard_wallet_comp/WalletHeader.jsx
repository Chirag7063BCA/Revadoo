const WalletHeader = () => {
  return (
    <div className="mb-6 sm:mb-8 font-['DM_Sans',sans-serif]">
      <p className="text-xs font-semibold text-orange-500 tracking-widest uppercase mb-1">
        Dashboard
      </p>
      <h1 className="text-2xl sm:text-3xl font-bold text-black tracking-tight mb-1">
        My Wallet
      </h1>
      <p className="text-sm text-gray-400 font-normal">
        Manage your earnings and withdrawals
      </p>
    </div>
  );
};

export default WalletHeader;