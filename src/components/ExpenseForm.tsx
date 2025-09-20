// src/components/ExpenseForm.tsx
import { useMemo, useState } from 'react';
import { createExpense } from '../services/expenseService';

type CreateExpenseDTO = {
  title: string;
  amount: number;
  category: string;
  date: string;
};

type Props = { onAdded?: () => void };

const ExpenseForm = ({ onAdded }: Props) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState<{ title?: boolean; amount?: boolean; date?: boolean }>({});

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = 'Title is required';
    const n = Number(amount);
    if (!amount || Number.isNaN(n) || n <= 0) e.amount = 'Amount must be > 0';
    if (!date) e.date = 'Date is required';
    return e;
  }, [title, amount, date]);

  const showErr = (field: 'title' | 'amount' | 'date') =>
    (submitted || touched[field]) && errors[field];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setMessage('');
    if (Object.keys(errors).length) {
      setMessage('❌ Please fix the highlighted fields.');
      return;
    }

    try {
      setLoading(true);
      const payload: CreateExpenseDTO = {
        title: title.trim(),
        amount: Number(amount),
        category,
        date,
      };

      await createExpense(payload);

      setMessage('✅ Expense added successfully!');
      setTitle('');
      setAmount('');
      setCategory('Food');
      setDate('');
      setSubmitted(false);
      setTouched({});
      onAdded?.();
    } catch (err: any) {
      const apiMsg: string | undefined = err?.response?.data?.error;
      setMessage(`❌ Failed to add expense${apiMsg ? `: ${apiMsg}` : ''}`);
      console.error('Add expense failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white/10 p-6 rounded-xl shadow-md">
      <div>
        <label className="block text-lg font-medium text-white mb-1">Title</label>
        <input
          className="w-full px-3 py-2 rounded-md border border-gray-300 bg-black text-white focus:outline-none focus:ring-2 focus:ring-green-700"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, title: true }))}
        />
        {showErr('title') && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
      </div>

      <div>
        <label className="block text-lg font-medium text-white mb-1">Amount</label>
        <input
          className="w-full px-3 py-2 rounded-md border border-gray-300 bg-black text-white focus:outline-none focus:ring-2 focus:ring-green-700"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, amount: true }))}
          inputMode="decimal"
        />
        {showErr('amount') && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
      </div>

      <div>
        <label className="block text-lg font-medium text-white mb-1">Category</label>
        <select
          className="w-full px-3 py-2 rounded-md border border-gray-300 bg-black text-white focus:outline-none focus:ring-2 focus:ring-green-700"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>Food</option>
          <option>Rent</option>
          <option>Utilities</option>
          <option>Transportation</option>
          <option>Other</option>
        </select>
      </div>

      <div>
        <label className="block text-lg font-medium text-white mb-1">Date</label>
        <input
          type="date"
          className="date-input w-full px-3 py-2 rounded-md border border-gray-300 bg-black text-white focus:outline-none focus:ring-2 focus:ring-green-700"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, date: true }))}
        />

        {showErr('date') && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 px-4 rounded-md bg-green-700 text-white font-semibold hover:bg-green-700 transition disabled:opacity-50"
      >
        {loading ? 'Adding…' : 'Add Expense'}
      </button>

      {message && <p className="text-sm text-center mt-2">{message}</p>}
    </form>
    );
  };

export default ExpenseForm;
