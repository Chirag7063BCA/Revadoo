import SurveysHeader from "../../components/user_dashboard/user_local_comp/dashboard_surveys_comp/SurveysHeader";
import SurveysStats from "../../components/user_dashboard/user_local_comp/dashboard_surveys_comp/SurveysStats";
import SurveysGrid from "../../components/user_dashboard/user_local_comp/dashboard_surveys_comp/SurveysGrid";
import ActiveSurvey from "../../components/user_dashboard/user_local_comp/dashboard_surveys_comp/ActiveSurvey";
import SurveysQuickActions from "../../components/user_dashboard/user_local_comp/dashboard_surveys_comp/SurveysQuickActions";

const DashboardSurveys = () => {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <SurveysHeader />

      <SurveysStats />

      <SurveysGrid />

      <ActiveSurvey />

      <SurveysQuickActions />
    </div>
  );
};

export default DashboardSurveys;
