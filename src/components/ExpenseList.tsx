// src/components/ExpenseList.tsx
import { useEffect, useMemo, useState } from 'react';
import ExpenseItem from './ExpenseItem';
import { getExpenses, type Expense } from '../services/expenseService';

function useDebounced<T>(value: T, ms = 300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setV(value), ms);
    return () => clearTimeout(id);
  }, [value, ms]);
  return v;
}

const ExpenseList = ({
  refreshFlag,
  query = '',
}: {
  refreshFlag: number;
  query?: string;
}) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [localSearch, setLocalSearch] = useState(''); // local override if you want per-list searching
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // prefer header query; fall back to local input
  const effectiveQuery = (query ?? '').trim() || (localSearch ?? '').trim();
  const debouncedQuery = useDebounced(effectiveQuery, 300);

  const fetchExpenses = async (signal?: AbortSignal) => {
    setLoading(true);
    setError('');
    try {
      const data = await getExpenses(
        {
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          sort: sortOrder,              // 'asc' | 'desc'
          search: debouncedQuery || undefined, // <-- pass to API if supported
        },
        signal
      );
      setExpenses(data || []);
    } catch (err: any) {
      if (err.name === 'CanceledError') return;
      console.error(err);
      setError('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  // initial + whenever filters or refreshFlag change
  useEffect(() => {
    const controller = new AbortController();
    fetchExpenses(controller.signal);
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshFlag, startDate, endDate, sortOrder, debouncedQuery]);

  // normalize title->description if backend differs
  const normalized = useMemo(
    () =>
      (expenses || []).map((e) => ({
        ...e,
        description: (e as any).description ?? (e as any).title ?? '',
      })),
    [expenses]
  );

  // if your backend already supports ?search, you can drop this client-side filter
  const filtered = useMemo(() => {
    const q = (effectiveQuery || '').toLowerCase();
    if (!q) return normalized;
    return normalized.filter((expense) =>
      (expense.description || '').toLowerCase().includes(q) ||
      (expense.category || '').toLowerCase().includes(q)
    );
  }, [normalized, effectiveQuery]);

  return (
    <div className="p-4 rounded-md text-white border border-white">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          // manual apply triggers by changing a dep (e.g., refreshFlag) is optional,
          // but we already refetch on date/sort change automatically.
          // If you only want fetch on button click, move fetch to here and remove deps.
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

      {/* Optional component-local search; if you rely on header query only, you can remove this input */}
      <input
        type="text"
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
        placeholder="Search by description or category"
        className="w-full mb-4 p-2 border border-white bg-transparent text-white rounded placeholder-gray-400"
      />

      {loading && <p className="text-center text-gray-400">Loading expenses...</p>}
      {error && <p className="text-red-400 text-center">{error}</p>}
      {!loading && filtered.length === 0 ? (
        <p className="text-gray-400 text-center">No matching expenses.</p>
      ) : (
        filtered.map((expense) => (
          <ExpenseItem key={String(expense.id)} {...expense} />
        ))
      )}
    </div>
  );
};

export default ExpenseList;
