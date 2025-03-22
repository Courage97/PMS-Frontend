import { useState } from "react";
import { Link } from 'react-router-dom';
import api from "../../api";
import { 
  Users, 
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

const CreateTeamPreview = () => {
  const [teamData, setTeamData] = useState({ name: "", description: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeamData((prev) => ({ ...prev, [name]: value }));
    if (error && name === "name" && value.trim()) {
      setError("");
    }
  };

  const handleAddTeam = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!teamData.name.trim()) {
      setError("Team name is required");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const token = localStorage.getItem("access");
      await api.post("/teams/", teamData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Show success message
      setShowSuccess(true);
      
      // Reset form
      setTeamData({ name: "", description: "" });
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add team");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 relative overflow-hidden"
    >
      {/* Simplified decorative elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-emerald-500/5 to-transparent rounded-bl-full"></div>
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-50 rounded-lg">
            <Users className="w-5 h-5 text-emerald-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">Create Team</h2>
        </div>
      </div>

      <form onSubmit={handleAddTeam} className="space-y-4 relative z-10">
        <div>
          <label 
            htmlFor="teamName" 
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Team Name
          </label>
          <input
            id="teamName"
            name="name"
            value={teamData.name}
            onChange={handleChange}
            placeholder="Enter team name"
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-gray-800 bg-white placeholder:text-gray-400"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label 
            htmlFor="teamDescription" 
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Team Description
          </label>
          <textarea
            id="teamDescription"
            name="description"
            value={teamData.description}
            onChange={handleChange}
            placeholder="Optional team description"
            rows={2}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-gray-800 bg-white placeholder:text-gray-400 resize-none"
            disabled={isSubmitting}
          />
        </div>

        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 text-sm rounded-lg"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {showSuccess && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-600 text-sm rounded-lg"
            >
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>Team created successfully!</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col space-y-3">
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
            whileTap={{ scale: isSubmitting ? 1 : 0.99 }}
            className={`
              w-full py-2.5 rounded-lg text-white font-medium transition-all flex items-center justify-center gap-2
              ${isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-emerald-600 hover:bg-emerald-700 cursor-pointer'}
            `}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating...</span>
              </>
            ) : (
              'Create Team'
            )}
          </motion.button>
          
          <motion.div
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.97 }}
            className="self-end mt-1"
          >
            <Link 
              to="/createteam" 
              className="text-emerald-600 hover:text-emerald-700 text-sm flex items-center gap-1.5 py-1 transition-all duration-200 cursor-pointer"
            > 
              Manage Teams 
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </form>
    </motion.div>
  );
};

export default CreateTeamPreview;