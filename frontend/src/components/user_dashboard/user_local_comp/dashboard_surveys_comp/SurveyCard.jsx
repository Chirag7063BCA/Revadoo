import React from 'react';

const SurveyCard = ({ survey, onStart, isCompleted }) => {
  return (
    <div className={`relative bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col transition-all duration-300 group 
      ${isCompleted ? 'opacity-80 grayscale-[30%] pointer-events-none' : 'hover:shadow-xl hover:-translate-y-1'}`}>
      
      {/* Agar Complete ho gaya toh ye OVERLAY aayega */}
      {isCompleted && (
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center rounded-2xl">
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-black text-sm flex items-center gap-2 shadow-lg border border-green-200">
            <span>✅</span> Already Completed
          </div>
        </div>
      )}

      <div className="relative mb-4">
        <div className={`w-full h-40 bg-gray-100 rounded-xl overflow-hidden border border-gray-100 transition-colors ${!isCompleted && 'group-hover:border-orange-200'}`}>
          {survey.thumbnail ? (
            <img src={survey.thumbnail} alt={survey.title} className={`w-full h-full object-cover transition-transform duration-500 ${!isCompleted && 'group-hover:scale-105'}`} />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-orange-50">
              <span className="text-4xl font-bold text-orange-200">S</span>
            </div>
          )}
        </div>
        <div className="absolute top-2 right-2 flex items-center bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full border border-orange-100 shadow-sm z-0">
          <span className="text-sm font-bold text-orange-600">🪙 {survey.reward} <span className="text-xs text-orange-400">(+10)</span></span>
        </div>
      </div>

      <h3 className={`text-xl font-bold text-gray-900 mb-2 transition-colors line-clamp-1 ${!isCompleted && 'group-hover:text-orange-600'}`}>{survey.title}</h3>
      <p className="text-gray-500 mb-4 text-sm line-clamp-2">{survey.description}</p>
      
      <div className="flex items-center gap-4 text-xs font-bold text-gray-400 mb-6 uppercase tracking-wider">
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {survey.questions?.length || 0} Questions
        </span>
      </div>

      <button
        onClick={() => !isCompleted && onStart(survey._id)}
        disabled={isCompleted}
        className={`w-full py-3 rounded-xl font-bold transition-all duration-300 relative z-20
          ${isCompleted 
            ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed' 
            : 'bg-orange-600 text-white shadow-lg shadow-orange-100 hover:bg-orange-700 hover:shadow-orange-200'}`}
      >
        {isCompleted ? "Completed" : "Start Survey"}
      </button>
    </div>
  );
};

export default SurveyCard;