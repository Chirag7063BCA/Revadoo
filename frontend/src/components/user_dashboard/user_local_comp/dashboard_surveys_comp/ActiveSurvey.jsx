import React, { useState } from 'react';

const ActiveSurvey = ({ survey, currentQuestionIndex, userAnswers, onAnswer, onNext, onPrev, onSubmit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const question = survey.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / survey.questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === survey.questions.length - 1;
  const currentAnswer = userAnswers[currentQuestionIndex];

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    await onSubmit(); // Calls the ultra-fast parallel backend
    setIsSubmitting(false); // Failsafe, though UI unmounts instantly anyway
  };

  return (
    <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-gray-200/50 border border-white p-8 relative overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
      
      {/* Background Glow */}
      <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-orange-400/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Progress Section */}
      <div className="mb-10">
        <div className="flex justify-between items-end mb-3">
          <span className="text-xs font-black uppercase tracking-widest text-orange-500 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
            Question {currentQuestionIndex + 1} of {survey.questions.length}
          </span>
          <span className="text-sm font-bold text-gray-400">{Math.round(progress)}% Completed</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden shadow-inner">
          <div 
            className="bg-gradient-to-r from-[#FF6B00] to-[#FF8C00] h-full transition-all duration-700 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-white/20 w-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Question */}
      <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-8 leading-tight">
        {question.text || question.questionText}
      </h2>

      {/* Futuristic Answer Options */}
      <div className="space-y-4 mb-10">
        {question.options.map((option, idx) => {
          const isSelected = currentAnswer === option;
          return (
            <button
              key={idx}
              onClick={() => onAnswer(option)}
              className={`w-full flex items-center p-5 rounded-2xl border-2 text-left transition-all duration-300 transform active:scale-[0.98] ${
                isSelected 
                  ? 'border-orange-500 bg-orange-50/50 shadow-[0_0_20px_rgba(255,107,0,0.15)] ring-4 ring-orange-500/10' 
                  : 'border-gray-100 hover:border-orange-200 hover:bg-gray-50'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 font-bold transition-colors ${
                isSelected ? 'bg-orange-500 text-white shadow-lg shadow-orange-200' : 'bg-gray-100 text-gray-500'
              }`}>
                {String.fromCharCode(65 + idx)}
              </div>
              <span className={`text-lg font-medium ${isSelected ? 'text-gray-900 font-bold' : 'text-gray-700'}`}>
                {option}
              </span>
              
              {isSelected && (
                <div className="ml-auto animate-in zoom-in duration-200">
                  <span className="text-orange-500 text-xl">✓</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-100">
        <button
          onClick={onPrev}
          disabled={currentQuestionIndex === 0 || isSubmitting}
          className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
        >
          ← Previous
        </button>

        {isLastQuestion ? (
          <button
            onClick={handleFinalSubmit}
            disabled={!currentAnswer || isSubmitting}
            className={`px-8 py-4 rounded-xl font-black text-white transition-all duration-300 transform flex items-center gap-2 ${
              !currentAnswer || isSubmitting
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-gray-900 to-black hover:shadow-2xl hover:shadow-gray-400 hover:-translate-y-1'
            }`}
          >
            {isSubmitting ? "Verifying..." : "Submit & Claim Reward 🌟"}
          </button>
        ) : (
          <button
            onClick={onNext}
            disabled={!currentAnswer}
            className={`px-8 py-3 rounded-xl font-bold text-white transition-all duration-300 flex items-center gap-2 ${
              !currentAnswer 
                ? 'bg-orange-200 cursor-not-allowed' 
                : 'bg-[#FF6B00] hover:bg-[#e66000] shadow-lg shadow-orange-200 hover:-translate-y-0.5'
            }`}
          >
            Next Question →
          </button>
        )}
      </div>
    </div>
  );
};

export default ActiveSurvey;