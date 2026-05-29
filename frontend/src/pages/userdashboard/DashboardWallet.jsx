import React from 'react'
import WalletHeader from '../../components/user_dashboard/user_local_comp/dashboard_wallet_comp/WalletHeader'
import WalletBalanceCard from '../../components/user_dashboard/user_local_comp/dashboard_wallet_comp/WalletBalanceCard'
import TransactionHistory from '../../components/user_dashboard/user_local_comp/dashboard_wallet_comp/TransactionHistory'
import WalletStats from '../../components/user_dashboard/user_local_comp/dashboard_wallet_comp/WalletStats'
import WithdrawForm from '../../components/user_dashboard/user_local_comp/dashboard_wallet_comp/WithdrawForm'
//  import WalletQuickActions from '../../components/user_dashboard/user_local_comp/dashboard_wallet_comp/WalletQuickActions'
import AddMoneyCard from '../../components/user_dashboard/user_local_comp/dashboard_wallet_comp/AddMoneyCard'
function DashboardWallet() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <WalletHeader />

      <WalletBalanceCard />

      <section className="space-y-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-500">Wallet Snapshot</p>
          <h2 className="text-xl font-bold text-gray-900">Key totals</h2>
        </div>
        <WalletStats />
      </section>

      <section className="space-y-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-500">Transactions</p>
          <h2 className="text-xl font-bold text-gray-900">Credits, conversions, and withdrawals</h2>
        </div>
        <TransactionHistory />
      </section>

      <section className="space-y-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-500">Wallet Actions</p>
          <h2 className="text-xl font-bold text-gray-900">Withdraw Funds | Add Funds</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 items-stretch">
        <WithdrawForm />
        <AddMoneyCard />
        </div>
      </section>

       {/* <WalletQuickActions />  */}
    </div>
  );
}

export default DashboardWallet
