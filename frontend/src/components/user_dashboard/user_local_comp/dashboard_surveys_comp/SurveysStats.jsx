import React from 'react';

const SurveysStats = ({ available, completed, earned }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Card 1 */}
      <div className="bg-white/80 backdrop-blur-md p-6 rounded-[2rem] shadow-sm border border-white hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1 transition-all duration-300 flex items-center gap-5 relative overflow-hidden group">
        <div className="absolute w-20 h-20 bg-blue-400/10 rounded-full blur-2xl top-0 right-0 group-hover:bg-blue-400/20 transition-colors"></div>
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center text-3xl shadow-inner border border-blue-50">🎯</div>
        <div className="relative z-10">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Available Missions</p>
          <h3 className="text-4xl font-black text-gray-900">{available || 0}</h3>
        </div>
      </div>

      {/* Card 2 */}
      <div className="bg-white/80 backdrop-blur-md p-6 rounded-[2rem] shadow-sm border border-white hover:shadow-xl hover:shadow-green-200/40 hover:-translate-y-1 transition-all duration-300 flex items-center gap-5 relative overflow-hidden group">
        <div className="absolute w-20 h-20 bg-green-400/10 rounded-full blur-2xl top-0 right-0 group-hover:bg-green-400/20 transition-colors"></div>
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center text-3xl shadow-inner border border-green-50">✅</div>
        <div className="relative z-10">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Surveys Completed</p>
          <h3 className="text-4xl font-black text-gray-900">{completed || 0}</h3>
        </div>
      </div>

      {/* Card 3 (Premium Orange) */}
      <div className="bg-gradient-to-br from-[#FF6B00] to-[#e66000] p-6 rounded-[2rem] shadow-2xl shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-1 transition-all duration-300 flex items-center gap-5 text-white relative overflow-hidden group">
        <div className="absolute w-32 h-32 bg-white/10 rounded-full blur-2xl -top-10 -right-10 group-hover:scale-150 transition-transform duration-700"></div>
        <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl border border-white/20 shadow-inner">🪙</div>
        <div className="relative z-10">
          <p className="text-xs font-black text-orange-200 uppercase tracking-widest mb-1">Total Tokens Earned</p>
          <h3 className="text-4xl font-black drop-shadow-md">{earned || 0}</h3>
        </div>
      </div>
    </div>
  );
};

export default SurveysStats;