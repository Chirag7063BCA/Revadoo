import React from 'react';

const SurveysHeader = () => {
  return (
    <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg shadow-orange-200">
          📋
        </div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">
          Surveys
        </h1>
      </div>
      <p className="text-lg text-gray-500 font-medium max-w-2xl mt-3">
        Complete surveys and earn <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] to-[#ff8c00]">Revadoo Tokens</span> to unlock exclusive rewards.
      </p>
    </div>
  );
};

export default SurveysHeader;