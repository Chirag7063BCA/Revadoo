const QuizzesTable = ({ quizzes, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Thumbnail
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Reward
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {quizzes?.map((quiz) => (
              <tr
                key={quiz._id}
                className="hover:bg-orange-50/30 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                    {quiz.thumbnail ? (
                      <img
                        src={quiz.thumbnail}
                        alt={quiz.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        No Img
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-bold text-gray-900">
                    {quiz.title}
                  </div>
                  <div className="text-xs text-gray-500 truncate max-w-xs">
                    {quiz.description || "No description"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm font-bold text-orange-600">
                    <span className="mr-1">🪙</span>
                    {quiz.reward}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onDelete && onDelete(quiz._id)}
                    className="text-red-600 hover:text-red-900 font-bold transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!quizzes?.length && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No quizzes found. Create your first quiz above!
          </p>
        </div>
      )}
    </div>
  );
};

export default QuizzesTable;
