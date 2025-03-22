import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import api from "../../api";
import TaskForm from "./TaskForm";
import { motion } from 'framer-motion';
import { Link } from "react-router";
import { LogOut, Calendar, Filter, Clock, Users, User, AlertCircle, FileEdit, Trash2 } from 'lucide-react';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [sortBy, setSortBy] = useState("deadline");
  const [info, setInfo] = useState({username: '', role: ''});
  const [currentTime, setCurrentTime] = useState(new Date());

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access");
        const [taskRes, userRes, teamRes] = await Promise.all([
          api.get("/task/", { headers: { Authorization: `Bearer ${token}` } }),
          api.get("/users/", { headers: { Authorization: `Bearer ${token}` } }),
          api.get("/teams/", { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setTasks(taskRes.data);
        setUsers(userRes.data);
        setTeams(teamRes.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getAssignedName = (task) => {
    if (task.assigned_type === "USER" && task.assigned_to_user) {
      return `${task.assigned_to_user.username}`;
    }
    if (task.assigned_type === "TEAM" && task.assigned_to_team) {
      return `${task.assigned_to_team.name}`;
    }
    return "Unassigned";
  };

  const addTask = async (newTask) => {
    try {
      const token = localStorage.getItem("access");
      const response = await api.post("/task/", newTask, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks([response.data, ...tasks]);
      setShowTaskForm(false);
    } catch (err) {
      setError("Failed to add task.");
    }
  };

  const deleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      const token = localStorage.getItem("access");
      await api.delete(`/task/${taskId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (err) {
      setError("Failed to delete task.");
    }
  };

  const editTask = (task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortBy === "priority") {
      const priorityOrder = { HIGH: 1, MEDIUM: 2, LOW: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    if (sortBy === "deadline") {
      return new Date(a.deadline) - new Date(b.deadline);
    }
    if (sortBy === "status") {
      return a.status.localeCompare(b.status);
    }
    return 0;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-50 text-red-600";
      case "MEDIUM":
        return "bg-orange-50 text-orange-600";
      case "LOW":
        return "bg-green-50 text-green-600";
      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  const getProgressValue = (status) => {
    switch (status) {
      case "completed":
        return 100;
      case "in_progress":
        return 60;
      case "blocked":
        return 30;
      default:
        return 10;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "text-green-500";
      case "in_progress":
        return "text-blue-500";
      case "blocked":
        return "text-red-500";
      default:
        return "text-yellow-500";
    }
  };

  const getProgressBarColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "in_progress":
        return "bg-blue-500";
      case "blocked":
        return "bg-red-500";
      default:
        return "bg-yellow-500";
    }
  };

  const formatStatusText = (status) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 py-4"
      >
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
            ManageIQ
          </h1>
          
          <div className="flex items-center gap-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 text-gray-700 text-sm"
            >
              <Calendar className="h-4 w-4 text-green-500" />
              <span>{currentTime.toLocaleString()}</span>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-3"
            >
              <div className="relative">
                {info.profile_picture ? (
                  <img
                    src={info.profile_picture}
                    alt="Profile"
                    className="h-9 w-9 rounded-full ring-2 ring-green-500 ring-offset-2"
                  />
                ) : (
                  <div className="h-9 w-9 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center">
                    <span className="text-white font-medium">
                      {info.username ? info.username.charAt(0).toUpperCase() : "U"}
                    </span>
                  </div>
                )}
                <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white"></div>
              </div>
              <div>
                <p className="font-medium text-gray-800">{info.username}</p>
                <p className="text-xs bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent font-medium">{info.role}</p>
              </div>
            </motion.div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500 to-blue-500 text-white text-sm font-medium shadow-sm hover:shadow-md transition-all"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Main content */}
      <div className="mt-8 mb-12">
        {/* Page header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Task Management
          </h2>
          
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none"
              >
                <option value="deadline">Deadline</option>
                <option value="priority">Priority</option>
                <option value="status">Status</option>
              </select>
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setEditingTask(null);
                setShowTaskForm(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg shadow-sm hover:bg-green-600 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Task</span>
            </motion.button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 border border-red-200 bg-red-50 text-red-600 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="h-8 w-8 border-4 border-t-green-500 border-r-green-200 border-b-green-200 border-l-green-200 rounded-full animate-spin"></div>
          </div>
        ) : sortedTasks.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-xl p-12 text-center shadow-sm">
            <h3 className="text-lg font-medium text-gray-700 mb-3">No tasks available</h3>
            <p className="text-gray-500 mb-6">Get started by creating your first task</p>
            <button
              onClick={() => {
                setEditingTask(null);
                setShowTaskForm(true);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:shadow-md transition-all"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Create Task</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedTasks.map((task) => (
              <motion.div
                key={task.id}
                whileHover={{ y: -4, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
                transition={{ duration: 0.2 }}
                className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm transition-all"
              >
                <div className="p-5">
                  {/* Task Header */}
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold text-gray-900 line-clamp-1 pr-2">{task.title}</h3>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                  
                  {/* Task Description */}
                  <p className="text-gray-600 text-sm mb-5 line-clamp-2 min-h-[2.5rem]">
                    {task.description}
                  </p>
                  
                  {/* Task Progress */}
                  <div className="mb-5">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs text-gray-500 font-medium">Progress</span>
                      <span className={`text-xs font-medium ${getStatusColor(task.status)}`}>
                        {formatStatusText(task.status)}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getProgressBarColor(task.status)}`} 
                        style={{ width: `${getProgressValue(task.status)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Task Details */}
                  <div className="space-y-2.5 mb-5">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4 text-green-500" />
                      <span>{new Date(task.deadline).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      {task.assigned_type === "USER" ? (
                        <User className="h-4 w-4 text-blue-500" />
                      ) : (
                        <Users className="h-4 w-4 text-blue-500" />
                      )}
                      <span>
                        {task.assigned_type === "USER" ? "User: " : "Team: "}
                        {getAssignedName(task)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Task Actions */}
                  <div className="flex gap-2 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => editTask(task)}
                      className="flex items-center justify-center gap-1.5 flex-1 py-2 rounded-lg bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:border-green-300 hover:text-green-600 transition-colors"
                    >
                      <FileEdit className="h-4 w-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="flex items-center justify-center gap-1.5 flex-1 py-2 rounded-lg bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:border-red-300 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Task Form Dialog */}
      {showTaskForm && (
        <div className="fixed inset-0 z-50 bg-black/25 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-xl overflow-hidden max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="relative">
              <button
                onClick={() => setShowTaskForm(false)}
                className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-500"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <TaskForm
                setTasks={setTasks}
                existingTask={editingTask}
                onClose={() => setShowTaskForm(false)}
              />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

TaskForm.propTypes = {
  setTasks: PropTypes.func.isRequired,
  existingTask: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};

export default TaskList;