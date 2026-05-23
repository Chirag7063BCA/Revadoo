import React, { useState } from 'react';
import LotteryHeader from '../../components/user_dashboard/user_local_comp/dashboard_lottery_comp/LotteryHeader';
import Lotteryticket from '../../components/user_dashboard/user_local_comp/dashboard_lottery_comp/Lotteryticket';
import LotteryUser from '../../components/user_dashboard/user_local_comp/dashboard_lottery_comp/LotteryUser';

const DashboardLottery = () => {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <section className="lottery-enter w-full space-y-5">
      <LotteryHeader activeTab={activeTab} onTabSelect={setActiveTab} />
      <div className="grid grid-cols-1 gap-5">
        {activeTab === 'home' ? <Lotteryticket onViewTickets={() => setActiveTab('tickets')} /> : <LotteryUser activeTab={activeTab} />}
      </div>
    </section>
  );
};

export default DashboardLottery;