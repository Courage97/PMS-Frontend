import { useState, useEffect } from "react";
import api from "../../api";
import PropTypes from "prop-types";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Box,
  Button,
  Alert,
  Grid,
  CircularProgress
} from "@mui/material";
import {
  PriorityHigh,
  AccessTime,
  Group,
  Person
} from "@mui/icons-material";

const TaskForm = ({ setTasks, existingTask, onClose }) => {
  const [taskData, setTaskData] = useState(
    existingTask || {
      title: "",
      description: "",
      priority: "MEDIUM",
      assigned_to_user_id: "",
      assigned_to_team_id: "",
      assigned_type: "USER",
      status: "pending",
      deadline: "",
    }
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchUsersAndTeams = async () => {
      try {
        const [usersRes, teamsRes] = await Promise.all([
          api.get("/users/"),
          api.get("/teams/"),
        ]);
        setUsers(usersRes.data);
        setTeams(teamsRes.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load users and teams.");
      }
    };
    fetchUsersAndTeams();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData({ ...taskData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      ...taskData,
      assigned_to_user_id:
        taskData.assigned_type === "USER" ? taskData.assigned_to_user_id : null,
      assigned_to_team_id:
        taskData.assigned_type === "TEAM" ? taskData.assigned_to_team_id : null,
    };

    try {
      const token = localStorage.getItem("access");
      let response;
      if (existingTask) {
        response = await api.put(`/task/${existingTask.id}/`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        response = await api.post("/task/", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      if (response.status === 200 || response.status === 201) {
        setTasks((prevTasks) => {
          if (existingTask) {
            return prevTasks.map((task) =>
              task.id === existingTask.id ? response.data : task
            );
          }
          return [...prevTasks, response.data];
        });
        setError(null);
        onClose();
      } else {
        setError("Unexpected response from server.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occur while saving the task");
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "HIGH":
        return "#f44336";
      case "MEDIUM":
        return "#ffa726";
      case "LOW":
        return "#4caf50";
      default:
        return "#757575";
    }
  };

  return (
    <Card sx={{ maxWidth: 800, mx: "auto", mt: 3 }}>
      <CardContent>
        <Typography variant="h5" component="h2" align="center" gutterBottom>
          {existingTask ? "Edit Task" : "Create New Task"}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={taskData.title}
                onChange={handleChange}
                required
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={taskData.description}
                onChange={handleChange}
                multiline
                rows={4}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  name="priority"
                  value={taskData.priority}
                  onChange={handleChange}
                  label="Priority"
                  startAdornment={<PriorityHigh sx={{ color: getPriorityColor(taskData.priority), mr: 1 }} />}
                >
                  <MenuItem value="HIGH">High Priority</MenuItem>
                  <MenuItem value="MEDIUM">Medium Priority</MenuItem>
                  <MenuItem value="LOW">Low Priority</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={taskData.status}
                  onChange={handleChange}
                  label="Status"
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="in_progress">In Progress</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="blocked">Blocked</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Assignment Type</InputLabel>
                <Select
                  name="assigned_type"
                  value={taskData.assigned_type}
                  onChange={handleChange}
                  label="Assignment Type"
                  startAdornment={
                    taskData.assigned_type === "USER" ? 
                    <Person sx={{ mr: 1 }} /> : 
                    <Group sx={{ mr: 1 }} />
                  }
                >
                  <MenuItem value="USER">Assign to User</MenuItem>
                  <MenuItem value="TEAM">Assign to Team</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>
                  {`Select ${taskData.assigned_type === "USER" ? "User" : "Team"}`}
                </InputLabel>
                <Select
                  name={
                    taskData.assigned_type === "USER"
                      ? "assigned_to_user_id"
                      : "assigned_to_team_id"
                  }
                  value={
                    taskData.assigned_type === "USER"
                      ? taskData.assigned_to_user_id || ""
                      : taskData.assigned_to_team_id || ""
                  }
                  onChange={handleChange}
                  required
                  label={`Select ${
                    taskData.assigned_type === "USER" ? "User" : "Team"
                  }`}
                >
                  <MenuItem value="">
                    Select {taskData.assigned_type === "USER" ? "User" : "Team"}
                  </MenuItem>
                  {(taskData.assigned_type === "USER" ? users : teams).map(
                    (option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {taskData.assigned_type === "USER"
                          ? option.username
                          : option.name}
                      </MenuItem>
                    )
                  )}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Deadline"
                name="deadline"
                type="datetime-local"
                value={taskData.deadline}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: <AccessTime sx={{ mr: 1 }} />,
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  bgcolor: "#4CAF50",
                  "&:hover": { bgcolor: "#45a049" },
                  py: 1.5,
                }}
              >
                {loading ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CircularProgress size={20} color="inherit" />
                    {existingTask ? "Updating..." : "Creating..."}
                  </Box>
                ) : (
                  existingTask ? "Update Task" : "Create Task"
                )}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

TaskForm.propTypes = {
  setTasks: PropTypes.func.isRequired,
  existingTask: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};

export default TaskForm;