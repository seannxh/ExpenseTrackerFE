// src/components/ExpenseForm.tsx
import { useState } from 'react';
import { createExpense } from '../services/expenseService'; // ✅ uses shared API

const ExpenseForm = () => {
  const [title, setTitle] = useState('');              // ← align with backend field (title)
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Not logged in (no token)');

      await createExpense({
        title,                                 // ✅ matches service/interface
        amount: Number(amount),
        category,
        date,                                  // ISO yyyy-mm-dd
      });

      setMessage('✅ Expense added successfully!');
      setTitle('');
      setAmount('');
      setCategory('Food');
      setDate('');
    } catch (err: any) {
      console.error(err);
      setMessage(`❌ Failed to add expense${err?.message ? `: ${err.message}` : ''}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && (
        <p className={`text-sm ${message.includes('✅') ? 'text-teal-400' : 'text-red-400'}`}>
          {message}
        </p>
      )}

      <input
        type="text"
        placeholder="Title"
        className="w-full px-4 py-2 bg-transparent border border-white text-white rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <input
        type="number"
        placeholder="Amount"
        className="w-full px-4 py-2 bg-transparent border border-white text-white rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full px-4 py-2 bg-transparent border border-white text-white rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
      >
        {['Food', 'Transport', 'Entertainment', 'Health', 'Utilities', 'Other'].map((cat) => (
          <option key={cat} value={cat} className="bg-[#1a1a1a] text-white">
            {cat}
          </option>
        ))}
      </select>

      <input
        type="date"
        className="w-full px-4 py-2 bg-transparent border border-white text-white rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-white hover:bg-teal-500 transition text-black font-semibold py-2 rounded-md"
      >
        {loading ? 'Submitting...' : 'Add Expense'}
      </button>
    </form>
  );
};

export default ExpenseForm;
