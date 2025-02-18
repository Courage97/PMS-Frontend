import { useEffect, useState } from "react";
import api from '../../api'; 
import { motion } from 'framer-motion'; // Import framer-motion
import { LogOut, Calendar } from 'lucide-react';
import { Link } from 'react-router';
import { 
  Clock, 
  Users, 
  RefreshCw, 
  PlusCircle, 
  MoreVertical, 
  AlertTriangle 
} from 'lucide-react';

const TeamList = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [info, setInfo] = useState({username: '', role: ''})


  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);


  const fetchTeams = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("access");
      const response = await api.get("/teams/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeams(response.data.reverse());
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch teams. Please try again later");
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    fetchTeams();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  return (
    <div className="bg-white p-6 rounded-xl">
      {/* Header */}
      {/* Header with glassmorphism effect */}
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
          <Users className="text-green-600" />
          <h2 className="text-2xl font-bold text-gray-800">Team List</h2>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={fetchTeams} 
            disabled={loading}
            className="text-gray-600 hover:text-green-600 disabled:opacity-50"
          >
            <RefreshCw className={loading ? 'animate-spin' : ''} />
          </button>
          <button className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600">
            <PlusCircle />
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg flex items-center space-x-3 mb-4">
          <AlertTriangle className="text-red-500" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-pulse w-12 h-12 bg-green-500 rounded-full"></div>
        </div>
      )}

      {/* Team List */}
      {!loading && !error && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <div 
              key={team.id} 
              className="bg-white border border-gray-100 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-800">{team.name}</h3>
                  <button className="text-gray-500 hover:text-gray-800">
                    <MoreVertical />
                  </button>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {team.description || "No description available"}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Created: {formatDate(team.created_at)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && teams.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Users className="mx-auto w-16 h-16 text-gray-400 mb-4" />
          <p className="text-gray-600">No teams found. Create your first team!</p>
        </div>
      )}
    </div>
  );
};

export default TeamList;