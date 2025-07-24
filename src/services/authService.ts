import axios from 'axios';
import { createRunnableDevEnvironment } from 'vite';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

if (!API) throw new Error('API base URL is not defined');

// Automatically attach JWT token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


type LoginResponse = {
  token: string;
  refreshToken: string;
};


export const login = async (credentials: { email: string; password: string }): Promise<LoginResponse> => {
  try {
    const res = await API.post<LoginResponse>('/auth/login', credentials);
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('refreshToken', res.data.refreshToken);
    return res.data;
  } catch (err) {
    console.error('Login failed:', err);
    throw err;
  } 
}

type AuthResponse = {
  token: string;
  refreshToken: string;
};

type SignupCredentials = {
  name: string;
  email: string;
  password: string;
};


export const signup = async (credentials: SignupCredentials): Promise<AuthResponse> => {
  try {
    const res = await API.post<AuthResponse>('/auth/signup', credentials);
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('refreshToken', res.data.refreshToken);
    return res.data;
  } catch (err) {
    console.error('Signup failed:', err);
    throw err;
  }
};

type RefreshTokenResponse = {
  token: string;
};

export const refreshToken = async (refreshToken: string): Promise<RefreshTokenResponse> => {
  try {
    const res = await API.post('/auth/refresh', { refreshToken });
    localStorage.setItem('token', res.data.token);
    return res.data;
  } catch (err) {
    console.error('Refresh token failed:', err);
    throw err;
  }
};

type UpdateUserData = {
  name?: string;
  email?: string;
  password?: string;
};
export const updateUser = async (data: UpdateUserData): Promise<void> => {
  try {
    await API.put('/auth/update', data);
  } catch (err) {
    console.error('Update user failed:', err);
    throw err;
  }
};


export const deleteUser = async (): Promise<void> => {
  try {
    await API.delete('/auth/delete');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  } catch (err) {
    console.error('Delete user failed:', err);
    throw err;
  }
};
