import { Link } from 'react-router-dom';
import { Users, ArrowRight } from 'lucide-react';

const ManageUserPreview = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-b from-[#2196F3]/10 to-transparent rounded-bl-full"></div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Users className="text-[#2196F3] w-6 h-6" />
        Manage Users
      </h2>
      <p className="text-gray-600 mb-4">
        View and manage all users, assign them to teams, and monitor their roles and permissions.
      </p>
      <Link
        to="/manage-users"
        className="flex items-center gap-2 text-[#2196F3] hover:text-[#1976D2] transition-colors font-medium"
      >
        Go to Manage Users
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
};

export default ManageUserPreview;