const QuizCard = ({ quiz, onStart }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      <div className="relative mb-4">
        <div className="w-full h-40 bg-gray-100 rounded-xl overflow-hidden border border-gray-100 group-hover:border-orange-200 transition-colors">
          {quiz.thumbnail ? (
            <img
              src={quiz.thumbnail}
              alt={quiz.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-orange-50">
              <span className="text-4xl font-bold text-orange-200">Q</span>
            </div>
          )}
        </div>
        <div className="absolute top-2 right-2 flex items-center bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full border border-orange-100 shadow-sm">
          <span className="text-sm font-bold text-orange-600">
            🪙 {quiz.reward}
          </span>
        </div>
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-1">
        {quiz.title}
      </h3>
      <p className="text-gray-500 mb-4 text-sm line-clamp-2">
        {quiz.description}
      </p>

      <div className="flex items-center gap-4 text-xs font-bold text-gray-400 mb-6 uppercase tracking-wider">
        <span className="flex items-center gap-1">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {quiz.questionCount || quiz.questions?.length || 0} Questions
        </span>
      </div>

      <button
        onClick={() => onStart(quiz._id)}
        className="w-full py-3 rounded-xl bg-orange-600 text-white font-bold transition-all duration-300 shadow-lg shadow-orange-100 hover:bg-orange-700 hover:shadow-orange-200"
      >
        Start Quiz
      </button>
    </div>
  );
};

export default QuizCard;
