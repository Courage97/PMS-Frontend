import { useEffect, useState } from "react";
import api from '../../api';
import { Link } from "react-router-dom";
import { ChartArea, ArrowUpRight } from 'lucide-react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { motion } from "framer-motion";

const DataSummary = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredCategory, setHoveredCategory] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('access');
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [taskStatus, priority, assignedType, completion] = await Promise.all([
          api.get("task_status/", { headers }),
          api.get("task_priority/", { headers }),
          api.get("assigned_type/", { headers }),
          api.get("task_completion/", { headers }),
        ]);

        const transformedData = [
          ...taskStatus.data.map(d => ({ category: "Status", name: d.status, value: d.count })),
          ...priority.data.map(d => ({ category: "Priority", name: d.priority, value: d.count })),
          ...assignedType.data.map(d => ({ category: "Assignment", name: d.assigned_type, value: d.count })),
          ...completion.data.map(d => ({ category: "Completion", name: d.month, value: d.count })),
        ];
        setData(transformedData);
      } catch (error) {
        setError(error?.response?.data?.message || "Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const categories = [...new Set(data.map(item => item.category))];
  const categoryColors = {
    "Status": "#6366F1", // Indigo
    "Priority": "#EC4899", // Pink
    "Assignment": "#10B981", // Emerald
    "Completion": "#F59E0B", // Amber
  };

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload[0]) return null;
    const { category, name, value } = payload[0].payload;
    const bgColor = categoryColors[category] || "#6366F1";
    
    return (
      <div className="bg-white p-4 rounded-xl shadow-xl border border-gray-100 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: bgColor }}></div>
          <p className="font-bold text-gray-800">{category}</p>
        </div>
        <p className="text-gray-700 font-medium">{name}</p>
        <p className="text-2xl font-bold mt-1" style={{ color: bgColor }}>{value}</p>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px] bg-white rounded-2xl shadow-lg">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-lg font-medium text-gray-700">Preparing your visualization...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[500px] bg-white rounded-2xl shadow-lg">
        <div className="text-red-500 text-lg font-medium bg-red-50 px-6 py-4 rounded-xl border border-red-100 shadow-sm">
          {error}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="overflow-hidden bg-white shadow-xl rounded-2xl border border-gray-100"
    >
      {/* Gradient overlay for depth effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50 pointer-events-none rounded-2xl"></div>
      
      <div className="relative p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 inline-block">
            Data Overview
          </h2>
          <p className="text-gray-500 mt-2">
            Interactive visualization of your task management metrics
          </p>
          
          {/* Category legend */}
          <div className="flex flex-wrap gap-4 mt-6">
            {categories.map(category => (
              <motion.div
                key={category}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer"
                style={{
                  backgroundColor: hoveredCategory === category 
                    ? `${categoryColors[category]}20` // 20% opacity version of the color
                    : 'transparent',
                  border: `1px solid ${categoryColors[category]}`
                }}
                whileHover={{ scale: 1.05 }}
                onClick={() => setHoveredCategory(hoveredCategory === category ? null : category)}
              >
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: categoryColors[category] }}
                ></div>
                <span 
                  className="text-sm font-medium"
                  style={{ color: categoryColors[category] }}
                >
                  {category}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="h-[500px] relative mb-8">
          {/* Floating effect background elements */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-100/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-purple-100/40 rounded-full blur-3xl"></div>
          
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 30, right: 30, bottom: 60, left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" opacity={0.5} />
              <XAxis
                type="category"
                dataKey="category"
                name="Category"
                tick={{ fill: '#4a5568', fontSize: 14, fontWeight: "bold" }}
                axisLine={{ stroke: '#cbd5e0' }}
              />
              <YAxis
                type="category"
                dataKey="name"
                name="Task Type"
                tick={{ fill: '#4a5568', fontSize: 14 }}
                axisLine={{ stroke: '#cbd5e0' }}
              />
              <ZAxis
                type="number"
                dataKey="value"
                range={[100, 1200]}
                name="Count"
              />
              <Tooltip content={<CustomTooltip />} cursor={false} />
              <Scatter
                data={data.filter(d => !hoveredCategory || d.category === hoveredCategory)}
                fill="#4F46E5"
                opacity={0.9}
                shape={({ cx, cy, payload }) => {
                  const category = payload.category;
                  const isHovered = hoveredCategory === category;
                  const color = categoryColors[category] || "#6366F1";
                  const size = Math.sqrt(payload.value) * (isHovered ? 3.5 : 3);
                  
                  return (
                    <g>
                      {/* Shadow/glow effect */}
                      <motion.circle
                        cx={cx}
                        cy={cy}
                        r={size + 4}
                        fill={`${color}20`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5 }}
                      />
                      {/* Main circle */}
                      <motion.circle
                        cx={cx}
                        cy={cy}
                        r={size}
                        fill={color}
                        stroke={isHovered ? "white" : "transparent"}
                        strokeWidth={2}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        whileHover={{ scale: 1.2 }}
                      />
                      {/* Value label for larger bubbles */}
                      {payload.value > 20 && (
                        <text
                          x={cx}
                          y={cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill="white"
                          fontSize={payload.value > 50 ? 12 : 10}
                          fontWeight="bold"
                        >
                          {payload.value}
                        </text>
                      )}
                    </g>
                  );
                }}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Click on categories to filter the visualization
          </div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <Link
              to="/data"
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-indigo-200 transition-all duration-200"
            >
              View Detailed Analysis
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default DataSummary;