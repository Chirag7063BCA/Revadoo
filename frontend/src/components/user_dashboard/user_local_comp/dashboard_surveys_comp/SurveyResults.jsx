import React, { useState } from 'react';
import confetti from 'canvas-confetti';

const SurveysResult = ({ result, onClose }) => {
  const [boxState, setBoxState] = useState('locked');

  if (!result) return null;

  const handleOpenBox = () => {
    setBoxState('opening');
    
    setTimeout(() => {
      setBoxState('revealed');
      fireConfetti();
      
      if (result.newBalance) {
        window.dispatchEvent(new CustomEvent("balanceUpdated", { detail: { newBalance: result.newBalance } }));
        window.dispatchEvent(new CustomEvent("walletUpdated", { detail: { newBalance: result.newBalance } }));
      }
    }, 1500); 
  };

  const fireConfetti = () => {
    const particleCount = result.isJackpot ? 150 : 50;
    const colors = result.isJackpot ? ['#FFD700', '#FFA500', '#FFF'] : ['#FF6B00', '#FF8C00'];

    confetti({
      particleCount,
      spread: 80,
      origin: { y: 0.6 },
      colors: colors,
      disableForReducedMotion: true
    });
  };

  return (
    <div className={`max-w-md mx-auto rounded-[2.5rem] shadow-2xl p-10 text-center transition-all duration-700 mt-10 relative overflow-hidden
      ${boxState === 'revealed' && result.isJackpot ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-400' : 'bg-white border border-gray-100'}
    `}>
      
      <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl pointer-events-none transition-colors duration-1000
        ${result.isJackpot && boxState === 'revealed' ? 'bg-yellow-400/40' : 'bg-orange-400/10'}
      `}></div>

      <div className="relative z-10">
        
        <h2 className="text-3xl font-black text-gray-900 mb-2 font-['DM_Sans']">Mission Accomplished!</h2>
        <p className="text-gray-500 font-medium mb-8">You've earned a Mystery Reward Box.</p>

        <div className="min-h-[250px] flex flex-col items-center justify-center mb-8">
          
          {boxState === 'locked' && (
            <button 
              onClick={handleOpenBox}
              className="group relative cursor-pointer transform hover:scale-105 transition-transform"
            >
              <div className="absolute inset-0 bg-orange-400 blur-xl opacity-50 group-hover:opacity-80 animate-pulse"></div>
              <div className="w-32 h-32 bg-gradient-to-br from-gray-800 to-black rounded-3xl flex items-center justify-center text-6xl shadow-2xl relative z-10 border-4 border-gray-700">
                🎁
              </div>
              <div className="mt-6 px-6 py-2 bg-orange-100 text-orange-700 font-bold rounded-full animate-bounce">
                Tap to Reveal Reward
              </div>
            </button>
          )}

          {boxState === 'opening' && (
            <div className="w-32 h-32 bg-gradient-to-br from-gray-800 to-black rounded-3xl flex items-center justify-center text-6xl shadow-2xl border-4 border-orange-500 animate-[wiggle_0.3s_ease-in-out_infinite]">
              ⏱️
            </div>
          )}

          {boxState === 'revealed' && (
            <div className="w-full animate-in zoom-in duration-500">
              <div className={`rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden
                ${result.isJackpot ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 'bg-gray-900'}
              `}>
                
                {result.multiplier > 1 && (
                  <div className="absolute top-0 right-0 bg-red-500 text-white font-black px-4 py-1 rounded-bl-2xl text-sm shadow-md">
                    x{result.multiplier} BONUS!
                  </div>
                )}

                <div className="text-sm font-bold uppercase tracking-widest opacity-80 mb-2 mt-2">
                  {result.isJackpot ? "🔥 MEGA JACKPOT 🔥" : "Tokens Added to Wallet"}
                </div>
                
                <div className="text-7xl font-black flex items-center justify-center gap-3">
                  <span>+{result.earnedCoins}</span>
                  <span className="text-5xl drop-shadow-lg">🪙</span>
                </div>

                {result.multiplier > 1 && (
                  <div className="text-xs font-bold mt-4 bg-black/20 py-2 rounded-full">
                    Base: {result.baseReward} • Multiplier Applied
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        <button
          onClick={onClose}
          disabled={boxState !== 'revealed'}
          className={`w-full font-black py-4 rounded-2xl transition-all text-lg shadow-lg
            ${boxState === 'revealed' 
              ? 'bg-gradient-to-r from-[#FF6B00] to-[#FF8C00] text-white hover:shadow-orange-300 hover:-translate-y-1' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50'}
          `}
        >
          {boxState === 'revealed' ? "Collect & Continue 🚀" : "Waiting for reveal..."}
        </button>
      </div>

      <style>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(-5deg) scale(1.1); }
          50% { transform: rotate(5deg) scale(1.1); }
        }
      `}</style>
    </div>
  );
};

export default SurveysResult;