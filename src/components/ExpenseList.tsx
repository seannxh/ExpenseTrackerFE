import { useEffect, useState } from 'react';
import axios from 'axios';
import ExpenseItem from './ExpenseItem';

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

const ExpenseList = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/expenses`, {
        params: {
          startDate,
          endDate,
          sort: sortOrder,
        },
        withCredentials: true,
      });
      setExpenses(res.data);
    } catch (err: any) {
      console.error(err);
      setError('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const filteredExpenses = expenses.filter((expense) =>
    expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 rounded-md text-white border border-white ">
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
          onChange={(e) => setSortOrder(e.target.value)}
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
      {filteredExpenses.length === 0 && !loading ? (
        <p className="text-gray-400 text-center">No matching expenses.</p>
      ) : (
        filteredExpenses.map((expense) => (
          <ExpenseItem key={expense.id} {...expense} />
        ))
      )}
    </div>
  );
};

export default ExpenseList;
