import React from 'react';
import AllLotteryTickets from './dashboard_Tickets_comp/AllLotteryTickets';
import LotteryResult from './dashboard_result_comp/LotteryResult';

const LotteryUser = ({ activeTab = 'home' }) => {
  return (
    <div className="space-y-4">
      {activeTab === 'tickets' && <AllLotteryTickets />}
      {activeTab === 'results' && <LotteryResult />}
    </div>
  );
};

export default LotteryUser;