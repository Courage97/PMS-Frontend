import { useEffect, useState } from "react";
import api from '../../api'; 
import { Link } from 'react-router-dom';

const TeamListPreview = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ setError] = useState("");

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
  },[]);

  if (loading) return (
    <div className="space-y-2 animate-pulse">
      {[1, 2, 3].map((_, index) => (
        <div key={index} className="bg-gray-200 h-12 rounded-lg"></div>
      ))}
    </div>
  );

  return (
    <div>
      {teams.map((team) => (
        <div 
          key={team.id} 
          className="bg-white border border-gray-100 rounded-xl shadow-md mb-4"
        >
          <div className="p-4">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-bold text-gray-800">{team.name}</h3>
            </div>
            <p className="text-gray-600 mb-2 line-clamp-1">
              {team.description || "No description available"}
            </p>
          </div>
        </div>
      ))}
      <Link 
        to="/teamlist" 
        className="text-green-600 hover:underline text-center block mt-4"
      >
        View All Teams
      </Link>
    </div>
  );
};

export default TeamListPreview;