const SurveysQuickActions = () => {
  const actions = [
    { icon: "🎯", label: "Recommended Surveys" },
    { icon: "🏆", label: "Top Earners" },
    { icon: "🎁", label: "Bonus Surveys" },
    { icon: "📊", label: "Survey History" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {actions.map((action, index) => (
        <button
          key={index}
          className="bg-gray-50 border rounded-xl p-4 flex flex-col items-center gap-2 hover:bg-gray-100"
        >
          <span className="text-2xl">{action.icon}</span>
          <span className="text-sm">{action.label}</span>
        </button>
      ))}
    </div>
  );
};

export default SurveysQuickActions;
