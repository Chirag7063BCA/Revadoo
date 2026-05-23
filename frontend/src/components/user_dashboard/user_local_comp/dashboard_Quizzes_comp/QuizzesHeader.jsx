const QuizzesHeader = () => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 font-['DM_Sans']">
        Interactive <span className="text-orange-600">Quizzes</span>
      </h1>
      <p className="text-gray-500 mt-2 text-lg max-w-2xl">
        Test your knowledge, challenge yourself, and earn rewards with every correct answer!
      </p>
      <div className="h-1 w-20 bg-gradient-to-r from-orange-500 to-orange-300 mt-4 rounded-full"></div>
    </div>
  );
};

export default QuizzesHeader;

