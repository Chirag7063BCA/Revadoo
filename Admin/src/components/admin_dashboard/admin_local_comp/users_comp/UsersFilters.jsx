import { FiSearch } from "react-icons/fi";

const UsersFilters = () => {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-wrap items-center gap-4">
      <div className="flex-1 min-w-[200px] relative">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search users..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <select className="px-4 py-2 border rounded-lg bg-white">
        <option>All Roles</option>
        <option>User</option>
        <option>Admin</option>
      </select>
      <select className="px-4 py-2 border rounded-lg bg-white">
        <option>All Status</option>
        <option>Active</option>
        <option>Inactive</option>
        <option>Banned</option>
      </select>
    </div>
  );
};

export default UsersFilters;