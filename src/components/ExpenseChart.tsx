// src/components/ExpenseChart.tsx
import { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { getExpenses } from '../services/expenseService';

type Slice = { name: string; value: number };

const COLORS = ['#8884d8', '#00C49F', '#FFBB28', '#FF8042', '#FF6384', '#36A2EB', '#9966FF'];

const ExpenseChart = () => {
  const [data, setData] = useState<Slice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const run = async () => {
      try {
        const expenses = await getExpenses(); // GET /api/expenses/myexpense
        // group by category
        const totals = expenses.reduce<Record<string, number>>((acc, e) => {
          const key = e.category || 'Uncategorized';
          const amt = typeof e.amount === 'number' ? e.amount : Number(e.amount);
          acc[key] = (acc[key] ?? 0) + (isNaN(amt) ? 0 : amt);
          return acc;
        }, {});
        const slices: Slice[] = Object.entries(totals).map(([name, value]) => ({ name, value }));
        setData(slices);
      } catch (err: any) {
        console.error('[chart] failed to load expenses:', { status: err?.response?.status, data: err?.response?.data });
        setError('Failed to load chart data');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  return (
    <div className="w-full h-80 bg-[#282c34] rounded-xl p-4">
      {loading ? (
        <p className="text-white text-center">Loading chart...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : data.length === 0 ? (
        <p className="text-gray-400 text-center">No data to display</p>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" outerRadius={90} dataKey="value" label>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
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
