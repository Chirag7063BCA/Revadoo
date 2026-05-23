import { useQuiz } from "../../hooks/useQuiz";
import { useEffect } from "react";
import QuizzesHeader from "../../components/user_dashboard/user_local_comp/dashboard_Quizzes_comp/QuizzesHeader";
import UserQuizStats from "../../components/user_dashboard/user_local_comp/dashboard_Quizzes_comp/UserQuizStats";
import QuizzesResult from "../../components/user_dashboard/user_local_comp/dashboard_Quizzes_comp/QuizzesResult";
import QuizzesGrid from "../../components/user_dashboard/user_local_comp/dashboard_Quizzes_comp/QuizzesGrid";
import ActiveQuiz from "../../components/user_dashboard/user_local_comp/dashboard_Quizzes_comp/ActiveQuiz";

const DashboardQuizzes = () => {
  const {
    quizzes,
    activeQuiz,
    currentQuestionIndex,
    userAnswers,
    result,
    loading,
    error,
    startQuiz,
    answerQuestion,
    nextQuestion,
    prevQuestion,
    submitQuiz,
    closeQuiz,
    loadQuizzes,
  } = useQuiz();

  // Load quizzes on component mount
  useEffect(() => {
    loadQuizzes();
  }, []);

  if (loading && quizzes.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <QuizzesHeader />

      <UserQuizStats />

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {!activeQuiz && !result && (
        <QuizzesGrid quizzes={quizzes} onStartQuiz={startQuiz} />
      )}

      {activeQuiz && !result && (
        <ActiveQuiz
          quiz={activeQuiz}
          currentQuestionIndex={currentQuestionIndex}
          userAnswers={userAnswers}
          onAnswer={answerQuestion}
          onNext={nextQuestion}
          onPrev={prevQuestion}
          onSubmit={submitQuiz}
        />
      )}

      {result && <QuizzesResult result={result} onClose={closeQuiz} />}
    </div>
  );
};

export default DashboardQuizzes;
