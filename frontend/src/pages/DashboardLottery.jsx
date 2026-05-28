import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useLotteries } from '../hooks/useLottery';
import LotteryHeader from '../components/user_dashboard/user_local_comp/dashboard_lottery_comp/LotteryHeader';
import Lotteryticket from '../components/user_dashboard/user_local_comp/dashboard_lottery_comp/Lotteryticket';
import LotteryUser from '../components/user_dashboard/user_local_comp/dashboard_lottery_comp/LotteryUser';

const DashboardLottery = () => {
  const [activeTab, setActiveTab] = useState('home');
  const { lotteries, loading } = useLotteries();
  const nextDraw = useMemo(() => lotteries[0] || null, [lotteries]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="w-full space-y-5"
    >
      <LotteryHeader
        activeTab={activeTab}
        onTabSelect={setActiveTab}
        nextDrawAt={nextDraw?.drawEndAt || null}
        lotteryName={nextDraw?.name || null}
      />

      {activeTab === 'home' ? (
        <Lotteryticket lotteryData={nextDraw} loading={loading} onViewTickets={() => setActiveTab('tickets')} />
      ) : (
        <LotteryUser activeTab={activeTab} />
      )}
    </motion.section>
  );
};

export default DashboardLottery;
