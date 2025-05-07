import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const sendFinanceQuestion = async (response: string): Promise<string> => {
  try {
    const res = await API.post('/chat', { response });
    return res.data.response;
  } catch (err) {
    console.error('Chat AI failed:', err);
    throw err;
  }
};
