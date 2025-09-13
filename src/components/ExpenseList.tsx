// keep only AUTO-FETCH style; remove manual submit fetch
// key changes: use debouncedQuery everywhere; guard dates; handle AbortError

import { useEffect, useMemo, useState, useCallback } from 'react';
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
  query,
  onChanged,
}: {
  refreshFlag: number;
  query?: string;
  onChanged?: () => void;
}) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [localSearch, setLocalSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const effectiveQuery = (query ?? '').trim() || (localSearch ?? '').trim();
  const debouncedQuery = useDebounced(effectiveQuery, 300);

  const queryParams = useMemo(
    () => ({
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      sort: sortOrder,
      search: debouncedQuery || undefined,
    }),
    [startDate, endDate, sortOrder, debouncedQuery]
  );

  const datesInvalid =
    startDate && endDate ? new Date(endDate) < new Date(startDate) : false;

  const fetchExpenses = useCallback(
    async (signal?: AbortSignal) => {
      if (datesInvalid) {
        setError('End date must be on/after start date');
        setExpenses([]);
        return;
      }
      setLoading(true);
      setError('');
      try {
        const data = await getExpenses(queryParams, signal);
        setExpenses(data || []);
      } catch (err: any) {
        // Handle both fetch and axios styles
        if (err?.name === 'AbortError' || err?.name === 'CanceledError') return;
        console.error(err);
        setError('Failed to load expenses');
      } finally {
        setLoading(false);
      }
    },
    [queryParams, datesInvalid]
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchExpenses(controller.signal);
    return () => controller.abort();
  }, [fetchExpenses, refreshFlag]);

  const normalized = useMemo(
    () =>
      (expenses || []).map((e) => ({
        ...e,
        description: (e as any).description ?? (e as any).title ?? '',
      })),
    [expenses]
  );

  // If server handles search, remove this client filter
  const filtered = useMemo(() => {
    const q = (debouncedQuery || '').toLowerCase();
    if (!q) return normalized;
    return normalized.filter(
      (expense) =>
        (expense.description || '').toLowerCase().includes(q) ||
        (expense.category || '').toLowerCase().includes(q)
    );
  }, [normalized, debouncedQuery]);

  return (
    <div className="p-4 rounded-md text-white border border-white">
      {/* Controls (no manual submit) */}
      <div className="flex flex-wrap gap-3 mb-4">
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
      </div>

      {datesInvalid && (
        <p className="text-yellow-300 mb-2">
          End date must be on/after start date.
        </p>
      )}

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
          <ExpenseItem
            key={String(expense.id)}
            {...expense}
            onDeleted={() => {
              // refetch list…
              fetchExpenses();
              // …and tell Dashboard to bump -> refresh chart
              onChanged?.();
            }}
          />
        ))
      )}
    </div>
  );
};

export default ExpenseList;
