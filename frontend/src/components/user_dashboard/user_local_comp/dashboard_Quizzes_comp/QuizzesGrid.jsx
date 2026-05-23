import QuizCard from './QuizCard';

const QuizzesGrid = ({ quizzes, onStartQuiz }) => {
  if (!quizzes || quizzes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
        <div className="p-4 bg-white rounded-full shadow-sm mb-4">
          <span className="text-4xl">📝</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900">No quizzes available</h3>
        <p className="text-gray-500 mt-2">Check back later for new challenges!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {quizzes.map((quiz) => (
        <QuizCard key={quiz._id} quiz={quiz} onStart={onStartQuiz} />
      ))}
    </div>
  );
};

export default QuizzesGrid;