import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Circle, Clock, AlertCircle, ChevronRight, Plus } from 'lucide-react';

const TaskListWidget = () => {
  // Sample task data - in real implementation, this would come from your API
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Update user documentation', status: 'completed', priority: 'medium', dueDate: '2025-03-25' },
    { id: 2, title: 'Fix login page responsiveness', status: 'in-progress', priority: 'high', dueDate: '2025-03-23' },
    { id: 3, title: 'Implement new analytics dashboard', status: 'pending', priority: 'high', dueDate: '2025-03-28' },
    { id: 4, title: 'Review pull requests', status: 'in-progress', priority: 'medium', dueDate: '2025-03-24' },
  ]);

  // Filter states
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Calculate statistics
  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    pending: tasks.filter(t => t.status === 'pending').length,
    late: tasks.filter(t => {
      const dueDate = new Date(t.dueDate);
      const today = new Date();
      return dueDate < today && t.status !== 'completed';
    }).length
  };

  // Filter tasks based on selected status
  const filteredTasks = statusFilter === 'all' 
    ? tasks 
    : tasks.filter(task => task.status === statusFilter);

  // Calculate completion percentage
  const completionPercentage = Math.round((stats.completed / stats.total) * 100) || 0;

  // Animation variants
  const taskVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: i => ({ 
      opacity: 1, 
      y: 0, 
      transition: { 
        delay: i * 0.05,
        duration: 0.2
      } 
    }),
    exit: { opacity: 0, x: -10 }
  };

  // Status icon mapping
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'in-progress':
        return <Clock size={16} className="text-blue-500" />;
      case 'pending':
        return <Circle size={16} className="text-gray-400" />;
      default:
        return <AlertCircle size={16} className="text-red-500" />;
    }
  };

  // Priority color mapping
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Check if task is overdue
  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date() ? 'text-red-500' : '';
  };

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Task Completion</span>
          <span className="text-sm font-bold">{completionPercentage}%</span>
        </div>
        <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: 'Total', value: stats.total, color: 'from-gray-400 to-gray-500' },
          { label: 'In Progress', value: stats.inProgress, color: 'from-blue-400 to-blue-500' },
          { label: 'Pending', value: stats.pending, color: 'from-yellow-400 to-yellow-500' },
          { label: 'Late', value: stats.late, color: 'from-red-400 to-red-500' },
        ].map((stat, index) => (
          <div key={index} className="flex flex-col items-center justify-center p-2 rounded-lg bg-gradient-to-br bg-opacity-10">
            <span className={`text-lg font-bold bg-gradient-to-r ${stat.color} text-transparent bg-clip-text`}>{stat.value}</span>
            <span className="text-xs opacity-70">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex space-x-2">
        {['all', 'completed', 'in-progress', 'pending'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1 text-xs rounded-full transition-all ${
              statusFilter === status 
                ? 'bg-blue-100 text-blue-700 font-medium' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-3 max-h-60 overflow-y-auto pr-2 scrollbar-thin">
        <AnimatePresence>
          {filteredTasks.length ? (
            filteredTasks.map((task, index) => (
              <motion.div
                key={task.id}
                custom={index}
                variants={taskVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="p-3 rounded-lg border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all duration-200 group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(task.status)}
                    <span className="font-medium">{task.title}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    <span className={`text-xs ${isOverdue(task.dueDate)}`}>
                      {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                    <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-6 text-center"
            >
              <p className="text-gray-500 mb-2">No tasks found with this filter</p>
              <button className="text-blue-500 flex items-center space-x-1 text-sm">
                <span>Create a task</span>
                <Plus size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* View all link */}
      <div className="flex justify-end">
        <button className="text-sm font-medium text-blue-600 flex items-center space-x-1 group">
          <span>View all tasks</span>
          <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default TaskListWidget;