import { useEffect, useState } from "react";
import api from '../../api'; 
import { motion } from 'framer-motion';
import { LogOut, Calendar, Clock, Users, RefreshCw, PlusCircle, MoreVertical, AlertTriangle, Search, Filter, User, ChevronRight } from 'lucide-react';
import { Link } from 'react-router';

const TeamList = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [info, setInfo] = useState({username: '', role: ''});

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header with glassmorphism */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold bg-gradient-to-r from-[#4CAF50] to-[#2196F3] text-transparent bg-clip-text">
                ManageIQ
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* Date Time */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md bg-white shadow-sm border border-gray-100"
              >
                <Calendar className="h-4 w-4 text-[#4CAF50]" />
                <span className="text-xs font-medium text-gray-600">
                  {currentTime.toLocaleString()}
                </span>
              </motion.div>

              {/* User Profile */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-3 px-3 py-1.5 rounded-md bg-white shadow-sm border border-gray-100"
              >
                <div className="relative">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#4CAF50] to-[#2196F3] flex items-center justify-center text-white font-bold">
                    {info.username ? info.username.charAt(0).toUpperCase() : "U"}
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
                  className="p-2 md:px-4 md:py-1.5 bg-gradient-to-r from-[#4CAF50] to-[#2196F3] text-white rounded-md hover:shadow-lg transition-all flex items-center gap-2 font-medium text-sm"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden md:inline">Logout</span>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Page Title & Actions Bar */}
        <div className="bg-white rounded-xl shadow-sm mb-6 p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Team Management</h2>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Search */}
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search teams..." 
                  className="pl-10 pr-4 py-2 w-full sm:w-64 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200" 
                >
                  <Filter className="h-5 w-5" />
                </motion.button>
                
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={fetchTeams} 
                  disabled={loading}
                  className="p-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 disabled:opacity-50"
                >
                  <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
                </motion.button>
                
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-gradient-to-r from-[#4CAF50] to-[#2196F3] text-white rounded-lg hover:shadow-md"
                >
                  <PlusCircle className="h-5 w-5" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6 shadow-sm"
          >
            <div className="flex items-center space-x-3">
              <AlertTriangle className="text-red-500 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="relative">
              <div className="h-16 w-16 rounded-full border-4 border-gray-200"></div>
              <div className="h-16 w-16 rounded-full border-4 border-t-green-500 border-r-transparent border-b-transparent border-l-transparent animate-spin absolute top-0"></div>
            </div>
          </div>
        )}

        {/* Team List */}
        {!loading && !error && (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {teams.map((team) => (
              <motion.div 
                key={team.id}
                variants={itemVariants}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className="h-2 bg-gradient-to-r from-[#4CAF50] to-[#2196F3]"></div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-gray-800">{team.name}</h3>
                    <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {team.description || "No description available"}
                  </p>
                  
                  <div className="flex items-center mb-4">
                    <div className="flex -space-x-2">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-8 w-8 rounded-full bg-gray-200 ring-2 ring-white flex items-center justify-center">
                          <User className="h-4 w-4 text-gray-500" />
                        </div>
                      ))}
                    </div>
                    <div className="ml-2 text-xs text-gray-500">
                      {team.member_count || 3} members
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 text-xs text-gray-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{formatDate(team.created_at)}</span>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-1 text-xs font-medium text-[#4CAF50] hover:text-[#2196F3] transition-colors"
                    >
                      <span>View Details</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && !error && teams.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-12 text-center"
          >
            <div className="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No teams found</h3>
            <p className="text-gray-500 text-sm mb-6">Create your first team to start collaborating</p>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2.5 bg-gradient-to-r from-[#4CAF50] to-[#2196F3] text-white rounded-lg hover:shadow-md inline-flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Create Team</span>
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TeamList;