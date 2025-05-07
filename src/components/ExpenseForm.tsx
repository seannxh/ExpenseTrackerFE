import { useState } from 'react';
import axios from 'axios';

const ExpenseForm = () => {
  const [description, setDescription] = useState('');
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
      await axios.post(
        `${import.meta.env.VITE_API_URL}/expenses`,
        {
          description,
          amount: parseFloat(amount),
          category,
          date,
        },
        {
          withCredentials: true,
        }
      );

      setMessage('✅ Expense added successfully!');
      setDescription('');
      setAmount('');
      setCategory('Food');
      setDate('');
    } catch (error) {
      console.error(error);
      setMessage('❌ Failed to add expense.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 ">
      {message && (
        <p className={`text-sm ${message.includes('✅') ? 'text-teal-400' : 'text-red-400'}`}>
          {message}
        </p>
      )}

      <input
        type="text"
        placeholder="Description"
        className="w-full px-4 py-2 bg-transparent border border-white text-white rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
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
