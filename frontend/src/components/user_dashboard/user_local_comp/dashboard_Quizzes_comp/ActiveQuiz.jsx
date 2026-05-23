const ActiveQuiz = ({
  quiz,
  currentQuestionIndex,
  userAnswers,
  onAnswer,
  onNext,
  onPrev,
  onSubmit
}) => {
  const currentQuestion = quiz.questions[currentQuestionIndex];
  const currentAnswer = userAnswers[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;
  const allAnswered = userAnswers.every(answer => answer !== null);
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl shadow-orange-100/50 border border-gray-100 overflow-hidden">
        {/* Header/Progress */}
        <div className="bg-gray-50 p-6 border-b border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-bold text-orange-600 uppercase tracking-widest">
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </span>
            <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">
              {userAnswers.filter(a => a !== null).length} Answered
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-orange-500 to-orange-400 h-full transition-all duration-500 ease-out rounded-full shadow-[0_0_10px_rgba(251,146,60,0.5)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-8 md:p-12">
          <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-10 leading-relaxed font-['DM_Sans'] text-center">
            {currentQuestion.text}
          </h3>

          <div className="grid grid-cols-1 gap-4">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => onAnswer(option)}
                className={`group relative w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 flex items-center gap-4 ${
                  currentAnswer === option
                    ? 'bg-orange-50 border-orange-500 shadow-md shadow-orange-100 translate-x-1'
                    : 'bg-white border-gray-100 hover:border-orange-200 hover:bg-orange-50/30'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg transition-colors ${
                  currentAnswer === option
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 text-gray-500 group-hover:bg-orange-100 group-hover:text-orange-600'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </div>
                <span className={`text-lg font-bold transition-colors ${
                  currentAnswer === option ? 'text-orange-900' : 'text-gray-700 group-hover:text-gray-900'
                }`}>
                  {option}
                </span>
                {currentAnswer === option && (
                  <div className="ml-auto text-orange-600">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Footer/Navigation */}
        <div className="p-6 md:p-8 bg-gray-50 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <button
            onClick={onPrev}
            disabled={isFirstQuestion}
            className={`w-full md:w-auto px-8 py-3 rounded-xl font-bold transition-all ${
              isFirstQuestion
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100 shadow-sm'
            }`}
          >
            ← Previous
          </button>
          
          <div className="flex gap-4 w-full md:w-auto">
            {!isLastQuestion ? (
              <button
                onClick={onNext}
                disabled={!currentAnswer}
                className={`flex-grow md:flex-none px-12 py-3 rounded-xl font-bold text-white transition-all shadow-lg ${
                  !currentAnswer
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-orange-600 hover:bg-orange-700 hover:-translate-y-0.5 shadow-orange-200 active:translate-y-0'
                }`}
              >
                Next Step →
              </button>
            ) : (
              <button
                onClick={() => onSubmit()}
                disabled={!allAnswered}
                className={`flex-grow md:flex-none px-12 py-3 rounded-xl font-bold text-white transition-all shadow-lg ${
                  !allAnswered
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 hover:-translate-y-0.5 shadow-green-200 active:translate-y-0'
                }`}
              >
                Finish Quiz ✨
              </button>
            )}
          </div>
        </div>
      </div>
      
      <p className="text-center text-gray-400 text-sm mt-8">
        Take your time and read each question carefully. Good luck!
      </p>
    </div>
  );
};

export default ActiveQuiz;