import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import api from "../../api";
import TaskForm from "./TaskForm";
import { motion } from 'framer-motion'; // Import framer-motion
import { Link } from "react-router";
import { LogOut, Calendar } from 'lucide-react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Chip,
  Dialog,
  IconButton,
  LinearProgress,
  Paper,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  AccessTime,
  Assignment,
  Group,
  FilterList,
} from "@mui/icons-material";


const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [sortBy, setSortBy] = useState("deadline");
  const [info, setInfo] = useState({username: '', role: ''})
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
      return `User: ${task.assigned_to_user.username}`;
    }
    if (task.assigned_type === "TEAM" && task.assigned_to_team) {
      return `Team: ${task.assigned_to_team.name}`;
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
      console.error("Error adding task:", err);
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
      console.error("Error deleting task:", err);
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
  }).reverse();

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "HIGH":
        return { color: "#f44336", backgroundColor: "#ffebee" };
      case "MEDIUM":
        return { color: "#ff9800", backgroundColor: "#fff3e0" };
      case "LOW":
        return { color: "#4caf50", backgroundColor: "#e8f5e9" };
      default:
        return { color: "#757575", backgroundColor: "#f5f5f5" };
    }
  };

  const getProgressColor = (status) => {
    switch (status) {
      case "completed":
        return "#4caf50";
      case "in_progress":
        return "#2196f3";
      case "blocked":
        return "#f44336";
      default:
        return "#ffd700";
    }
  };

  const getProgress = (status) => {
    switch (status) {
      case "completed":
        return 100;
      case "in_progress":
        return 60;
      case "blocked":
        return 30;
      default:
        return 0;
    }
  };

  return (
    <Box sx={{ maxWidth: 1400, mx: "auto", p: { xs: 2, md: 4 } }}>
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
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 2,
          bgcolor: "background.default",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", md: "center" },
          gap: 2,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            color: "text.primary",
            fontSize: { xs: "1.75rem", md: "2.125rem" },
          }}
        >
          Task Management
        </Typography>

        {/* Filter and Add Task Button */}
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <FormControl
            size="small"
            sx={{
              minWidth: 180,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          >
            <InputLabel>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <FilterList fontSize="small" />
                Sort by
              </Box>
            </InputLabel>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              label="Sort by"
            >
              <MenuItem value="deadline">Deadline</MenuItem>
              <MenuItem value="priority">Priority</MenuItem>
              <MenuItem value="status">Status</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setEditingTask(null);
              setShowTaskForm(true);
            }}
            sx={{
              bgcolor: "#4CAF50",
              "&:hover": { bgcolor: "#45a049" },
              borderRadius: 2,
              px: 3,
              height: 40,
            }}
          >
            Add Task
          </Button>
        </Box>
      </Paper>

      {/* Error Handling */}
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3, borderRadius: 2 }}
          variant="outlined"
        >
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 8 }}>
          <CircularProgress size={40} />
        </Box>
      ) : sortedTasks.length === 0 ? (
        <Paper
          sx={{
            p: 6,
            textAlign: "center",
            borderRadius: 2,
            bgcolor: "background.paper",
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No tasks available
          </Typography>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => {
              setEditingTask(null);
              setShowTaskForm(true);
            }}
            sx={{ mt: 2, borderRadius: 2 }}
          >
            Create your first task
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {sortedTasks.map((task) => (
            <Grid item xs={12} md={6} lg={4} key={task.id}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Card
                  sx={{
                    height: "100%",
                    borderRadius: 2,
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 4,
                    },
                  }}
                >
                  <CardContent sx={{ height: "100%", p: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 2,
                      }}
                    >
                      <Typography
                        variant="h6"
                        component="h3"
                        sx={{
                          fontWeight: 600,
                          fontSize: "1.1rem",
                          color: "text.primary",
                        }}
                      >
                        {task.title}
                      </Typography>
                      <Chip
                        label={task.priority}
                        size="small"
                        sx={{
                          borderRadius: 1,
                          fontWeight: 500,
                          ...getPriorityColor(task.priority),
                        }}
                      />
                    </Box>

                    <Typography
                      color="text.secondary"
                      sx={{
                        mb: 3,
                        fontSize: "0.95rem",
                        minHeight: "2.8em",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {task.description}
                    </Typography>

                    <Box sx={{ mb: 3 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 1,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ color: "text.secondary", fontWeight: 500 }}
                        >
                          Progress
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: getProgressColor(task.status) }}
                        >
                          {task.status.replace("_", " ").toUpperCase()}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={getProgress(task.status)}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          bgcolor: "grey.100",
                          "& .MuiLinearProgress-bar": {
                            bgcolor: getProgressColor(task.status),
                          },
                        }}
                      />
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1.5,
                        mb: 3,
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <AccessTime
                          sx={{ color: "action.active", fontSize: 20 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {new Date(task.deadline).toLocaleString()}
                        </Typography>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {task.assigned_type === "USER" ? (
                          <Assignment
                            sx={{ color: "action.active", fontSize: 20 }}
                          />
                        ) : (
                          <Group sx={{ color: "action.active", fontSize: 20 }} />
                        )}
                        <Typography variant="body2" color="text.secondary">
                          {getAssignedName(task)}
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        mt: "auto",
                        pt: 2,
                        borderTop: 1,
                        borderColor: "divider",
                      }}
                    >
                      <Button
                        variant="outlined"
                        startIcon={<EditIcon />}
                        onClick={() => editTask(task)}
                        sx={{
                          flex: 1,
                          borderRadius: 2,
                          textTransform: "none",
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => deleteTask(task.id)}
                        sx={{
                          flex: 1,
                          borderRadius: 2,
                          textTransform: "none",
                        }}
                      >
                        Delete
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Task Form Dialog */}
      <Dialog
        open={showTaskForm}
        onClose={() => setShowTaskForm(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            bgcolor: "background.paper",
          },
        }}
      >
        <Box sx={{ position: "relative" }}>
          <IconButton
            onClick={() => setShowTaskForm(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              zIndex: 1,
              color: "text.secondary",
            }}
          >
            <CloseIcon />
          </IconButton>
          <TaskForm
            setTasks={setTasks}
            existingTask={editingTask}
            onClose={() => setShowTaskForm(false)}
          />
        </Box>
      </Dialog>
    </Box>
  );
};

TaskForm.propTypes = {
  setTasks: PropTypes.func.isRequired,
  existingTask: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};

export default TaskList;