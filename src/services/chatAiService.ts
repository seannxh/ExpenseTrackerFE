import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // e.g. http://localhost:8080/api
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Accept either shape from backend and normalize
type BackendResponse = { response?: string; reply?: string };

export async function sendChatMessage(
  message: string,
  signal?: AbortSignal
): Promise<{ reply: string }> {
  const { data } = await API.post<BackendResponse>(
    '/chat', // baseURL already includes /api if you set it that way
    { message },
    { signal, headers: { 'Content-Type': 'application/json' } }
  );

  const reply = data.reply ?? data.response ?? '';
  return { reply };
}
