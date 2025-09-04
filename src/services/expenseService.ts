import { API } from './authService';

export interface Expense {
  id?: number;
  title: string;
  amount: number;
  date: string;   // ISO yyyy-mm-dd
  category: string;
}

export const getExpenses = async (params?: { startDate?: string; endDate?: string; sort?: 'asc' | 'desc' }) => {
  // Swagger showed usage like: /api/expenses?startDate=&endDate=&sort=desc
  const res = await API.get('/expenses', { params });
  return res.data as Expense[];
};

export const getExpenseById = async (id: number) => {
  const res = await API.get(`/expenses/${id}`);
  return res.data as Expense;
};

export const createExpense = async (expense: Omit<Expense, 'id'>) => {
  // Swagger shows POST /api/expenses
  const res = await API.post('/expenses', expense, { headers: { 'Content-Type': 'application/json' } });
  return res.data as Expense;
};

export const updateExpense = async (id: number, expense: Omit<Expense, 'id'>) => {
  const res = await API.put(`/expenses/${id}`, expense, { headers: { 'Content-Type': 'application/json' } });
  return res.data as Expense;
};

export const deleteExpense = async (id: number) => {
  await API.delete(`/expenses/${id}`);
};

export const getSummaryByCategory = async () => {
  // Swagger log showed /api/expenses/summary-by-category
  const res = await API.get('/expenses/summary-by-category');
  return res.data as Array<{ category: string; total: number }>;
};
