import React, { useState, useEffect } from 'react';
import apiClient from '../services/api';
import AnimatedBackground from '../components/AnimatedBackground';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingUserId, setEditingUserId] = useState(null);
  const [newRole, setNewRole] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userData = await apiClient.getAllUsers();
        setUsers(userData);
      } catch (err) {
        setError('Failed to fetch users');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, currentRole) => {
    setEditingUserId(userId);
    setNewRole(currentRole);
  };

  const saveRoleChange = async (userId) => {
    try {
      const updatedUser = await apiClient.updateUserRole(userId, newRole);
      setUsers(users.map(user =>
        user._id === userId ? updatedUser : user
      ));
      setEditingUserId(null);
      setNewRole('');
    } catch (err) {
      setError('Failed to update user role');
      console.error(err);
    }
  };

  const cancelEdit = () => {
    setEditingUserId(null);
    setNewRole('');
  };

  if (loading) {
    return (
      <AnimatedBackground>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
        </div>
      </AnimatedBackground>
    );
  }

  return (
    <AnimatedBackground>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
          <p className="text-gray-300 text-lg">Manage user accounts and permissions</p>
        </div>

        {error && (
          <div className="mb-6 glass-card p-4 border border-red-500/30">
            <div className="text-red-300">
              {error}
            </div>
          </div>
        )}

        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10">
              <thead className="bg-white/5">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    College
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-white/5 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {user.avatarUrl ? (
                            <img className="h-10 w-10 rounded-full" src={user.avatarUrl} alt={user.name} />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">{user.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {user.college}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingUserId === user._id ? (
                        <div className="flex items-center">
                          <select
                            value={newRole}
                            onChange={(e) => setNewRole(e.target.value)}
                            className="px-2 py-1 bg-white/10 border border-white/20 text-white rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="student" className="bg-slate-800">Student</option>
                            <option value="teacher" className="bg-slate-800">Teacher</option>
                            <option value="admin" className="bg-slate-800">Admin</option>
                          </select>
                        </div>
                      ) : (
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                            user.role === 'teacher' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                              'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          }`}>
                          {user.role}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {editingUserId === user._id ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => saveRoleChange(user._id)}
                            className="text-green-400 hover:text-green-300 transition-colors duration-200"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="text-gray-400 hover:text-gray-300 transition-colors duration-200"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleRoleChange(user._id, user.role)}
                          className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                        >
                          Edit Role
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AnimatedBackground>
  );
};

export default UserManagementPage;