import { useState } from "react";

const RewardSettings = () => {
  const [signupBonus, setSignupBonus] = useState(5.0);
  const [referralBonus, setReferralBonus] = useState(2.5);
  const [minWithdrawal, setMinWithdrawal] = useState(10.0);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Reward Settings</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Signup Bonus ($)</label>
          <input
            type="number"
            step="0.1"
            value={signupBonus}
            onChange={(e) => setSignupBonus(parseFloat(e.target.value))}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Referral Bonus ($)</label>
          <input
            type="number"
            step="0.1"
            value={referralBonus}
            onChange={(e) => setReferralBonus(parseFloat(e.target.value))}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Min Withdrawal ($)</label>
          <input
            type="number"
            step="0.1"
            value={minWithdrawal}
            onChange={(e) => setMinWithdrawal(parseFloat(e.target.value))}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default RewardSettings;