import ReferralsHeader from "../../components/user_dashboard/user_local_comp/dashboard_referral_comp/ReferralsHeader";
import ReferralsStats from "../../components/user_dashboard/user_local_comp/dashboard_referral_comp/ReferralsStats";
import ReferralLinkCard from "../../components/user_dashboard/user_local_comp/dashboard_referral_comp/ReferralLinkCard";
import ReferralsGrid from "../../components/user_dashboard/user_local_comp/dashboard_referral_comp/ReferralsGrid";
import TopReferrerHighlight from "../../components/user_dashboard/user_local_comp/dashboard_referral_comp/TopReferrerHighlight";
// import ReferralsQuickActions from "../../components/user_dashboard/user_local_comp/dashboard_referral_comp/ReferralsQuickActions";

const DashboardReferrals = () => {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <ReferralsHeader />
      <ReferralsStats />
      <ReferralLinkCard />
      <ReferralsGrid />
      <TopReferrerHighlight />
      {/* <ReferralsQuickActions /> */}
    </div>
  );
};

export default DashboardReferrals;
