import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';

// Icons
import { 
  LogOut, 
  Calendar, 
  Users, 
  CheckCircle, 
  BarChart2, 
  Bell,
  Settings,
  Menu,
  Moon,
  Sun,
  Home,
  PieChart,
  UserPlus,
  ChevronDown,
  Search,
  X,
  UserCog
} from 'lucide-react';

// Component imports
import TeamListPreview from './TeamListPreview';
import ManageUserPreview from './ManageUserPreview';
import CreateTeamPreview from './CreateTeamPreview';
import DataSummary from './DataSummary';
import TaskListPreview from "../../Component/Task Management/TaskListPreview";
import Notifications from './Notifications';

const Dashboard = () => {
  // State management
  const [currentTime, setCurrentTime] = useState(new Date());
  const [info, setInfo] = useState({username: '', role: ''});
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('dashboard');

  // Fetch user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        let token = localStorage.getItem("access_token");
  
        if (!token) {
          throw new Error("No access token found. Please log in.");
        }
  
        const response = await api.get("/users/me/", {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (response.data && response.data.username && response.data.role) {
          setInfo(response.data);
        } else {
          throw new Error("Invalid user data format");
        }
      } catch (error) {
        if (error.response?.status === 403) {
          setError("You do not have permission to access this resource.");
        } else if (error.response?.status === 401) {
          setError("Session expired. Please log in again.");
          localStorage.clear();
          window.location.href = "/login";
        } else {
          setError(error.response?.data?.message || "Failed to fetch user details");
        }
      }
    };
  
    fetchUserDetails();
  }, []);

  // Update time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Toggle dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.profile-dropdown')) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  // Format date and time
  const formatDatetime = () => {
    const options = { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return currentTime.toLocaleDateString('en-US', options);
  };

  // Handle navigation link click
  const handleNavClick = (linkName) => {
    setActiveLink(linkName);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-950 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
      {/* Enhanced Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-30 w-64 transition-all duration-300 ease-in-out 
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0 sm:w-20'} 
          ${darkMode ? 'bg-gray-900 border-r border-gray-800' : 'bg-white border-r border-gray-100'} 
          shadow-lg backdrop-blur-sm bg-opacity-95`}
      >
        {/* Logo Section with enhanced styling */}
        <div className={`h-20 flex items-center justify-between px-4 ${darkMode ? 'border-b border-gray-800' : 'border-b border-gray-100'}`}>
          {sidebarOpen && (
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center text-white font-bold mr-3 shadow-md">
                M
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-emerald-500 text-transparent bg-clip-text">ManageIQ</h1>
            </div>
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'} transition-all duration-200`}
          >
            <Menu size={20} />
          </button>
        </div>

        {/* User Profile Section in Sidebar
        {sidebarOpen && (
          <div className={`mt-6 mb-8 px-4 py-3 mx-3 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-emerald-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                {info.username ? info.username.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="ml-3">
                <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {info.username || 'User'}
                </p>
                <p className={`text-xs ${info.role === 'Admin' ? 'text-emerald-500' : 'text-blue-500'} font-medium`}>
                  {info.role || 'User'}
                </p>
              </div>
            </div>
          </div>
        )} */}

        {/* Navigation Links - Now with Manage Users added */}
        <div className={`px-3 ${sidebarOpen ? 'mt-2' : 'mt-8'}`}>
          {sidebarOpen && <h2 className="text-xs font-semibold uppercase tracking-wider ml-3 mb-3 text-gray-500"></h2>}
          <nav className="space-y-1.5">
            {[
              { name: 'Dashboard', icon: <Home size={20} />, path: '/dashboard', id: 'dashboard' },
              { name: 'Teams', icon: <Users size={20} />, path: '/teamlist', id: 'teams' },
              { name: 'Tasks', icon: <CheckCircle size={20} />, path: '/tasks', id: 'tasks' },
              { name: 'Analytics', icon: <PieChart size={20} />, path: '/data', id: 'analytics' },
              { name: 'Manage Users', icon: <UserCog size={20} />, path: '/manage-users', id: 'manage-users' },
              { name: 'Settings', icon: <Settings size={20} />, path: '/settings', id: 'settings' },
            ].map((item) => (
              <Link 
                key={item.id}
                to={item.path}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center px-3 py-3 rounded-xl transition-all ${
                  activeLink === item.id 
                    ? `${darkMode 
                        ? 'bg-gradient-to-r from-blue-900/60 to-emerald-900/60 text-white font-medium border-l-4 border-blue-500' 
                        : 'bg-gradient-to-r from-blue-50 to-emerald-50 text-blue-600 font-medium border-l-4 border-blue-500'}` 
                    : `${darkMode 
                        ? 'text-gray-400 hover:bg-gray-800/70 hover:text-gray-200' 
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`
                }`}
              >
                <span className={`${sidebarOpen ? 'mr-3' : ''} ${activeLink === item.id ? 'text-blue-500' : ''}`}>{item.icon}</span>
                {sidebarOpen && <span>{item.name}</span>}
              </Link>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer Section */}
        {sidebarOpen && (
          <div className={`mt-8 px-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <div className={`p-4 rounded-xl ${darkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
              <h3 className="text-sm font-medium text-blue-600 mb-2">Pro Tips</h3>
              <p className="text-xs">
                You can customize your dashboard and team settings in the Settings area.
              </p>
            </div>
          </div>
        )}

        {/* Logout Button */}
        <div className="absolute bottom-5 w-full px-3">
          <Link
            to="/logout"
            className={`flex items-center px-3 py-2.5 rounded-xl transition-colors ${darkMode ? 'text-gray-400 hover:bg-gray-800 hover:text-red-400' : 'text-gray-600 hover:bg-gray-100 hover:text-red-600'}`}
          >
            <LogOut size={20} className={`${sidebarOpen ? 'mr-3' : ''}`} />
            {sidebarOpen && <span>Logout</span>}
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0 sm:ml-20'}`}>
        {/* Header */}
        <header className={`h-16 ${darkMode ? 'bg-gray-900 border-b border-gray-800' : 'bg-white border-b border-gray-100'} shadow-sm flex items-center justify-between px-6 sticky top-0 z-20`}>
          <div className="flex items-center">
            <h2 className="text-xl font-semibold mr-6">Dashboard</h2>
            
            {/* Search Bar */}
            <div className={`relative ${searchOpen ? 'w-64' : 'w-8'} transition-all duration-300`}>
              {searchOpen ? (
                <div className="relative">
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..." 
                    className={`w-full pl-8 pr-8 py-1.5 rounded-lg text-sm ${
                      darkMode 
                        ? 'bg-gray-800 border-gray-700 focus:border-blue-600 text-white' 
                        : 'bg-gray-100 border-gray-200 focus:border-blue-500 text-gray-800'
                    } border focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  />
                  <Search size={14} className={`absolute left-2.5 top-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <button 
                    onClick={() => {setSearchOpen(false); setSearchQuery('');}}
                    className="absolute right-2.5 top-2"
                  >
                    <X size={14} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setSearchOpen(true)}
                  className={`p-1.5 rounded-lg ${darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
                >
                  <Search size={18} />
                </button>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg transition-colors ${darkMode ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            
            {/* Date/Time */}
            <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
              <Calendar size={16} className="text-blue-500" />
              <span className="text-sm font-medium">{formatDatetime()}</span>
            </div>
            
            {/* User Profile Dropdown */}
            <div className="profile-dropdown relative">
              <div 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 cursor-pointer rounded-lg hover:bg-opacity-80 p-1"
              >
                <div className="relative">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-r from-blue-600 to-emerald-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                    {info.username ? info.username.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></div>
                </div>
                <div className="hidden md:block">
                  <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {info.username}
                  </p>
                  <p className={`text-xs ${info.role === 'Admin' ? 'text-emerald-500' : 'text-blue-500'} font-medium`}>
                    {info.role}
                  </p>
                </div>
                <ChevronDown size={16} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''} ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>
              
              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className={`absolute right-0 mt-2 w-48 rounded-xl shadow-lg py-1 z-50 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'}`}>
                  <div className={`px-4 py-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{info.username || 'Guest User'}</p>
                    <p className={`text-xs truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{info.email || 'user@example.com'}</p>
                  </div>
                  
                  <ul>
                    <li>
                      <a href="/profile" className={`flex items-center px-4 py-2 text-sm ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                        <div className="w-8">
                          <Users size={16} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                        </div>
                        <span>My Profile</span>
                      </a>
                    </li>
                    <li>
                      <a href="/settings" className={`flex items-center px-4 py-2 text-sm ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                        <div className="w-8">
                          <Settings size={16} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                        </div>
                        <span>Settings</span>
                      </a>
                    </li>
                    <li className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <Link
                        to="/logout"
                        className={`flex items-center w-full px-4 py-2 text-sm ${darkMode ? 'text-red-400 hover:bg-gray-700' : 'text-red-600 hover:bg-gray-100'}`}
                      >
                        <div className="w-8">
                          <LogOut size={16} className={darkMode ? 'text-red-400' : 'text-red-600'} />
                        </div>
                        <span>Logout</span>
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="px-6 py-6">
          {/* Welcome Message */}
          <div className={`mb-6 p-6 rounded-xl ${darkMode ? 'bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-800' : 'bg-gradient-to-r from-blue-50 to-emerald-50 border border-blue-100'}`}>
            <div className="flex justify-between items-center">
              <div>
                <h3 className={`text-xl font-semibold mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Welcome back, {info.username || 'User'}!
                </h3>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Your teams have completed 7 tasks this week. Check your recent activity below.
                </p>
              </div>
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
                <UserPlus size={24} className="text-blue-500" />
              </div>
            </div>
          </div>
          
          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {[
              { label: 'Total Teams', value: '12', icon: Users, color: 'blue' },
              { label: 'Active Tasks', value: '48', icon: CheckCircle, color: 'emerald' },
              { label: 'Team Members', value: '36', icon: Users, color: 'purple' },
              { label: 'Completed', value: '284', icon: BarChart2, color: 'amber' },
            ].map((stat, index) => (
              <div 
                key={index}
                className={`p-5 rounded-xl ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-100'} shadow-sm`}
              >
                <div className="flex justify-between">
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</p>
                    <p className={`text-2xl font-bold mt-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-${stat.color}-100 text-${stat.color}-600 ${darkMode ? `bg-${stat.color}-900/30 text-${stat.color}-400` : ''}`}>
                    <stat.icon size={20} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Dashboard Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Team Members Card */}
            <div className={`rounded-xl shadow-sm p-5 ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-100'}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Team Members</h3>
                <div className={`p-2 rounded-lg ${darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                  <Users size={18} />
                </div>
              </div>
              <TeamListPreview />
            </div>

            {/* Tasks Card */}
            <div className={`rounded-xl shadow-sm p-5 ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-100'}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Recent Tasks</h3>
                <div className={`p-2 rounded-lg ${darkMode ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-100 text-emerald-600'}`}>
                  <CheckCircle size={18} />
                </div>
              </div>
              <TaskListPreview />
            </div>

            {/* Create Team Card */}
            <div className={`rounded-xl shadow-sm p-5 ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-100'}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Create Team</h3>
                <div className={`p-2 rounded-lg ${darkMode ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>
                  <Users size={18} />
                </div>
              </div>
              <CreateTeamPreview />
            </div>

            {/* Real-time Updates Card */}
            <div className={`rounded-xl shadow-sm p-5 ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-100'}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Recent Updates</h3>
                <div className={`p-2 rounded-lg ${darkMode ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-100 text-amber-600'}`}>
                  <Bell size={18} />
                </div>
              </div>
              <Notifications />
            </div>

            {/* Manage Users Card */}
            <div className={`rounded-xl shadow-sm p-5 ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-100'}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Manage Users</h3>
                <div className={`p-2 rounded-lg ${darkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-600'}`}>
                  <UserCog size={18} />
                </div>
              </div>
              <ManageUserPreview />
            </div>

            {/* Empty Card for Future Features */}
            <div className={`rounded-xl shadow-sm p-5 flex items-center justify-center ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-100'}`}>
              <div className="text-center">
                <div className={`h-12 w-12 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} flex items-center justify-center mx-auto mb-3`}>
                  <Settings size={22} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                </div>
                <p className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>New Features</p>
                <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Coming Soon</p>
              </div>
            </div>

            {/* Data Visualization Card (Full Width) */}
            <div className={`md:col-span-2 lg:col-span-3 rounded-xl shadow-sm p-5 ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-100'}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Performance Analytics</h3>
                <div className={`p-2 rounded-lg ${darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                  <BarChart2 size={18} />
                </div>
              </div>
              <DataSummary />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;