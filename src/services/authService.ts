import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Automatically attach JWT token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export const login = async (email: string, password: string) => {
  try {
    const res = await API.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('refreshToken', res.data.refreshToken);
  } catch (err) {
    console.error('Login failed:', err);
    throw err;
  }
};


export const signup = async (name: string, email: string, password: string) => {
  try {
    const res = await API.post('/auth/signup', { name, email, password });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('refreshToken', res.data.refreshToken);
  } catch (err) {
    console.error('Signup failed:', err);
    throw err;
  }
};


export const refreshToken = async (refreshToken: string): Promise<void> => {
  try {
    const res = await API.post('/auth/refresh', { refreshToken });
    localStorage.setItem('token', res.data.token);
  } catch (err) {
    console.error('Refresh token failed:', err);
    throw err;
  }
};


export const updateUser = async (name: string, email: string, password: string) => {
  try {
    await API.put('/auth/update', { name, email, password });
  } catch (err) {
    console.error('Update user failed:', err);
    throw err;
  }
};


export const deleteUser = async () => {
  try {
    await API.delete('/auth/delete');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  } catch (err) {
    console.error('Delete user failed:', err);
    throw err;
  }
};
