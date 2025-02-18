import { useEffect, useState } from "react";
import api from '../../api';
import { Link } from "react-router-dom";
import { ChartArea } from 'lucide-react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { motion } from "framer-motion";

const DataSummary = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload[0]) return null;
    const { category, name, value } = payload[0].payload;
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
        <p className="font-bold text-indigo-600">{category}</p>
        <p className="text-gray-700">{name}</p>
        <p className="text-gray-900 font-semibold">Count: {value}</p>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-lg">
        <div className="text-lg font-medium text-gray-600">Loading visualization...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-lg">
        <div className="text-red-500 text-lg font-medium bg-red-50 px-6 py-3 rounded-lg">
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
      className="p-8 bg-gradient-to-r from-blue-50 to-purple-50 shadow-lg rounded-xl"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Data Overview</h2>
        <p className="text-gray-600">ManageIQ gives Data Visualization</p>
      </div>

      <div className="h-[500px] mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
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
              tick={{ fill: '#4a5568', fontSize: 14, fontWeight: "bold" }}
              axisLine={{ stroke: '#cbd5e0' }}
            />
            <ZAxis
              type="number"
              dataKey="value"
              range={[100, 1000]} // Increased range for bigger bubbles
              name="Count"
            />
            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: "3 3" }} />
            <Scatter
              data={data}
              fill="#4F46E5" // Indigo color for better contrast
              opacity={0.9}
              shape={({ cx, cy, payload }) => (
                <motion.circle
                  cx={cx}
                  cy={cy}
                  r={Math.sqrt(payload.value) * 3} // Adjusted bubble size
                  fill="#4F46E5"
                  stroke="#2D3748"
                  strokeWidth={2}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  whileHover={{ scale: 1.3, fill: "#FACC15", stroke: "#1F2937" }} // Yellow on hover
                />
              )}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="inline-block"
      >
        <Link
          to="/data"
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-md"
        >
          View Detailed Analysis
          <ChartArea className="w-4 h-4" />
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default DataSummary;
