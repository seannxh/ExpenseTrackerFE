// src/services/expenseService.ts
import { API } from './authService';

export interface Expense {
  id?: number;
  description: string;   // must match ExpenseModel field names
  amount: number;
  category: string;
  date: string;          // yyyy-MM-dd
}

// GET /api/expenses/myexpense
export const getExpenses = async (p0: { startDate: string | undefined; endDate: string | undefined; sort: "asc" | "desc"; search: string | undefined; }, signal: AbortSignal | undefined) => {
  const res = await API.get<Expense[]>('expenses/myexpense');
  return res.data;
};

// GET /api/expenses/{id}
export const getExpenseById = async (id: number) => {
  const res = await API.get<Expense>(`expenses/${id}`);
  return res.data;
};

// POST /api/expenses/create
export const createExpense = async (expense: Omit<Expense, 'id'>) => {
  const res = await API.post<Expense>('expenses/create', expense, {
    headers: { 'Content-Type': 'application/json' },
  });
  return res.data;
};

// PUT /api/expenses/{id}
export const updateExpense = async (id: number, expense: Omit<Expense, 'id'>) => {
  const res = await API.put<Expense>(`expenses/${id}`, expense, {
    headers: { 'Content-Type': 'application/json' },
  });
  return res.data;
};

// DELETE /api/expenses/{id}
export const deleteExpense = async (id: number) => {
  await API.delete(`expenses/${id}`);
};

export const getSummaryByCategory = async (params?: {
  startDate?: string;     
  endDate?: string;
}) => {
  const res = await API.get<Array<{ category: string; total: number }>>(
    'expenses/summary-by-category',
    { params }
  );
  return res.data;
};
