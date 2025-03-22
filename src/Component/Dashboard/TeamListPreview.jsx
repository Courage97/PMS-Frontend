import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { Users, ArrowUpRight, Calendar, UserPlus } from "lucide-react";
import api from '../../api';

const TeamListPreview = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTeams = async () => {
    try {
      const token = localStorage.getItem("access");
      const response = await api.get("/teams/", {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Limit to first 3 teams for dashboard preview
      setTeams(response.data.reverse().slice(0, 3)); 
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch teams");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  // Format date properly
  const formatDate = (dateString) => {
    if (!dateString) return "Date unavailable";
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric',
        month: 'short', 
        day: 'numeric'
      });
    } catch (e) {
      return "Invalid date";
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="p-3 border border-gray-100 rounded-lg bg-gray-50">
              <div className="h-5 w-40 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-3 w-full bg-gray-200 rounded animate-pulse mb-3"></div>
              <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
          <Users className="mr-2 h-5 w-5 text-blue-500" />
          Teams
        </h2>
        <Link 
          to="/teamlist" 
          className="text-blue-500 hover:text-blue-700 flex items-center text-sm font-medium group"
        >
          View all
          <ArrowUpRight className="ml-1 h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>
      
      {teams.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-6 text-center border border-dashed border-gray-200">
          <Users className="h-6 w-6 text-gray-400 mx-auto mb-2" />
          <h3 className="text-gray-700 font-medium mb-1">No teams available</h3>
          <Link 
            to="/create-team" 
            className="mt-2 inline-block px-3 py-1.5 bg-blue-500 text-white rounded text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            <UserPlus className="h-3.5 w-3.5 inline mr-1" />
            Create team
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {teams.map((team) => (
            <Link 
              key={team.id} 
              to={`/teams/${team.id}`}
              className="block group"
            >
              <div className="p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all duration-200">
                <h3 className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors text-sm mb-1">
                  {team.name}
                </h3>
                
                <p className="text-gray-600 text-xs line-clamp-1 mb-2">
                  {team.description || "No description available"}
                </p>
                
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                  <span>Created {team.created_at ? formatDate(team.created_at) : "Date unavailable"}</span>
                </div>
              </div>
            </Link>
          ))}


        </div>
      )}
    </div>
  );
};

export default TeamListPreview;