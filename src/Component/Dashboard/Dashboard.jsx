import { useState, useEffect } from 'react';
import { motion } from 'framer-motion'; // Import framer-motion
import TeamListPreview from './TeamListPreview';
import ManageUserPreview from './ManageUserPreview';
import CreateTeamPreview from './CreateTeamPreview';
import DataSummary from './DataSummary';
import { LogOut, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import TaskListPreview from "../../Component/Task Management/TaskListPreview";
import Notifications from './Notifications';
import api from '../../api';

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [info, setInfo] = useState({username: '', role: ''})
  const [error, setError] = useState("")

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
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Animation variants for cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    hover: { scale: 1.02, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)" },
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Title with gradient */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#2196F3] to-[#4CAF50] text-transparent bg-clip-text">
            Dashboard
          </h1>
        </div>

        {/* Dashboard Grid Layout with improved card styling */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Team List and Task List Section */}
          <div className="lg:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 p-6 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-b from-[#4CAF50]/10 to-transparent rounded-bl-full"></div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Team Members</h2>
              <TeamListPreview />
            </motion.div>
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 p-6 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-b from-[#2196F3]/10 to-transparent rounded-bl-full"></div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Tasks</h2>
              <TaskListPreview />
            </motion.div>
          </div>

          {/* Create Team Section */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 p-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-b from-[#4CAF50]/10 to-transparent rounded-bl-full"></div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Create Team</h2>
            <CreateTeamPreview />
          </motion.div>

          {/* Real-time Updates Section */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 p-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-b from-[#4CAF50]/10 to-transparent rounded-bl-full"></div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Real-time Updates</h2>
            <Notifications />
          </motion.div>

          {/* Manage Users Preview Section */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 p-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-b from-[#4CAF50]/10 to-transparent rounded-bl-full"></div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Manage Users</h2>
            <ManageUserPreview />
          </motion.div>

          {/* Data Visualization Section */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            className="lg:col-span-3 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 p-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-b from-[#2196F3]/10 to-transparent rounded-bl-full"></div>
            <DataSummary />
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;