import { useEffect, useState } from "react";
import api from '../../api';
import { PieChart, Pie, Tooltip, Cell, BarChart, Bar, XAxis, YAxis, LineChart, Line, CartesianGrid, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { LogOut, Calendar } from 'lucide-react';
import { Link } from 'react-router';

const Data = () => {
  const [taskStatusData, setTaskStatusData] = useState([]);
  const [priorityData, setPriorityData] = useState([]);
  const [assignedTypeData, setAssignedTypeData] = useState([]);
  const [completionData, setCompletionData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [info, setInfo] = useState({username: '', role: ''})

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

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('access');
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [taskStatus, priority, assignedType, completion] = await Promise.all([
          api.get("task_status/", { headers }),
          api.get("task_priority/", { headers }),
          api.get("assigned_type/", { headers }),
          api.get("task_completion/", { headers }),
        ]);

        setTaskStatusData(taskStatus.data);
        setPriorityData(priority.data);
        setAssignedTypeData(assignedType.data);
        setCompletionData(completion.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.response?.data?.message || "Failed to load chart data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const colors = [
    "#FF6B6B", // Coral Red
    "#4ECDC4", // Turquoise
    "#FFD93D", // Bright Yellow
    "#6C5CE7"  // Purple
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const chartConfig = {
    style: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '8px',
      border: 'none',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      padding: '8px'
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2 text-lg font-medium">Loading visualizations...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-lg font-medium bg-red-50 px-4 py-2 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
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
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Data Visualization Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
          className="h-[500px]"
        >
          <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 h-full">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Task Status Distribution</h2>
            <div className="w-full h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={taskStatusData} 
                    dataKey="count" 
                    nameKey="status" 
                    cx="50%" 
                    cy="50%" 
                    outerRadius="80%" 
                    fill="#8884d8"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={true}
                    animationDuration={1500}
                  >
                    {taskStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={chartConfig.style} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
          className="h-[500px]"
        >
          <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 h-full">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Task Priority Distribution</h2>
            <div className="w-full h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priorityData}>
                  <XAxis dataKey="priority" />
                  <YAxis />
                  <Bar 
                    dataKey="count" 
                    fill={colors[1]}
                    animationDuration={1500}
                    radius={[4, 4, 0, 0]}
                  />
                  <Tooltip contentStyle={chartConfig.style} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
          className="h-[500px]"
        >
          <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 h-full">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Task Assignment Distribution</h2>
            <div className="w-full h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={assignedTypeData} 
                    dataKey="count" 
                    nameKey="assigned_type" 
                    cx="50%" 
                    cy="50%" 
                    outerRadius="80%" 
                    innerRadius="55%" 
                    fill="#8884d8"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={true}
                    animationDuration={1500}
                  >
                    {assignedTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={chartConfig.style} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
          className="h-[500px]"
        >
          <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 h-full">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Task Completion Trend</h2>
            <div className="w-full h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={completionData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                  <Tooltip contentStyle={chartConfig.style} />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke={colors[3]}
                    strokeWidth={2}
                    dot={{ fill: colors[3], strokeWidth: 2 }}
                    activeDot={{ r: 8 }}
                    animationDuration={1500}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Data;