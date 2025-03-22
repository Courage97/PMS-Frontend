import { useState, useEffect } from "react";
import api from "../../api";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  useTheme,
  alpha,
  Alert,
  Stack,
  LinearProgress
} from "@mui/material";
import {
  Flag,
  AccessTime,
  Group,
  Person,
  Description,
  PriorityHigh,
  Assignment
} from "@mui/icons-material";

const TaskForm = ({ setTasks, existingTask, onClose }) => {
  const theme = useTheme();
  
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
        setError(
          err.response?.data?.message || "Failed to load users and teams."
        );
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
      setError(
        err.response?.data?.message || "An error occurred while saving the task"
      );
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "HIGH":
        return theme.palette.error.main;
      case "MEDIUM":
        return theme.palette.warning.main;
      case "LOW":
        return theme.palette.success.main;
      default:
        return theme.palette.text.secondary;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return theme.palette.info.main;
      case "in_progress":
        return theme.palette.warning.main;
      case "completed":
        return theme.palette.success.main;
      case "blocked":
        return theme.palette.error.main;
      default:
        return theme.palette.text.secondary;
    }
  };

  const priorityOptions = [
    { value: "HIGH", label: "High Priority" },
    { value: "MEDIUM", label: "Medium Priority" },
    { value: "LOW", label: "Low Priority" },
  ];

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "blocked", label: "Blocked" },
  ];

  return (
    <Card
      elevation={3}
      sx={{
        maxWidth: 800,
        mx: "auto",
        borderRadius: 2,
        overflow: "visible",
        position: "relative",
      }}
    >
      {loading && (
        <LinearProgress
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        />
      )}

      <CardContent sx={{ p: 4 }}>
        <Box 
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 4,
            gap: 1
          }}
        >
          <Assignment fontSize="large" color="primary" />
          <Typography variant="h5" component="h2" fontWeight="bold">
            {existingTask ? "Edit Task" : "Create New Task"}
          </Typography>
        </Box>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              borderRadius: 1,
              alignItems: "center"
            }}
          >
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Task Title"
                name="title"
                value={taskData.title}
                onChange={handleChange}
                required
                variant="outlined"
                placeholder="What needs to be done?"
                InputProps={{
                  sx: { borderRadius: 1.5 }
                }}
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
                placeholder="Add details about this task..."
                InputProps={{
                  startAdornment: (
                    <Description 
                      sx={{ 
                        color: "text.secondary", 
                        mr: 1, 
                        mt: 1.5 
                      }} 
                    />
                  ),
                  sx: { borderRadius: 1.5 }
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 1 }}>
                <Chip label="Task Details" />
              </Divider>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Priority</InputLabel>
                <Select
                  name="priority"
                  value={taskData.priority}
                  onChange={handleChange}
                  label="Priority"
                  sx={{ 
                    borderRadius: 1.5,
                    "& .MuiSelect-select": {
                      display: "flex",
                      alignItems: "center",
                    }
                  }}
                >
                  {priorityOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Flag sx={{ color: getPriorityColor(option.value) }} />
                        {option.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={taskData.status}
                  onChange={handleChange}
                  label="Status"
                  sx={{ 
                    borderRadius: 1.5,
                    "& .MuiSelect-select": {
                      display: "flex",
                      alignItems: "center",
                    }
                  }}
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Chip 
                        size="small"
                        label={option.label}
                        sx={{ 
                          bgcolor: alpha(getStatusColor(option.value), 0.1),
                          color: getStatusColor(option.value),
                          borderRadius: 1
                        }}
                      />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 1 }}>
                <Chip label="Assignment" />
              </Divider>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Assignment Type</InputLabel>
                <Select
                  name="assigned_type"
                  value={taskData.assigned_type}
                  onChange={handleChange}
                  label="Assignment Type"
                  sx={{ 
                    borderRadius: 1.5,
                    "& .MuiSelect-select": {
                      display: "flex",
                      alignItems: "center",
                    }
                  }}
                >
                  <MenuItem value="USER">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Person />
                      Assign to User
                    </Box>
                  </MenuItem>
                  <MenuItem value="TEAM">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Group />
                      Assign to Team
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined">
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
                  sx={{ borderRadius: 1.5 }}
                >
                  <MenuItem value="">
                    <em>Select {taskData.assigned_type === "USER" ? "User" : "Team"}</em>
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
                  startAdornment: (
                    <AccessTime sx={{ color: "text.secondary", mr: 1 }} />
                  ),
                  sx: { borderRadius: 1.5 }
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Stack 
                direction="row" 
                spacing={2} 
                sx={{ mt: 2 }}
              >
                <Button
                  variant="outlined"
                  onClick={onClose}
                  fullWidth
                  sx={{
                    borderRadius: 1.5,
                    py: 1.5,
                    color: theme.palette.text.secondary,
                    borderColor: theme.palette.divider,
                    "&:hover": {
                      borderColor: theme.palette.text.secondary,
                      bgcolor: alpha(theme.palette.text.secondary, 0.05)
                    }
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  sx={{
                    borderRadius: 1.5,
                    py: 1.5,
                    boxShadow: 2,
                    bgcolor: theme.palette.primary.main,
                    "&:hover": {
                      bgcolor: theme.palette.primary.dark,
                    },
                  }}
                >
                  {existingTask ? "Update Task" : "Create Task"}
                </Button>
              </Stack>
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