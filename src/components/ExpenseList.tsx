// src/components/ExpenseList.tsx
import { useEffect, useMemo, useState } from 'react';
import ExpenseItem from './ExpenseItem';
import { getExpenses, type Expense } from '../services/expenseService'; // ✅ uses shared API

const ExpenseList = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const fetchExpenses = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getExpenses({
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        sort: sortOrder,
      });
      setExpenses(data || []);
    } catch (err: any) {
      console.error(err);
      setError('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If your backend uses `title`, normalize here so the UI can search by description
  const normalized = useMemo(
    () =>
      (expenses || []).map((e) => ({
        ...e,
        description: (e as any).description ?? (e as any).title ?? '',
      })),
    [expenses]
  );

  const filteredExpenses = normalized.filter((expense) => {
    const q = searchTerm.toLowerCase();
    return (
      (expense.description || '').toLowerCase().includes(q) ||
      (expense.category || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-4 rounded-md text-white border border-white">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchExpenses();
        }}
        className="flex flex-wrap gap-3 mb-4"
      >
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border border-white bg-transparent text-white p-2 rounded"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border border-white bg-transparent text-white p-2 rounded"
        />
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
          className="border border-white bg-transparent text-white p-2 rounded"
        >
          <option value="desc">Newest</option>
          <option value="asc">Oldest</option>
        </select>
        <button
          type="submit"
          className="px-4 py-2 bg-white hover:bg-teal-500 transition text-black font-semibold rounded-md"
        >
          Apply
        </button>
      </form>

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by description or category"
        className="w-full mb-4 p-2 border border-white bg-transparent text-white rounded placeholder-gray-400"
      />

      {loading && <p className="text-center text-gray-400">Loading expenses...</p>}
      {error && <p className="text-red-400 text-center">{error}</p>}
      {!loading && filteredExpenses.length === 0 ? (
        <p className="text-gray-400 text-center">No matching expenses.</p>
      ) : (
        filteredExpenses.map((expense) => (
          <ExpenseItem key={String(expense.id)} {...expense} />
        ))
      )}
    </div>
  );
};

export default ExpenseList;
