import { useEffect, useRef } from "react";

const ICON_LABELS = { credits: "CR", cash: "INR", none: "NA" };

export default function SpinResultModal({ result, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!result) return undefined;

    ref.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [result, onClose]);

  if (!result) return null;

  const isWin = result.rewardType !== "none";
  const isJackpot = result.rewardValue >= 1000;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)" }}
      onClick={(event) => event.target === event.currentTarget && onClose()}
    >
      <div
        ref={ref}
        tabIndex={-1}
        className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl outline-none"
        style={{ animation: "modalIn 0.3s cubic-bezier(.34,1.56,.64,1)" }}
      >
        <style>{`
          @keyframes modalIn { from { opacity:0; transform:scale(0.88) translateY(16px) } to { opacity:1; transform:scale(1) translateY(0) } }
          @keyframes glow { 0%,100% { box-shadow:0 0 24px rgba(255,107,0,0.3) } 50% { box-shadow:0 0 48px rgba(255,107,0,0.6) } }
          @keyframes confetti { 0% { transform:translateY(-10px) rotate(0deg); opacity:1 } 100% { transform:translateY(120px) rotate(720deg); opacity:0 } }
        `}</style>

        <div className={`px-6 pb-6 pt-8 text-center ${isWin ? "bg-gradient-to-b from-orange-50 to-white" : "bg-gray-50"}`}>
          {isJackpot && (
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              {["#FF6B00", "#fbbf24", "#22c55e", "#3b82f6", "#ec4899"].map((color, index) => (
                <div
                  key={color}
                  className="absolute rounded-full"
                  style={{
                    width: 8,
                    height: 8,
                    background: color,
                    left: `${15 + index * 16}%`,
                    top: 0,
                    animation: `confetti ${1 + index * 0.2}s ease-out ${index * 0.1}s forwards`,
                  }}
                />
              ))}
            </div>
          )}

          <div
            className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full text-xl font-black tracking-wide"
            style={isWin ? { background: "#fff7ed", animation: "glow 2s ease-in-out infinite", color: "#f97316" } : { background: "#f1f5f9", color: "#64748b" }}
          >
            {isJackpot ? "JP" : ICON_LABELS[result.rewardType]}
          </div>

          <h2 className={`mb-1 text-2xl font-black ${isWin ? "text-gray-900" : "text-gray-500"}`}>
            {isJackpot ? "JACKPOT" : isWin ? "You won" : "Better luck next time"}
          </h2>

          {isWin && (
            <p className="mt-2 text-4xl font-black text-orange-500">
              {result.rewardType === "credits" ? `+${result.rewardValue} Credits` : `₹${result.rewardValue}`}
            </p>
          )}

          <p className="mt-2 text-sm text-gray-400">{result.rewardLabel}</p>
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
          <span className="text-sm text-gray-500">New balance</span>
          <span className="font-black text-gray-900">{result.newCreds?.toLocaleString()} TKN</span>
        </div>

        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full rounded-2xl bg-orange-500 py-3.5 text-sm font-black text-white shadow-lg shadow-orange-100 transition-colors hover:bg-orange-600"
          >
            {isWin ? "Continue" : "Try again tomorrow"}
          </button>
        </div>
      </div>
    </div>
  );
}