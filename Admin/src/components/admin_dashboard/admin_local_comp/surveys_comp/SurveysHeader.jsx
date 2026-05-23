const SurveysHeader = ({ totalSurveys }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 font-['DM_Sans']">
          Manage Surveys
        </h1>
        <p className="text-gray-500 mt-1">
          Create and manage auto-deleting surveys for your users
        </p>
      </div>

      <div className="bg-orange-50 px-4 py-2 rounded-lg border border-orange-100">
        <span className="text-sm font-medium text-orange-600">Total Surveys:</span>
        <span className="ml-2 text-xl font-bold text-orange-700">{totalSurveys || 0}</span>
      </div>
    </div>
  );
};

export default SurveysHeader;