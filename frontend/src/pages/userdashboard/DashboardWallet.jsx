import React from 'react'
import WalletHeader from '../../components/user_dashboard/user_local_comp/dashboard_wallet_comp/WalletHeader'
import WalletBalanceCard from '../../components/user_dashboard/user_local_comp/dashboard_wallet_comp/WalletBalanceCard'
import TransactionHistory from '../../components/user_dashboard/user_local_comp/dashboard_wallet_comp/TransactionHistory'
import WalletStats from '../../components/user_dashboard/user_local_comp/dashboard_wallet_comp/WalletStats'
import WithdrawForm from '../../components/user_dashboard/user_local_comp/dashboard_wallet_comp/WithdrawForm'
import WalletQuickActions from '../../components/user_dashboard/user_local_comp/dashboard_wallet_comp/WalletQuickActions'
function DashboardWallet() {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <WalletHeader />
      <WalletBalanceCard />
      <TransactionHistory />
      <WalletStats />
      <WithdrawForm />
      <WalletQuickActions />
    </div>
  );
}

export default DashboardWallet
