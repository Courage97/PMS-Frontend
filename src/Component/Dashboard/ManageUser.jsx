import { useEffect, useState } from "react";
import api from "../../api";
import { Users, CheckCircle, AlertTriangle, Trash2 } from "lucide-react";
import { LogOut, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from "framer-motion"; // Added for animations
const ManageUser = () => {
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [info, setInfo] = useState({username: '', role: ''})
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
       // Fetch the logged-in user's details
        const response = await api.get("/users/me/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Ensure the response matches the expected structure
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



  // Fetch users and teams from API
  const fetchUsersAndTeams = async () => {

    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("access");

      // Fetch users
      const usersResponse = await api.get("/users/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Ensure each user has a `teams` property (default to empty array if missing)
      const usersWithTeams = usersResponse.data.map((user) => ({
        ...user,
        teams: user.teams || [], // Default to empty array if `teams` is missing
      }));

      // Fetch teams
      const teamsResponse = await api.get("/teams/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(usersWithTeams); // Use the updated users array
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

  // Assign user to a team (Max 2 teams per user)
  const assignUserToTeam = async (user_id, team_id) => {
    setError("");
    setSuccessMessage("");

    // Convert team_id to a number (since e.target.value returns a string)
    team_id = Number(team_id);

    // Find user and check assigned teams
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

      // Update user state immediately without refetching
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === user_id
            ? {
                ...u,
                teams: [...(u.teams || []), teams.find((t) => t.id === team_id)], // Safely spread `u.teams`
              }
            : u
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to assign user to team.");
    }
  };

  // Remove user from a team
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

      // Update state immediately without refetching
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === user_id
            ? {
                ...u,
                teams: (u.teams || []).filter((t) => t.id !== team_id), // Safely filter `u.teams`
              }
            : u
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove user from team.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
<motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-transparent backdrop-blur-md shadow-lg sticky top-0 z-50 border-b rounded-lg border-gray-400"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Brand Logo with gradient */}
            <div className="flex items-center space-x-2">
              <div className="text-3xl font-bold bg-gradient-to-r from-[#4CAF50] to-[#2196F3] text-transparent bg-clip-text">
                ManageIQ
              </div>
            </div>

            {/* Right Section with improved styling */}
            <div className="flex items-center space-x-8">
              {/* Date and Time with gradient border */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white shadow-sm border border-gray-100"
              >
                <Calendar className="h-5 w-5 text-[#4CAF50]" />
                <span className="text-sm font-medium text-gray-700">
                  {currentTime.toLocaleString()}
                </span>
              </motion.div>

              {/* User Profile Section with gradient border */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-4 px-4 py-2 rounded-lg bg-white shadow-sm border border-gray-100"
              >
                <div className="relative">
                  <img
                    src={info.profile_picture}
                    alt="Profile"
                    className="h-10 w-10 rounded-full ring-2 ring-[#4CAF50] ring-offset-2"
                  />
                  <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></div>
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-800">{info.username}</p>
                  <p className="text-xs bg-gradient-to-r from-[#4CAF50] to-[#2196F3] text-transparent bg-clip-text font-medium">
                    {info.role}
                  </p>
                </div>
              </motion.div>

              {/* Gradient Logout Button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/logout"
                  className="px-6 py-2 bg-gradient-to-r from-[#4CAF50] to-[#2196F3] text-white rounded-full hover:shadow-lg transition-all flex items-center gap-2 font-medium"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.header>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <Users className="text-green-600 w-8 h-8" />
          <h2 className="text-2xl font-bold text-gray-800">Manage Users</h2>
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg flex items-center space-x-3 mb-4">
          <AlertTriangle className="text-red-500 w-5 h-5" />
          <p className="text-red-700">{error}</p>
        </div>
      )}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 p-4 rounded-lg flex items-center space-x-3 mb-4">
          <CheckCircle className="text-green-500 w-5 h-5" />
          <p className="text-green-700">{successMessage}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-xl shadow-md p-4 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-10 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      )}

      {/* User List */}
      {!loading && !error && users.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-white border border-gray-100 rounded-xl shadow-md p-4 hover:shadow-lg transition-all"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {user.name}
                </h3>
              </div>
              <p className="text-gray-600 mb-4">{user.email}</p>

              {/* Display Assigned Teams */}
              {user.teams?.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-600">Assigned Teams:</p>
                  <ul className="text-sm text-gray-800">
                    {(user.teams || []).map((team) => (
                      <li key={team.id} className="flex justify-between items-center">
                        <span>{team.name}</span>
                        <button
                          onClick={() => removeUserFromTeam(user.id, team.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Team Assignment */}
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Assign to Team:
                </label>
                <select
                  onChange={(e) => assignUserToTeam(user.id, e.target.value)}
                  className="w-full mt-2 p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                  disabled={user.teams?.length >= 2} // Disable if user is in 2 teams
                >
                  <option value="">Select a team</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
                {user.teams?.length >= 2 && (
                  <p className="text-sm text-red-600 mt-1">User cannot be assigned to more than 2 teams.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && users.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <Users className="text-gray-400 w-12 h-12 mb-4" />
          <p className="text-gray-600">No users found.</p>
        </div>
      )}
    </div>
  );
};

export default ManageUser;