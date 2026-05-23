import { useState, useCallback, useEffect, useMemo } from "react";
import {
  Search,
  ChevronDown,
  Eye,
  Ban,
  Trash2,
  AlertCircle,
} from "lucide-react";
import axios from "axios";
import UserDetailsModal from "./UserDetailsModal";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [, setIsSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("all");
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(5);

  const API_BASE_URL = "http://localhost:5000/api";
  const token = localStorage.getItem("token");

  const headers = useMemo(() => ({
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  }), [token]);

  // Fetch all users with pagination and filter
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/admin/users?page=${page}&limit=${limit}&status=${filterStatus}`,
        { headers },
      );
      if (response.data.success) {
        setUsers(response.data.data);
        setTotalPages(response.data.pagination.pages);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, [page, filterStatus, headers, limit]);

  // Load more users
  const handleShowMore = useCallback(async () => {
    setLoadingMore(true);
    setError(null);
    try {
      const nextPage = page + 1;
      const response = await axios.get(
        `${API_BASE_URL}/admin/users?page=${nextPage}&limit=${limit}&status=${filterStatus}`,
        { headers },
      );
      if (response.data.success) {
        setUsers((prev) => [...prev, ...response.data.data]);
        setPage(nextPage);
        setTotalPages(response.data.pagination.pages);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load more users");
    } finally {
      setLoadingMore(false);
    }
  }, [page, filterStatus, headers, limit]);

  // Search users by username
  const handleSearch = useCallback(
    async (query) => {
      setSearchQuery(query);

      if (!query.trim()) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const response = await axios.get(
          `${API_BASE_URL}/admin/users/search?q=${query}`,
          { headers },
        );
        if (response.data.success) {
          setSearchResults(response.data.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Search failed");
      } finally {
        setIsSearching(false);
      }
    },
    [headers],
  );

  // View user details
  const handleViewUser = async (userId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/admin/users/${userId}`,
        { headers },
      );
      if (response.data.success) {
        setSelectedUser(response.data.data);
        setIsModalOpen(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch user details");
    }
  };

  // Ban/Unban user
  const handleBanUser = async (userId) => {
    if (
      !window.confirm(
        "Are you sure you want to toggle ban status for this user?",
      )
    ) {
      return;
    }

    try {
      const response = await axios.put(
        `${API_BASE_URL}/admin/users/${userId}/ban`,
        {},
        { headers },
      );

      if (response.data.success) {
        // Refresh the user list
        if (searchQuery) {
          handleSearch(searchQuery);
        } else {
          fetchUsers();
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to ban user");
    }
  };

  // Delete user
  const handleDeleteUser = async (userId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      const response = await axios.delete(
        `${API_BASE_URL}/admin/users/${userId}`,
        { headers },
      );

      if (response.data.success) {
        // Refresh the user list
        if (searchQuery) {
          handleSearch(searchQuery);
        } else {
          fetchUsers();
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete user");
    }
  };

  // Load initial users
  useEffect(() => {
    if (!searchQuery) {
      setPage(1);
      setUsers([]);
      fetchUsers();
    }
  }, [filterStatus, fetchUsers, searchQuery]);

  // Fetch initial users on mount
  useEffect(() => {
    if (page === 1 && users.length === 0 && !searchQuery) {
      fetchUsers();
    }
  }, [fetchUsers, page, searchQuery, users.length]);

  const displayUsers = searchQuery ? searchResults : users;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">
            Search, view, ban, or delete user accounts
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="text-red-600 w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Search Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search users by username..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="banned">Banned</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-orange-500 border-t-transparent"></div>
          </div>
        ) : displayUsers.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-gray-500">
            <p>No users found</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Wallet
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {displayUsers.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      {user.username}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-gray-900">
                      ${user.wallet}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        user.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.status || "active"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <div className="flex gap-2">
                      <span className="text-xs">
                        {user.transactionCount || 0} Trans
                      </span>
                      <span className="text-xs">
                        {user.attemptCount || 0} Quiz
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleViewUser(user._id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleBanUser(user._id)}
                        className={`p-2 rounded-lg transition-colors ${
                          user.status === "banned"
                            ? "text-green-600 hover:bg-green-50"
                            : "text-yellow-600 hover:bg-yellow-50"
                        }`}
                        title={
                          user.status === "banned" ? "Unban user" : "Ban user"
                        }
                      >
                        <Ban className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete user"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Show More Button */}
      {!searchQuery && page < totalPages && displayUsers.length > 0 && (
        <div className="flex justify-center">
          <button
            onClick={handleShowMore}
            disabled={loadingMore}
            className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loadingMore ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Loading More Users...
              </>
            ) : (
              "Show More Users"
            )}
          </button>
        </div>
      )}

      {/* User Details Modal */}
      {isModalOpen && selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onBan={handleBanUser}
          onDelete={handleDeleteUser}
        />
      )}
    </div>
  );
};

export default UserManagement;
