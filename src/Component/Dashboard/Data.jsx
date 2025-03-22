import { useEffect, useState } from "react";
import api from '../../api';
import { PieChart, Pie, Tooltip, Cell, BarChart, Bar, XAxis, YAxis, LineChart, Line, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
import { Loader2, LogOut, Calendar } from 'lucide-react';
import { Link } from 'react-router';

const Data = () => {
  const [taskStatusData, setTaskStatusData] = useState([]);
  const [priorityData, setPriorityData] = useState([]);
  const [assignedTypeData, setAssignedTypeData] = useState([]);
  const [completionData, setCompletionData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [info, setInfo] = useState({username: '', role: ''});

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

  // Modern color palette
  const colors = [
    "#FF6B6B", // Coral Red
    "#4ECDC4", // Turquoise
    "#FFD93D", // Bright Yellow
    "#6C5CE7"  // Purple
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
        <span className="text-lg font-medium text-gray-700">Loading your dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-red-500 text-lg font-medium bg-red-50 px-6 py-4 rounded-lg shadow-sm border border-red-100">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with original gradient */}
      <header className="bg-transparent backdrop-blur-md shadow-lg sticky top-0 z-10 border-b rounded-lg border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Brand Logo with original gradient */}
            <div className="flex items-center space-x-2">
              <div className="text-3xl font-bold bg-gradient-to-r from-[#4CAF50] to-[#2196F3] text-transparent bg-clip-text">
                ManageIQ
              </div>
            </div>

            {/* Right Section with original styling */}
            <div className="flex items-center space-x-4">
              {/* Date and Time */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white shadow-sm border border-gray-100">
                <Calendar className="h-5 w-5 text-[#4CAF50]" />
                <span className="text-sm font-medium text-gray-700">
                  {currentTime.toLocaleString()}
                </span>
              </div>

              {/* User Profile Section */}
              <div className="flex items-center gap-4 px-4 py-2 rounded-lg bg-white shadow-sm border border-gray-100">
                <div className="relative">
                  <div className="h-10 w-10 rounded-full ring-2 ring-[#4CAF50] ring-offset-2 bg-gray-200 flex items-center justify-center overflow-hidden">
                    {info.profile_picture ? (
                      <img src={info.profile_picture} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-gray-700 font-medium">{info.username?.charAt(0) || 'U'}</span>
                    )}
                  </div>
                  <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></div>
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-800">{info.username}</p>
                  <p className="text-xs bg-gradient-to-r from-[#4CAF50] to-[#2196F3] text-transparent bg-clip-text font-medium">
                    {info.role}
                  </p>
                </div>
              </div>

              {/* Gradient Logout Button */}
              <div>
                <Link
                  to="/logout"
                  className="px-6 py-2 bg-gradient-to-r from-[#4CAF50] to-[#2196F3] text-white rounded-full hover:shadow-lg transition-all flex items-center gap-2 font-medium"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Data Visualization Dashboard</h2>
          <p className="text-gray-600 text-sm mt-1">Review task progress and distribution metrics</p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {taskStatusData.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <h4 className="text-xs font-medium text-gray-500 uppercase">Total Tasks</h4>
              <p className="text-2xl font-semibold mt-1">
                {taskStatusData.reduce((sum, item) => sum + item.count, 0)}
              </p>
            </div>
          )}
          
          {priorityData.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <h4 className="text-xs font-medium text-gray-500 uppercase">High Priority</h4>
              <p className="text-2xl font-semibold mt-1 text-[#FF6B6B]">
                {priorityData.find(item => item.priority === "High")?.count || 0}
              </p>
            </div>
          )}
          
          {completionData.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <h4 className="text-xs font-medium text-gray-500 uppercase">Last Month</h4>
              <p className="text-2xl font-semibold mt-1 text-[#4ECDC4]">
                {completionData[completionData.length - 1]?.count || 0}
              </p>
            </div>
          )}
          
          {assignedTypeData.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <h4 className="text-xs font-medium text-gray-500 uppercase">Unassigned</h4>
              <p className="text-2xl font-semibold mt-1 text-[#6C5CE7]">
                {assignedTypeData.find(item => item.assigned_type === "Unassigned")?.count || 0}
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Task Status Chart */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800">Task Status Distribution</h3>
              <p className="text-sm text-gray-500 mt-1">Current distribution of task statuses</p>
            </div>
            <div className="p-5 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={taskStatusData} 
                    dataKey="count" 
                    nameKey="status" 
                    cx="50%" 
                    cy="50%" 
                    outerRadius={100}
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {taskStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name, props) => [`${value} tasks`, props.payload.status]}
                    contentStyle={{ backgroundColor: 'white', border: '1px solid #f0f0f0', borderRadius: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
                  />
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Task Priority Chart */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800">Task Priority Distribution</h3>
              <p className="text-sm text-gray-500 mt-1">Distribution by priority level</p>
            </div>
            <div className="p-5 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priorityData} barSize={60} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <XAxis 
                    dataKey="priority" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(value) => [`${value} tasks`, 'Count']}
                    contentStyle={{ backgroundColor: 'white', border: '1px solid #f0f0f0', borderRadius: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
                  />
                  <Bar 
                    dataKey="count" 
                    fill={colors[1]}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Task Assignment Chart */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800">Task Assignment Distribution</h3>
              <p className="text-sm text-gray-500 mt-1">Tasks by assignment type</p>
            </div>
            <div className="p-5 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={assignedTypeData} 
                    dataKey="count" 
                    nameKey="assigned_type" 
                    cx="50%" 
                    cy="50%" 
                    outerRadius={100}
                    innerRadius={60}
                    labelLine={false}
                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                  >
                    {assignedTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name, props) => [`${value} tasks`, props.payload.assigned_type]}
                    contentStyle={{ backgroundColor: 'white', border: '1px solid #f0f0f0', borderRadius: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
                  />
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Task Completion Trend */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800">Task Completion Trend</h3>
              <p className="text-sm text-gray-500 mt-1">Monthly task completion rate</p>
            </div>
            <div className="p-5 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={completionData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid stroke="#f0f0f0" strokeDasharray="5 5" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(value) => [`${value} tasks`, 'Completed']}
                    contentStyle={{ backgroundColor: 'white', border: '1px solid #f0f0f0', borderRadius: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke={colors[3]}
                    strokeWidth={2}
                    dot={{ fill: colors[3], strokeWidth: 0 }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Data;