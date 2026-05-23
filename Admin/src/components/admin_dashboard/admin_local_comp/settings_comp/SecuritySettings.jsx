import { useState } from "react";

const SecuritySettings = () => {
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(30);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="2fa"
            checked={twoFactorRequired}
            onChange={(e) => setTwoFactorRequired(e.target.checked)}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="2fa" className="ml-2 block text-sm text-gray-900">
            Require two-factor authentication for admin accounts
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Session timeout (minutes)
          </label>
          <input
            type="number"
            min="1"
            value={sessionTimeout}
            onChange={(e) => setSessionTimeout(parseInt(e.target.value))}
            className="w-32 px-4 py-2 border rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;