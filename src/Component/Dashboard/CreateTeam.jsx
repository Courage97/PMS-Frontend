import { useState, useEffect } from "react";
import api from "../../api";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Tooltip,
  Typography,
  TextField,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Edit, Delete, Add, Close, Group } from "@mui/icons-material";
import { Clock, LogOut, Calendar } from "lucide-react";
import { Link } from "react-router-dom"; // Fixed import
import { motion } from "framer-motion"; // Added for animations

const CreateTeam = () => {
  const [teams, setTeams] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentTeam, setCurrentTeam] = useState({
    name: "",
    description: "",
    id: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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

  const API_URL = "http://127.0.0.1:8000/api/teams/";

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("access");
      const response = await api.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeams(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch teams");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (team = null) => {
    setCurrentTeam(team ? { ...team } : { name: "", description: "", id: null });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentTeam({ name: "", description: "", id: null });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("access");
      if (currentTeam.id) {
        // Edit existing team
        await api.put(
          `${API_URL}${currentTeam.id}/`,
          { name: currentTeam.name, description: currentTeam.description },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTeams(
          teams.map((team) =>
            team.id === currentTeam.id ? { ...team, ...currentTeam } : team
          )
        );
      } else {
        // Create new team
        const response = await api.post(
          API_URL,
          { name: currentTeam.name, description: currentTeam.description },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTeams([...teams, response.data]);
      }
      handleCloseDialog();
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTeam = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("access");
      await api.delete(`${API_URL}${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeams(teams.filter((team) => team.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete team");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      {/* Header */}
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
      <div className="flex justify-between items-center mb-6 pt-6">
        <div className="flex items-center space-x-3">
          <Group className="text-green-600 h-5 w-5" />
          <Typography variant="h5" className="font-bold text-gray-800">
            Team Management
          </Typography>
        </div>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          className="bg-green-500 hover:bg-green-600"
        >
          Create Team
        </Button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-4">
          <CircularProgress />
        </div>
      )}

      {/* Error Handling */}
      {error && (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      )}

      {/* Team List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <motion.div
            key={team.id}
            className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex justify-between items-start mb-4">
              <Typography variant="h6" className="font-bold text-blue-600">
                {team.name}
              </Typography>
              <div>
                <Tooltip title="Edit Team">
                  <IconButton
                    color="primary"
                    size="small"
                    onClick={() => handleOpenDialog(team)}
                    disabled={loading}
                  >
                    <Edit />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete Team">
                  <IconButton
                    color="secondary"
                    size="small"
                    onClick={() => handleDeleteTeam(team.id)}
                    disabled={loading}
                  >
                    <Delete />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
            <Typography variant="body2" className="text-gray-600 mb-4">
              {team.description || "No description provided"}
            </Typography>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Created: {formatDate(team.created_at)}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Create/Edit Team Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {currentTeam.id ? "Edit Team" : "Create New Team"}
          <IconButton
            onClick={handleCloseDialog}
            style={{ position: "absolute", right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Team Name"
            fullWidth
            variant="outlined"
            value={currentTeam.name}
            onChange={(e) =>
              setCurrentTeam({ ...currentTeam, name: e.target.value })
            }
            required
            disabled={loading}
          />
          <TextField
            margin="dense"
            label="Team Description"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={currentTeam.description}
            onChange={(e) =>
              setCurrentTeam({ ...currentTeam, description: e.target.value })
            }
            disabled={loading}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary" disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            color="primary"
            variant="contained"
            disabled={loading}
            className="bg-green-500 hover:bg-green-600"
          >
            {loading ? <CircularProgress size={24} /> : currentTeam.id ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CreateTeam;