import { useState } from "react";
import { Link } from 'react-router-dom';
import api from "../../api";
import { 
  Users as UsersIcon, 
  PlusCircle as PlusCircleIcon, 
  AlertTriangle as AlertTriangleIcon 
} from 'lucide-react';

const CreateTeamPreview = () => {
  const [teamData, setTeamData] = useState({ name: "", description: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeamData((prev) => ({ ...prev, [name]: value }));
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
      
      // Reset form
      setTeamData({ name: "", description: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add team");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-b from-green-500/10 to-transparent rounded-bl-full"></div>
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <UsersIcon className="w-6 h-6 text-green-600" />
          <h2 className="text-xl font-semibold text-gray-800">Create Team</h2>
        </div>
        <Link to="/createteam" className="text-blue-600 hover:text-blue-800 text-sm flex items-center px-2"> Manage Teams <PlusCircleIcon className="w-4 h-4 ml-2"/>
        </Link>  
      </div>
      

      <form onSubmit={handleAddTeam} className="space-y-4">
        <div>
          <label 
            htmlFor="teamName" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Team Name
          </label>
          <input
            id="teamName"
            name="name"
            value={teamData.name}
            onChange={handleChange}
            placeholder="Enter team name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label 
            htmlFor="teamDescription" 
            className="block text-sm font-medium text-gray-700 mb-1"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
            disabled={isSubmitting}
          />
        </div>

        {error && (
          <div className="flex items-center space-x-2 text-red-600 text-sm">
            <AlertTriangleIcon className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`
            w-full py-2 rounded-lg text-white font-medium transition-all
            ${isSubmitting 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-green-600 hover:bg-green-700 active:bg-green-800'}
          `}
        >
          {isSubmitting ? 'Creating...' : 'Create Team'}
        </button>
      </form>
    </div>
  );
};

export default CreateTeamPreview;