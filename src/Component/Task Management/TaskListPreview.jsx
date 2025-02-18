import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import { 
  MoreVertical,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

const TaskStatusBadge = ({ status }) => {
  const statusConfig = {
    'completed': { 
      icon: CheckCircle, 
      color: 'bg-green-50 text-green-600 border-green-200',
      text: 'Completed'
    },
    'in_progress': { 
      icon: Clock, 
      color: 'bg-blue-50 text-blue-600 border-blue-200',
      text: 'In Progress'
    },
    'blocked': { 
      icon: AlertCircle, 
      color: 'bg-red-50 text-red-600 border-red-200',
      text: 'Blocked'
    }
  };

  const config = statusConfig[status] || { 
    icon: Clock, 
    color: 'bg-gray-50 text-gray-600 border-gray-200',
    text: 'Pending'
  };

  const Icon = config.icon;

  return (
    <span className={`
      inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
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
          .sort((a, b) => new Date(a.deadline) - new Date(b.deadline)).reverse()
          .slice(0, 3);
        
        setTasks(sortedTasks);
      } catch (err) {
        console.error("Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1,2,3].map(i => (
          <div key={i} className="animate-pulse flex items-center space-x-4">
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.length === 0 ? (
        <div className="text-center text-gray-500 py-4">
          No recent tasks
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {tasks.map((task) => (
            <div 
              key={task.id} 
              className="py-3 flex items-center justify-between hover:bg-gray-50 transition-colors group rounded-lg"
            >
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <div className="flex-1 min-w-0">
                  <p className="text-lg font-bold text-gray-900 truncate py-3">
                    {task.title}
                  </p>
                  <div className="mt-1 flex items-center space-x-2">
                    <TaskStatusBadge status={task.status} />
                    <span className="text-xs text-gray-500 px-8">
                      Due: {new Date(task.deadline).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="ml-3 flex items-center">
                <button className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="border-t pt-3">
        <Link 
          to="/tasks" 
          className="block text-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
        >
          View All Tasks
        </Link>
      </div>
    </div>
  );
};

export default TaskListPreview;