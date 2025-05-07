import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

const COLORS = ['#8884d8', '#00C49F', '#FFBB28', '#FF8042', '#FF6384'];

const ExpenseChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/expenses/summary-by-category`, {
          withCredentials: true,
        });
        const formatted = res.data.map((item: any) => ({
          name: item.category,
          value: item.total,
        }));
        setData(formatted);
      } catch (err: any) {
        setError('Failed to load chart data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, []);

  return (
    <div className="w-full h-80 bg-[#282c34] rounded-xl p-4">
      {loading ? (
        <p className="text-white text-center">Loading chart...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {data.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default ExpenseChart;
