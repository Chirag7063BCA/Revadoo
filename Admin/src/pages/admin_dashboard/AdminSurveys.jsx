import React, { useEffect } from "react";
import { useSurvey } from "../../hooks/useSurveyApi";

import SurveysHeader from "../../components/admin_dashboard/admin_local_comp/surveys_comp/SurveysHeader";
import AddSurveyForm from "../../components/admin_dashboard/admin_local_comp/surveys_comp/AddSurveyForm";
import SurveysTable from "../../components/admin_dashboard/admin_local_comp/surveys_comp/SurveysTable";
import SurveysQuickActions from "../../components/admin_dashboard/admin_local_comp/surveys_comp/SurveysQuickActions";

const AdminSurveys = () => {
  const { surveys, loading, error, loadSurveys, removeSurvey } = useSurvey();

  useEffect(() => {
    loadSurveys();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (surveyId) => {
    if (window.confirm("Are you sure you want to delete this survey?")) {
      await removeSurvey(surveyId);
    }
  };

  const safeSurveys = Array.isArray(surveys) ? surveys : [];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      
      {/* ✅ Yeh aapka real-time Total Surveys dikhayega jo automatically update hoga */}
      <SurveysHeader totalSurveys={safeSurveys.length} />
      
      {/* ❌ FAKE STATS WALA COMPONENT YAHAN SE HATA DIYA HAI */}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 text-red-700 font-medium rounded-md shadow-sm">
          {error}
        </div>
      )}

      {loading && safeSurveys.length === 0 ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-orange-200 border-t-orange-600"></div>
        </div>
      ) : (
        <div className="space-y-6">
          <AddSurveyForm onSurveyCreated={loadSurveys} />
          <SurveysTable surveys={safeSurveys} onDelete={handleDelete} />
        </div>
      )}

      <SurveysQuickActions />
      
    </div>
  );
};

export default AdminSurveys;