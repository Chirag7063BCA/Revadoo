import { FiCamera } from "react-icons/fi";

const ProfileHeader = () => {
  // In a real app, fetch admin data from context/API
  const admin = {
    name: "Admin User",
    email: "admin@example.com",
    role: "Super Administrator",
    avatar: "https://via.placeholder.com/100",
    lastLogin: new Date().toLocaleString(),
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
      <div className="relative">
        <img
          src={admin.avatar}
          alt={admin.name}
          className="w-24 h-24 rounded-full object-cover border-4 border-indigo-100"
        />
        <button className="absolute bottom-0 right-0 bg-indigo-600 text-white p-1.5 rounded-full hover:bg-indigo-700">
          <FiCamera className="w-4 h-4" />
        </button>
      </div>
      <div className="flex-1 text-center md:text-left">
        <h1 className="text-2xl font-bold text-gray-800">{admin.name}</h1>
        <p className="text-indigo-600 font-medium">{admin.role}</p>
        <p className="text-gray-500 text-sm mt-1">{admin.email}</p>
        <p className="text-xs text-gray-400 mt-2">Last login: {admin.lastLogin}</p>
      </div>
    </div>
  );
};

export default ProfileHeader;