import WalletHeader from "../../components/admin_dashboard/admin_local_comp/wallet_comp/WalletHeader";
import WalletStats from "../../components/admin_dashboard/admin_local_comp/wallet_comp/WalletStats";
import TransactionFilters from "../../components/admin_dashboard/admin_local_comp/wallet_comp/TransactionFilters";
import TransactionsTable from "../../components/admin_dashboard/admin_local_comp/wallet_comp/TransactionsTable";
import ManualAdjustment from "../../components/admin_dashboard/admin_local_comp/wallet_comp/ManualAdjustment";
import WalletQuickActions from "../../components/admin_dashboard/admin_local_comp/wallet_comp/WalletQuickActions";

const AdminWallet = () => {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <WalletHeader />
      <WalletStats />
      <TransactionFilters />
      <TransactionsTable />
      <ManualAdjustment />
      <WalletQuickActions />
    </div>
  );
};

export default AdminWallet;