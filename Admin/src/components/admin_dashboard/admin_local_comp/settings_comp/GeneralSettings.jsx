import { useState } from "react";

const GeneralSettings = () => {
  const [siteName, setSiteName] = useState("MyEarn Platform");
  const [siteUrl, setSiteUrl] = useState("https://example.com");
  const [registrationEnabled, setRegistrationEnabled] = useState(true);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">General Settings</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
          <input
            type="text"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Site URL</label>
          <input
            type="url"
            value={siteUrl}
            onChange={(e) => setSiteUrl(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="registration"
            checked={registrationEnabled}
            onChange={(e) => setRegistrationEnabled(e.target.checked)}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="registration" className="ml-2 block text-sm text-gray-900">
            Allow new user registration
          </label>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;