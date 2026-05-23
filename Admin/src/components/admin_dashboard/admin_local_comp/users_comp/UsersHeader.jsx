const UsersHeader = () => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold text-gray-800">Manage Users</h1>
      <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
        + Add New User
      </button>
    </div>
  );
};

export default UsersHeader;