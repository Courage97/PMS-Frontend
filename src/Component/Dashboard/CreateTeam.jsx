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
} from "@mui/material";
import { Edit, Delete, Add, Close } from "@mui/icons-material";
import { Clock, LogOut, Calendar, Users, Plus, Pencil, Trash2, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

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
  const [info, setInfo] = useState({ username: "", role: "", profile_picture: "/api/placeholder/40/40" });

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

  const cardColors = [
    "from-blue-500 to-indigo-500",
    "from-emerald-500 to-teal-500",
    "from-purple-500 to-pink-500",
    "from-amber-500 to-orange-500",
    "from-rose-500 to-red-500",
    "from-cyan-500 to-sky-500",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modern Header with Glassmorphism */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo */}
            <div className="flex items-center">
              <div className="text-2xl font-extrabold bg-gradient-to-r from-emerald-600 to-blue-600 text-transparent bg-clip-text">
                ManageIQ
              </div>
            </div>

            {/* Right Section with improved styling */}
            <div className="flex items-center space-x-6">
              {/* Date and Time */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 shadow-sm text-gray-700"
              >
                <Calendar className="h-4 w-4 text-emerald-600" />
                <span className="text-xs font-medium">
                  {currentTime.toLocaleString()}
                </span>
              </motion.div>

              {/* User Profile */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="flex items-center gap-3"
              >
                <div className="relative">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                    {info.username ? info.username.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white"></div>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-semibold text-gray-800">{info.username}</p>
                  <p className="text-xs text-gray-500 font-medium">
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
                  className="p-2 md:px-4 md:py-1.5 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-full shadow-sm hover:shadow-md transition-all flex items-center gap-1.5 font-medium text-sm"
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Users className="text-emerald-600 h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  Team Management
                </h1>
                <p className="text-sm text-gray-500">Create and manage your organization teams</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleOpenDialog()}
              disabled={loading}
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-lg shadow-sm hover:shadow-md transition-all flex items-center gap-2 font-medium disabled:opacity-70"
            >
              <Plus className="h-4 w-4" />
              <span>Create Team</span>
            </motion.button>
          </div>

          {/* Error Handling */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2 p-3 mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg"
              >
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading State */}
          {loading && !teams.length && (
            <div className="flex justify-center items-center py-20">
              <div className="flex flex-col items-center">
                <CircularProgress size={40} className="text-emerald-500" />
                <p className="mt-4 text-gray-500">Loading teams...</p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && teams.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <div className="bg-gray-100 p-4 rounded-full mb-4">
                <Users className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">No Teams Yet</h3>
              <p className="text-gray-500 max-w-md mb-6">
                Create your first team to start collaborating with your colleagues
              </p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleOpenDialog()}
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-lg shadow-sm hover:shadow-md transition-all flex items-center gap-2 font-medium"
              >
                <Plus className="h-4 w-4" />
                <span>Create First Team</span>
              </motion.button>
            </motion.div>
          )}

          {/* Team Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {teams.map((team, index) => (
                <motion.div
                  key={team.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="relative overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Card Header with gradient */}
                  <div className={`h-16 bg-gradient-to-r ${cardColors[index % cardColors.length]}`}>
                    <div className="absolute top-4 right-4 flex space-x-1">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-1.5 bg-white/90 rounded-full text-gray-700 shadow-sm backdrop-blur-sm"
                        onClick={() => handleOpenDialog(team)}
                        disabled={loading}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-1.5 bg-white/90 rounded-full text-red-600 shadow-sm backdrop-blur-sm"
                        onClick={() => handleDeleteTeam(team.id)}
                        disabled={loading}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </motion.button>
                    </div>
                  </div>
                  {/* Card Content */}
                  <div className="p-5 pt-0 -mt-8">
                    <div className="inline-flex px-3 py-1 rounded-full bg-white shadow-sm mb-3">
                      <span className="text-sm font-semibold bg-gradient-to-r from-gray-800 to-gray-600 text-transparent bg-clip-text">
                        Team
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {team.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 min-h-[3rem]">
                      {team.description || "No description provided"}
                    </p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="w-3.5 h-3.5 mr-1.5" />
                      <span>Created: {formatDate(team.created_at)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Create/Edit Team Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '12px',
            padding: '8px'
          }
        }}
      >
        <DialogTitle sx={{ paddingBottom: 1 }}>
          <div className="flex items-center">
            <div className="p-2 bg-emerald-100 rounded-lg mr-3">
              {currentTeam.id ? (
                <Pencil className="text-emerald-600 h-4 w-4" />
              ) : (
                <Plus className="text-emerald-600 h-4 w-4" />
              )}
            </div>
            <div>
              <Typography variant="h6" className="font-bold text-gray-800">
                {currentTeam.id ? "Edit Team" : "Create New Team"}
              </Typography>
              <Typography variant="body2" className="text-gray-500">
                {currentTeam.id ? "Update team details" : "Add a new team to your organization"}
              </Typography>
            </div>
          </div>
          <IconButton
            onClick={handleCloseDialog}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ paddingTop: 2 }}>
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
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              },
              marginBottom: 2
            }}
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
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              }
            }}
            placeholder="Describe the purpose and goals of this team..."
          />
        </DialogContent>
        <DialogActions sx={{ padding: 2, paddingTop: 0 }}>
          <Button 
            onClick={handleCloseDialog} 
            disabled={loading}
            sx={{ 
              textTransform: 'none', 
              fontWeight: 500,
              borderRadius: '8px',
              padding: '6px 16px'
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading || !currentTeam.name.trim()}
            sx={{ 
              textTransform: 'none', 
              fontWeight: 500,
              borderRadius: '8px',
              padding: '6px 16px',
              background: 'linear-gradient(to right, #10b981, #3b82f6)',
              '&:hover': {
                background: 'linear-gradient(to right, #0d9488, #2563eb)',
              }
            }}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : currentTeam.id ? (
              "Update Team"
            ) : (
              "Create Team"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CreateTeam;