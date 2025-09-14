// src/components/ExpenseForm.tsx
import { useMemo, useState } from 'react';
import { createExpense } from '../services/expenseService';

// Keep this DTO local so we don't depend on the Expense type from elsewhere
type CreateExpenseDTO = {
  description: string;       // map from `title`
  amount: number;            // send number, not string
  category: string;
  date: string;              // ISO or yyyy-mm-dd (backend should parse)
};

type Props = { onAdded?: () => void };

const ExpenseForm = ({ onAdded }: Props) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');      // keep as string for input
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

      // Build the payload VALUE (not a type)
      const payload: CreateExpenseDTO = {
        description: title.trim(),
        amount: Number(amount),
        category,
        date, // assuming yyyy-mm-dd from <input type="date" />
      };

      await createExpense(payload); // <-- pass the value

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
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label>Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, title: true }))}
        />
        {showErr('title') && <p className="text-red-600 text-sm">{errors.title}</p>}
      </div>

      <div>
        <label>Amount</label>
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, amount: true }))}
          inputMode="decimal"
        />
        {showErr('amount') && <p className="text-red-600 text-sm">{errors.amount}</p>}
      </div>

      <div>
        <label>Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option>Food</option>
          <option>Rent</option>
          <option>Utilities</option>
          <option>Transportation</option>
          <option>Other</option>
        </select>
      </div>

      <div>
        <label>Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, date: true }))}
        />
        {showErr('date') && <p className="text-red-600 text-sm">{errors.date}</p>}
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Adding…' : 'Add Expense'}
      </button>

      {message && <p>{message}</p>}
    </form>
  );
};

export default ExpenseForm;
