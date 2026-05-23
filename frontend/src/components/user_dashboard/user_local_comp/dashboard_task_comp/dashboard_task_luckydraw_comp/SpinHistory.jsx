const timeAgo = (date) => {
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  return `${Math.floor(hours / 24)}d ago`;
};

const ROW_STYLE = {
  credits: { icon: "CR", bg: "bg-orange-50", text: "text-orange-600" },
  cash: { icon: "INR", bg: "bg-green-50", text: "text-green-700" },
  none: { icon: "NA", bg: "bg-gray-50", text: "text-gray-400" },
};

export default function SpinHistory({ history }) {
  if (!history.length) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm">
        <p className="text-sm text-gray-400">No spins yet — spin the wheel to start earning!</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-5 py-4">
        <h3 className="font-bold text-gray-800">Spin History</h3>
        <p className="mt-0.5 text-xs text-gray-400">Last 20 spins</p>
      </div>
      <div className="max-h-72 divide-y divide-gray-50 overflow-y-auto">
        {history.map((entry) => {
          const style = ROW_STYLE[entry.rewardType] || ROW_STYLE.none;
          return (
            <div key={entry._id} className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-gray-50">
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[10px] font-bold tracking-wide ${style.bg}`}>
                {style.icon}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-gray-800">{entry.rewardLabel}</p>
                <p className="text-xs text-gray-400">
                  {entry.spinType === "free" ? "Free spin" : "Paid spin"} · {timeAgo(entry.createdAt)}
                </p>
              </div>
              {entry.rewardType !== "none" && (
                <p className={`shrink-0 text-sm font-black ${style.text}`}>
                  {entry.rewardType === "credits" ? `+${entry.rewardValue} TKN` : `₹${entry.rewardValue}`}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}