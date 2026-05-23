import { useState } from "react";
import { FiLock, FiShield } from "react-icons/fi";

const SecuritySettings = () => {
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [twoFactor, setTwoFactor] = useState(false);

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordForm.new !== passwordForm.confirm) {
      alert("Passwords do not match");
      return;
    }
    // API call to change password
    alert("Password changed (demo)");
    setPasswordForm({ current: "", new: "", confirm: "" });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
      
      {/* Change Password */}
      <form onSubmit={handlePasswordSubmit} className="space-y-4 mb-6">
        <h3 className="text-md font-medium text-gray-700 flex items-center gap-2">
          <FiLock className="text-indigo-500" /> Change Password
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="password"
            name="current"
            placeholder="Current Password"
            value={passwordForm.current}
            onChange={handlePasswordChange}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            required
          />
          <input
            type="password"
            name="new"
            placeholder="New Password"
            value={passwordForm.new}
            onChange={handlePasswordChange}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            required
          />
          <input
            type="password"
            name="confirm"
            placeholder="Confirm New Password"
            value={passwordForm.confirm}
            onChange={handlePasswordChange}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
        >
          Update Password
        </button>
      </form>

      {/* Two-Factor Authentication */}
      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FiShield className="text-indigo-500" />
            <span className="font-medium">Two-Factor Authentication</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={twoFactor}
              onChange={() => setTwoFactor(!twoFactor)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Enable two-factor authentication for enhanced security.
        </p>
      </div>
    </div>
  );
};

export default SecuritySettings;