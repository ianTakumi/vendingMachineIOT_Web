import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Users as UsersIcon,
  User,
  CreditCard,
  Edit,
  RefreshCw,
  X,
  Plus,
  Hash,
  Wallet,
  Calendar,
} from "lucide-react";
import client from "../utils/axiosInstance";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [editFormData, setEditFormData] = useState({
    name: "",
    rfid_tag: "",
    credits: 0,
  });

  // Fetch users from API
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await client.get("/users");

      console.log("Users API Response:", response.data);

      // Map API response to our expected format
      const formattedUsers = response.data.data.map((user) => ({
        id: user._id,
        name: user.name,
        rfid_tag: user.rfid_tag,
        credits: user.credits || 0,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }));

      setUsers(formattedUsers);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to fetch users. Please try again.");

      toast.error("Failed to fetch users. Please try again.", {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Open edit modal
  const handleOpenEditModal = (user) => {
    setEditingUser(user);
    setEditFormData({
      name: user.name,
      rfid_tag: user.rfid_tag,
      credits: user.credits,
    });
    setShowEditModal(true);
  };

  // Close edit modal
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingUser(null);
    setEditFormData({
      name: "",
      rfid_tag: "",
      credits: 0,
    });
  };

  // Handle edit form input changes
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: name === "credits" ? Number(value) || 0 : value,
    }));
  };

  // Save updated user
  const handleSaveUpdate = async () => {
    if (!editFormData.name || !editFormData.rfid_tag) {
      toast.warning("Please fill in name and RFID tag fields", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    // Validate credits (non-negative)
    if (editFormData.credits < 0) {
      toast.warning("Credits cannot be negative", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      const response = await client.put(`/users/${editingUser.id}`, {
        name: editFormData.name,
        rfid_tag: editFormData.rfid_tag,
        credits: editFormData.credits,
      });

      console.log("Update response:", response.data);

      // Update the user in state
      setUsers((prev) =>
        prev.map((user) =>
          user.id === editingUser.id
            ? {
                ...user,
                name: response.data.data.name,
                rfid_tag: response.data.data.rfid_tag,
                credits: response.data.data.credits,
                updatedAt: response.data.data.updatedAt,
              }
            : user
        )
      );

      // Close modal
      handleCloseEditModal();

      toast.success("User updated successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      console.error("Error updating user:", err);
      console.error("Error details:", err.response?.data);

      toast.error(
        err.response?.data?.message ||
          "Failed to update user. Please try again.",
        {
          position: "top-right",
          autoClose: 5000,
        }
      );
    }
  };

  // Add credits to user
  const handleAddCredits = async (userId, currentCredits) => {
    const creditsToAdd = prompt(
      `Enter credits to add for user ${userId.substring(0, 8)}...`,
      "10"
    );

    if (!creditsToAdd || isNaN(creditsToAdd) || Number(creditsToAdd) <= 0) {
      toast.warning("Please enter a valid positive number", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      const user = users.find((u) => u.id === userId);
      const newCredits = Number(currentCredits) + Number(creditsToAdd);

      const response = await client.put(`/users/${userId}`, {
        name: user.name,
        rfid_tag: user.rfid_tag,
        credits: newCredits,
      });

      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId
            ? {
                ...user,
                credits: newCredits,
                updatedAt: new Date().toISOString(),
              }
            : user
        )
      );

      toast.success(`Added ${creditsToAdd} credits to user!`, {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      console.error("Error adding credits:", err);

      toast.error("Failed to add credits. Please try again.", {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Calculate totals
  const totalUsers = users.length;
  const totalCredits = users.reduce((sum, user) => sum + user.credits, 0);
  const averageCredits =
    totalUsers > 0 ? (totalCredits / totalUsers).toFixed(2) : 0;

  const getCreditColor = (credits) => {
    return credits >= 50
      ? "text-green-600"
      : credits >= 20
      ? "text-yellow-600"
      : "text-red-600";
  };

  if (loading) {
    return (
      <>
        <ToastContainer />
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading users...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              User Management
            </h1>
            <p className="text-gray-600 mt-1">Manage users and their credits</p>
          </div>
          <div className="mt-4 lg:mt-0">
            <button
              onClick={fetchUsers}
              className="btn btn-secondary flex items-center space-x-2"
              title="Refresh users"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh Users</span>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <User className="h-5 w-5 text-red-400 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
              </div>
              <UsersIcon className="h-10 w-10 text-blue-500" />
            </div>
            <div className="mt-2 flex items-center">
              <User className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-xs text-green-600">
                {totalUsers} registered users
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Credits</p>
                <p className="text-2xl font-bold text-green-600">
                  ₱{totalCredits.toLocaleString()}
                </p>
              </div>
              <Wallet className="h-10 w-10 text-green-500" />
            </div>
            <div className="mt-2 text-xs text-gray-500">Across all users</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Credits</p>
                <p className="text-2xl font-bold text-purple-600">
                  ₱{averageCredits}
                </p>
              </div>
              <CreditCard className="h-10 w-10 text-purple-500" />
            </div>
            <div className="mt-2 text-xs text-gray-500">Per user average</div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    RFID Tag
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Credits
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <div className="font-medium text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: {user.id.substring(0, 8)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Hash className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                          {user.rfid_tag}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <CreditCard
                          className={`h-4 w-4 mr-2 ${getCreditColor(
                            user.credits
                          )}`}
                        />
                        <span
                          className={`font-bold ${getCreditColor(
                            user.credits
                          )}`}
                        >
                          ₱{user.credits}
                        </span>
                      </div>
                      <div className="w-32 h-1.5 bg-gray-200 rounded-full overflow-hidden mt-1">
                        <div
                          className={`h-full ${
                            user.credits >= 50
                              ? "bg-green-500"
                              : user.credits >= 20
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{
                            width: `${Math.min(
                              (user.credits / 100) * 100,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                        {formatDate(user.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                        {formatDate(user.updatedAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {/* <button
                          onClick={() =>
                            handleAddCredits(user.id, user.credits)
                          }
                          className="p-1 text-blue-600 hover:text-blue-900 rounded hover:bg-blue-50"
                          title="Add Credits"
                        >
                          <Plus className="h-4 w-4" />
                        </button> */}
                        <button
                          onClick={() => handleOpenEditModal(user)}
                          className="p-1 text-green-600 hover:text-green-900 rounded hover:bg-green-50"
                          title="Edit User"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {users.length === 0 && (
            <div className="text-center py-12">
              <UsersIcon className="h-12 w-12 text-gray-400 mx-auto" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                No users found
              </h3>
              <p className="mt-1 text-gray-500">
                Users will appear here when registered
              </p>
            </div>
          )}
        </div>

        {/* EDIT MODAL */}
        {showEditModal && editingUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Edit User</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Update user details and credits
                  </p>
                </div>
                <button
                  onClick={handleCloseEditModal}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="User name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    RFID Tag
                  </label>
                  <input
                    type="text"
                    name="rfid_tag"
                    value={editFormData.rfid_tag}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    placeholder="RFID tag number"
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Credits (₱)
                  </label>
                  <input
                    type="number"
                    name="credits"
                    value={editFormData.credits}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                    min="0"
                    step="1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Available balance for purchases
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex space-x-3 p-6 border-t">
                <button
                  onClick={handleCloseEditModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveUpdate}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Users;
