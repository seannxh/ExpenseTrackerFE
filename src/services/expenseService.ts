import axios from 'axios';


const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Automatically attach token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Expense type
export interface Expense {
  id?: number;
  title: string;
  amount: number;
  date: string;
  category: string;
}


export const getExpenses = async (): Promise<Expense[]> => {
  try {
    const res = await API.get('/expenses/myexpense');
    return res.data;
  } catch (err) {
    console.error('Error fetching expenses:', err);
    throw err;
  }
};

export const createExpense = async (expense: Omit<Expense, 'id'>): Promise<Expense> => {
  try {
    const res = await API.post('/expenses/create', expense);
    return res.data;
  } catch (err) {
    console.error('Error creating expense:', err);
    throw err;
  }
};


export const deleteExpense = async (id: number): Promise<void> => {
  try {
    await API.delete(`/expenses/${id}`);
  } catch (err) {
    console.error(`Error deleting expense ${id}:`, err);
    throw err;
  }
};


export const updateExpense = async (id: number, expense: Omit<Expense, 'id'>): Promise<Expense> => {
  try {
    const res = await API.put(`/expenses/${id}`, expense);
    return res.data;
  } catch (err) {
    console.error(`Error updating expense ${id}:`, err);
    throw err;
  }
};


export const getExpenseById = async (id: number): Promise<Expense> => {
  try {
    const res = await API.get(`/expenses/${id}`);
    return res.data;
  } catch (err) {
    console.error(`Error fetching expense ${id}:`, err);
    throw err;
  }
};
