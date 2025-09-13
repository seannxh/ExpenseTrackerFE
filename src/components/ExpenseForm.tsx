// src/components/ExpenseForm.tsx
import { useMemo, useState } from 'react';
import { createExpense, type CreateExpenseDTO } from '../services/expenseService';

type Props = { onAdded?: () => void };

const ExpenseForm = ({ onAdded }: Props) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // NEW: track if user tried to submit, and per-field touch
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState<{title?: boolean; amount?: boolean; date?: boolean}>({});

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = 'Title is required';
    const n = Number(amount);
    if (!amount || Number.isNaN(n) || n <= 0) e.amount = 'Amount must be > 0';
    if (!date) e.date = 'Date is required';
    return e;
  }, [title, amount, date]);
   
  // helper: only show error if user interacted or tried to submit
  const showErr = (field: 'title' | 'amount' | 'date') =>
    (submitted || touched[field]) && errors[field];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);          // mark that user attempted submit
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
      setTitle(''); setAmount(''); setCategory('Food'); setDate('');
      setSubmitted(false);       // reset submit state for fresh form
      setTouched({});            // clear touched
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
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && (
        <p className={`text-sm ${message.startsWith('✅') ? 'text-teal-400' : 'text-red-400'}`}>
          {message}
        </p>
      )}

      <div>
        <input
          type="text"
          placeholder="Title"
          className={`w-full px-4 py-2 bg-transparent border ${
            showErr('title') ? 'border-red-400' : 'border-white'
          } text-white rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, title: true }))}  // mark touched
        />
        {showErr('title') && <p className="text-xs text-red-400 mt-1">{errors.title}</p>}
      </div>

      <div>
        <input
          type="number"
          inputMode="decimal"
          step="0.01"
          placeholder="Amount"
          className={`w-full px-4 py-2 bg-transparent border ${
            showErr('amount') ? 'border-red-400' : 'border-white'
          } text-white rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500`}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, amount: true }))} // mark touched
        />
        {showErr('amount') && <p className="text-xs text-red-400 mt-1">{errors.amount}</p>}
      </div>

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

      <div>
        <input
          type="date"
          className={`w-full px-4 py-2 bg-transparent border ${
            showErr('date') ? 'border-red-400' : 'border-white'
          } text-white rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500`}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, date: true }))}   // mark touched
        />
        {showErr('date') && <p className="text-xs text-red-400 mt-1">{errors.date}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-white hover:bg-teal-500 transition text-black font-semibold py-2 rounded-md disabled:opacity-60"
      >
        {loading ? 'Submitting…' : 'Add Expense'}
      </button>
    </form>
  );
};

export default ExpenseForm;
