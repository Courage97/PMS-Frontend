import { useEffect, useState } from "react";
import api from "../../api";
import { Users, CheckCircle, AlertTriangle, Trash2, Search, Filter } from "lucide-react";
import { LogOut, Calendar, Settings, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";

const ManageUser = () => {
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [info, setInfo] = useState({username: '', role: ''});
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [selectedTeamFilter, setSelectedTeamFilter] = useState("all");
  
  // Filter users based on search query and team filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTeam = selectedTeamFilter === "all" || 
                       (user.teams && user.teams.some(team => team.id.toString() === selectedTeamFilter));
    
    return matchesSearch && matchesTeam;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("access");
        const response = await api.get("/users/me/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && response.data.username && response.data.role) {
          setInfo(response.data);
        } else {
          throw new Error("Invalid user data format");
        }
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch user details");
      }
    };

    fetchUserDetails();
  }, []);

  const fetchUsersAndTeams = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("access");

      const usersResponse = await api.get("/users/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const usersWithTeams = usersResponse.data.map((user) => ({
        ...user,
        teams: user.teams || [],
      }));

      const teamsResponse = await api.get("/teams/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(usersWithTeams);
      setTeams(teamsResponse.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersAndTeams();
  }, []);

  const assignUserToTeam = async (user_id, team_id) => {
    setError("");
    setSuccessMessage("");

    team_id = Number(team_id);

    const user = users.find((u) => u.id === user_id);
    if (user?.teams?.length >= 2) {
      setError("A user cannot be assigned to more than two teams.");
      return;
    }

    try {
      const token = localStorage.getItem("access");
      await api.post(
        `/membership/`,
        { user_id, team_id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccessMessage("User assigned to team successfully.");
      showToast("User assigned to team successfully");

      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === user_id
            ? {
                ...u,
                teams: [...(u.teams || []), teams.find((t) => t.id === team_id)],
              }
            : u
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to assign user to team.");
    }
  };

  const removeUserFromTeam = async (user_id, team_id) => {
    setError("");
    setSuccessMessage("");
    try {
      const token = localStorage.getItem("access");
      await api.delete(`/membership/`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { user_id, team_id },
      });

      setSuccessMessage("User removed from team successfully.");
      showToast("User removed from team successfully");

      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === user_id
            ? {
                ...u,
                teams: (u.teams || []).filter((t) => t.id !== team_id),
              }
            : u
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove user from team.");
    }
  };

  const showToast = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  // Generate a gradient color based on username
  const generateGradient = (username) => {
    if (!username) return "from-[#4CAF50] to-[#2196F3]";
    
    const firstChar = username.charCodeAt(0) % 5;
    const gradients = [
      "from-[#4CAF50] to-[#2196F3]", // Original green to blue
      "from-[#43A047] to-[#1E88E5]", // Slightly darker
      "from-[#2E7D32] to-[#1565C0]", // Even darker
      "from-[#66BB6A] to-[#42A5F5]", // Lighter
      "from-[#81C784] to-[#64B5F6]"  // Even lighter
    ];
    
    return gradients[firstChar];
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo with gradient */}
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold bg-gradient-to-r from-[#4CAF50] to-[#2196F3] text-transparent bg-clip-text">
                ManageIQ
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-5">
              {/* Date and Time */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="hidden md:flex items-center gap-2 text-gray-600"
              >
                <Calendar className="h-4 w-4 text-[#4CAF50]" />
                <span className="text-sm font-medium">
                  {currentTime.toLocaleDateString()} {currentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </motion.div>

              {/* Notifications */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <button 
                  className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
                  onClick={() => setShowNotification(!showNotification)}
                >
                  <Bell className="h-5 w-5 text-[#2196F3]" />
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-[#4CAF50]"></span>
                </button>
                {showNotification && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg p-4 border border-gray-100 z-50">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-semibold text-gray-800">Notifications</h3>
                      <span className="text-xs text-[#4CAF50] font-medium">Mark all as read</span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded-lg">
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                          <Users className="h-4 w-4 text-[#4CAF50]" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-800">New user joined Team Alpha</p>
                          <p className="text-xs text-gray-500">5 minutes ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Settings */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <Settings className="h-5 w-5 text-[#2196F3]" />
              </motion.button>

              {/* User Profile */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-3"
              >
                <div className="relative">
                  <div className={`h-9 w-9 rounded-full bg-gradient-to-r from-[#4CAF50] to-[#2196F3] flex items-center justify-center text-white font-bold`}>
                    {info.username ? info.username.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white"></div>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-semibold text-gray-800">{info.username}</p>
                  <p className="text-xs bg-gradient-to-r from-[#4CAF50] to-[#2196F3] text-transparent bg-clip-text font-medium">
                    {info.role}
                  </p>
                </div>
              </motion.div>

              {/* Logout Button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/logout"
                  className="p-2 md:px-4 md:py-2 bg-gradient-to-r from-[#4CAF50] to-[#2196F3] text-white rounded-full hover:shadow-md transition-all flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden md:inline text-sm font-medium">Logout</span>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header with gradient background */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 bg-gradient-to-r from-[#E8F5E9] to-[#E3F2FD] p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white rounded-full shadow-sm">
              <Users className="h-8 w-8 text-[#4CAF50]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">User Management</h1>
              <p className="text-gray-600">View and manage team assignments for all users</p>
            </div>
          </div>
        </motion.div>

        {/* Controls and Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Search and Filters */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2 bg-white p-4 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-[#4CAF50]" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2.5 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50] text-gray-800"
              />
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between"
          >
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-[#4CAF50] to-[#2196F3] text-transparent bg-clip-text">{users.length}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <Users className="h-6 w-6 text-[#4CAF50]" />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between"
          >
            <div>
              <p className="text-sm text-gray-500">Total Teams</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-[#4CAF50] to-[#2196F3] text-transparent bg-clip-text">{teams.length}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Users className="h-6 w-6 text-[#2196F3]" />
            </div>
          </motion.div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-center space-x-3 mb-6"
          >
            <AlertTriangle className="text-red-500 w-5 h-5" />
            <p className="text-red-700">{error}</p>
          </motion.div>
        )}
        
        {successMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed bottom-5 right-5 bg-gradient-to-r from-[#4CAF50] to-[#2196F3] text-white p-4 rounded-lg shadow-lg flex items-center space-x-3 z-50"
          >
            <CheckCircle className="text-white w-5 h-5" />
            <p>{successMessage}</p>
          </motion.div>
        )}

        {/* Actions Row */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex items-center space-x-4 mb-6"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
          >
            <Filter className="h-4 w-4 text-[#4CAF50]" />
            <span>Filter</span>
          </motion.button>
          
          <select 
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
            value={selectedTeamFilter}
            onChange={(e) => setSelectedTeamFilter(e.target.value)}
          >
            <option value="all">All Teams</option>
            {teams.map(team => (
              <option key={team.id} value={team.id}>{team.name}</option>
            ))}
          </select>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-5 animate-pulse">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="h-3 bg-gray-200 rounded w-full mb-3"></div>
                <div className="h-10 bg-gray-200 rounded mb-4"></div>
                <div className="flex justify-between">
                  <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* User List */}
        {!loading && !error && filteredUsers.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * (index % 6) }}
                className="bg-white rounded-xl shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300"
              >
                {/* Colored top bar based on user name */}
                <div className={`h-2 w-full bg-gradient-to-r ${generateGradient(user.name)}`}></div>
                
                <div className="p-5">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`bg-gradient-to-br ${generateGradient(user.name)} h-12 w-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm`}>
                        {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-[#4CAF50] transition-colors">
                          {user.name}
                        </h3>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                      <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
                    </div>
                  </div>

                  {/* Role Badge */}
                  <div className="mb-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-[#E8F5E9] to-[#E3F2FD] text-[#4CAF50]">
                      {user.role || "Member"}
                    </span>
                  </div>

                  {/* Divider */}
                  <div className="h-px w-full bg-gray-100 my-4"></div>

                  {/* Display Assigned Teams */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-600 mb-2">Assigned Teams:</p>
                    {user.teams?.length > 0 ? (
                      <div className="space-y-2">
                        {(user.teams || []).map((team) => (
                          <div key={team.id} className="flex justify-between items-center p-2 rounded-lg border border-gray-100 bg-gradient-to-r from-[#F1F8E9] to-[#E1F5FE] group/team hover:shadow-sm transition-all">
                            <div className="flex items-center space-x-2">
                              <div className="h-6 w-6 rounded-full bg-white flex items-center justify-center shadow-sm">
                                <Users className="h-3 w-3 text-[#2196F3]" />
                              </div>
                              <span className="text-sm font-medium text-gray-700">{team.name}</span>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.1, rotate: 10 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => removeUserFromTeam(user.id, team.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50 opacity-0 group-hover/team:opacity-100"
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                        <p className="text-sm text-gray-500 italic">No teams assigned</p>
                      </div>
                    )}
                  </div>

                  {/* Team Assignment */}
                  <div className="mt-4">
                    <label className="text-sm font-medium text-gray-600 mb-2 block">
                      Assign to Team:
                    </label>
                    <select
                      onChange={(e) => assignUserToTeam(user.id, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#4CAF50] bg-white"
                      disabled={user.teams?.length >= 2}
                    >
                      <option value="">Select a team</option>
                      {teams.map((team) => (
                        <option key={team.id} value={team.id}>
                          {team.name}
                        </option>
                      ))}
                    </select>
                    {user.teams?.length >= 2 && (
                      <p className="text-xs text-amber-600 mt-1 flex items-center">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-500 mr-1"></span>
                        Maximum of 2 teams reached
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredUsers.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-sm flex flex-col items-center justify-center py-16 px-4"
          >
            <div className="h-20 w-20 rounded-full bg-gray-50 flex items-center justify-center mb-4">
              <Users className="text-gray-300 w-10 h-10" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No users found</h3>
            <p className="text-gray-500 text-center max-w-md mb-6">
              {searchQuery ? `No users matching "${searchQuery}"` : "There are no users in the system yet."}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ManageUser;