import { useCallback, useEffect, useMemo } from "react";
import { useQuiz } from "../../hooks/useQuiz";

import QuizzesHeader from "../../components/admin_dashboard/admin_local_comp/quizzes_comp/QuizzesHeader";
import AdminQuizStats from "../../components/admin_dashboard/admin_local_comp/quizzes_comp/AdminQuizStats";
import AddQuizForm from "../../components/admin_dashboard/admin_local_comp/quizzes_comp/AddQuizForm";
import QuizzesTable from "../../components/admin_dashboard/admin_local_comp/quizzes_comp/QuizzesTable";

const AdminQuizzes = () => {
  const { quizzes, loading, error, loadQuizzes, removeQuiz, prependQuiz } =
    useQuiz();

  useEffect(() => {
    loadQuizzes();
  }, [loadQuizzes]);

  const quizCount = useMemo(() => quizzes.length, [quizzes.length]);

  const handleQuizCreated = useCallback(
    (createdQuiz) => {
      prependQuiz(createdQuiz);
    },
    [prependQuiz],
  );

  const handleDelete = useCallback(async (quizId) => {
    if (window.confirm("Are you sure you want to delete this quiz?")) {
      await removeQuiz(quizId);
    }
  }, [removeQuiz]);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <QuizzesHeader totalQuizzes={quizCount} />

      <AdminQuizStats totalQuizzes={quizCount} />

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4 text-red-700">
          {error}
        </div>
      )}

      {loading && quizzes.length === 0 ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <AddQuizForm onQuizCreated={handleQuizCreated} />
          <QuizzesTable quizzes={quizzes} onDelete={handleDelete} />
        </>
      )}
    </div>
  );
};

export default AdminQuizzes;
