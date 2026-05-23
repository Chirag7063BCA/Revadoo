const QuizzesResult = ({ result, onClose }) => {
  if (!result) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl p-10 text-center border border-gray-100">
        <div className="text-4xl mb-4">🔍</div>
        <p className="text-gray-600 font-medium">No result data available</p>
        <button
          onClick={onClose}
          className="mt-6 w-full bg-orange-600 text-white font-bold py-3 rounded-xl hover:bg-orange-700 transition-all shadow-lg shadow-orange-100"
        >
          Back to Quizzes
        </button>
      </div>
    );
  }

  const percentage = result.totalQuestions 
    ? (result.score / result.totalQuestions) * 100 
    : 0;
  
  return (
    <div className="max-w-md mx-auto bg-white rounded-[2.5rem] shadow-2xl shadow-orange-100/50 p-10 text-center border border-gray-100 animate-in fade-in zoom-in duration-500">
      <div className="mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-50 rounded-3xl mb-6 transform rotate-12">
          <span className="text-5xl -rotate-12">🎉</span>
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2 font-['DM_Sans']">Quiz Completed!</h2>
        <p className="text-orange-600 font-bold bg-orange-50 inline-block px-4 py-1 rounded-full text-sm">
          {result.quizTitle || 'Quiz'}
        </p>
      </div>

      <div className="space-y-6 mb-10">
        <div className="relative inline-block">
          <div className="text-6xl font-black text-gray-900 mb-1">
            {result.score || 0}<span className="text-2xl text-gray-400 font-bold">/{result.totalQuestions || 0}</span>
          </div>
          <div className="text-orange-500 font-bold text-lg">
            {percentage.toFixed(0)}% Accuracy
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-6 text-white shadow-xl shadow-orange-200">
          <div className="text-sm font-bold opacity-80 uppercase tracking-widest mb-1">Reward Earned</div>
          <div className="text-4xl font-black flex items-center justify-center gap-2">
            <span>+{result.earnedCoins || 0}</span>
            <span className="text-3xl">🪙</span>
          </div>
          <div className="text-xs mt-2 opacity-70 font-medium">Added to your balance instantly</div>
        </div>
      </div>

      <button
        onClick={onClose}
        className="w-full bg-gray-900 text-white font-extrabold py-4 rounded-2xl hover:bg-black transition-all shadow-xl shadow-gray-200 hover:-translate-y-1 active:translate-y-0"
      >
        Continue Exploration
      </button>
      
      <p className="text-gray-400 text-xs mt-6 font-medium">
        Ready for another one? Your skills are improving!
      </p>
    </div>
  );
};

export default QuizzesResult;