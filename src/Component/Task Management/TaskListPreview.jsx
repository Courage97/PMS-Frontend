import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import { 
  MoreVertical,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  ArrowRight,
  Loader2,
  ListFilter
} from 'lucide-react';

const TaskPriorityIndicator = ({ priority }) => {
  const priorityConfig = {
    'HIGH': { color: 'bg-red-500' },
    'MEDIUM': { color: 'bg-amber-500' },
    'LOW': { color: 'bg-green-500' },
  };

  const config = priorityConfig[priority] || { color: 'bg-gray-400' };

  return (
    <span className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-lg ${config.color}`} />
  );
};

const TaskStatusBadge = ({ status }) => {
  const statusConfig = {
    'completed': { 
      icon: CheckCircle, 
      color: 'bg-green-100 text-green-700 border-green-200',
      text: 'Completed'
    },
    'in_progress': { 
      icon: Clock, 
      color: 'bg-blue-100 text-blue-700 border-blue-200',
      text: 'In Progress'
    },
    'blocked': { 
      icon: AlertCircle, 
      color: 'bg-red-100 text-red-700 border-red-200',
      text: 'Blocked'
    },
    'pending': {
      icon: Clock,
      color: 'bg-amber-100 text-amber-700 border-amber-200',
      text: 'Pending'
    }
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <span className={`
      inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
      ${config.color} border
    `}>
      <Icon className="w-3.5 h-3.5 mr-1.5" />
      {config.text}
    </span>
  );
};

const TaskListPreview = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("access");
        const response = await api.get("/task/", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const sortedTasks = response.data
          .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
          .slice(0, 5);
        
        setTasks(sortedTasks);
      } catch (err) {
        console.error("Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const formatDueDate = (dateString) => {
    const date = new Date(dateString);
    
    // Today/Tomorrow/Yesterday logic
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const isToday = date.toDateString() === today.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();
    
    if (isToday) return 'Today';
    if (isTomorrow) return 'Tomorrow';
    if (isYesterday) return 'Yesterday';
    
    // Options for other dates
    const options = { month: 'short', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  const getTimeRemaining = (deadline) => {
    const now = new Date();
    const dueDate = new Date(deadline);
    const diffTime = dueDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    if (diffDays <= 7) return `Due in ${diffDays} days`;
    return formatDueDate(deadline);
  };

  const getDueDateColor = (deadline) => {
    const now = new Date();
    const dueDate = new Date(deadline);
    const diffTime = dueDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'text-red-600';
    if (diffDays === 0) return 'text-amber-600';
    if (diffDays <= 2) return 'text-amber-500';
    return 'text-gray-500';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Tasks</h3>
        </div>
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="animate-pulse flex items-center p-3">
              <div className="h-full w-1 bg-gray-200 rounded mr-3"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="flex space-x-2">
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
              <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-4">
          <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">Recent Tasks</h3>
          <Link 
            to="/tasks" 
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ListFilter className="w-4 h-4 mr-1.5" />
            View All
          </Link>
        </div>
      </div>
      
      {tasks.length === 0 ? (
        <div className="text-center text-gray-500 py-10 px-5 bg-gray-50">
          <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="font-medium">No tasks found</p>
          <p className="text-sm mt-1">Check back later for upcoming tasks</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {tasks.map((task) => (
            <div 
              key={task.id} 
              className="relative p-4 hover:bg-gray-50 transition-colors group cursor-pointer"
            >
              <TaskPriorityIndicator priority={task.priority} />
              
              <div className="flex items-center justify-between pl-2">
                <div className="min-w-0 flex-1">
                  <p className="text-base font-semibold text-gray-900 truncate">
                    {task.title}
                  </p>
                  
                  <div className="mt-2 flex items-center flex-wrap gap-2">
                    <TaskStatusBadge status={task.status} />
                    
                    <div className={`flex items-center text-xs ${getDueDateColor(task.deadline)}`}>
                      <Calendar className="w-3.5 h-3.5 mr-1" />
                      {getTimeRemaining(task.deadline)}
                    </div>
                  </div>
                </div>

                <div className="ml-4 flex shrink-0 items-center">
                  <button className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="bg-gray-50 p-3 border-t border-gray-100 flex justify-center">
        <Link 
          to="/tasks" 
          className="flex items-center justify-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors py-1.5 px-4 hover:bg-blue-50 rounded-lg"
        >
          View All Tasks
          <ArrowRight className="w-4 h-4 ml-1.5" />
        </Link>
      </div>
    </div>
  );
};

export default TaskListPreview;