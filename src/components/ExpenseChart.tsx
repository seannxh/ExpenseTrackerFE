// src/components/ExpenseChart.tsx
import { useEffect, useMemo, useRef, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getExpenses } from '../services/expenseService';

type Slice = { name: string; value: number };

const CATEGORY_COLORS = ['#ef4444', '#3b82f6', '#8b5cf6', '#facc15', '#fb923c']; 
// red, blue, purple, yellow, orange
const REMAINING_COLOR = '#22c55e'; // green for take-home (Remaining)

type Props = {
  refreshFlag: number;
  query?: string;
  takeHome?: number;
};

const ExpenseChart = ({ refreshFlag, query = '', takeHome = 0 }: Props) => {
  const [data, setData] = useState<Slice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    const controller = new AbortController();

    const run = async () => {
      setLoading(true);
      setError('');
      try {
        const expenses = await getExpenses(
          {
            sort: 'desc', search: query || undefined,
            startDate: undefined,
            endDate: undefined
          },
          controller.signal
        );

        const spent = (expenses || []).reduce((sum, e: any) => {
          const n = typeof e.amount === 'number' ? e.amount : Number(e.amount);
          return Number.isFinite(n) ? sum + n : sum;
        }, 0);

        const byCat = (expenses || []).reduce<Record<string, number>>((acc, e: any) => {
          const key = e.category || 'Uncategorized';
          const amt = typeof e.amount === 'number' ? e.amount : Number(e.amount);
          if (!Number.isFinite(amt)) return acc;
          acc[key] = (acc[key] ?? 0) + amt;
          return acc;
        }, {});
        const categories: Slice[] = Object.entries(byCat).map(([name, value]) => ({ name, value }));

        let pie: Slice[];
        if (takeHome > 0) {
          const remaining = Math.max(takeHome - spent, 0);
          pie = [...categories, { name: 'Remaining', value: remaining }];
        } else {
          pie = categories.length ? categories : [{ name: 'No expenses', value: 1 }];
        }

        if (mounted.current) setData(pie);
      } catch (err: any) {
        if (err?.name === 'CanceledError') return;
        console.error('[chart] failed to load expenses:', err?.response?.status, err?.response?.data);
        if (mounted.current) setError('Failed to load chart data');
      } finally {
        if (mounted.current) setLoading(false);
      }
    };

    run();
    return () => {
      mounted.current = false;
      controller.abort();
    };
  }, [refreshFlag, query, takeHome]);

  const colors = useMemo(
    () =>
      data.map((s, i) =>
        s.name === 'Remaining'
          ? REMAINING_COLOR
          : CATEGORY_COLORS[i % CATEGORY_COLORS.length]
      ),
    [data]
  );

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
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={30}
              outerRadius={90}
              dataKey="value"
              nameKey="name"
              label
            >
              {data.map((_, i) => (
                <Cell key={i} fill={colors[i]} />
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
