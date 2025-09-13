import axios, { AxiosError } from 'axios';

export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

api.interceptors.request.use(cfg => {
  const t = localStorage.getItem('token');
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

export type ApiError =
  | { type: 'Auth'; status: 401 | 403; message: string }
  | { type: 'RateLimit'; status: 429; message: string; retryAfter?: number }
  | { type: 'Validation'; status: 400 | 422; fields?: Record<string,string> }
  | { type: 'Server'; status: 500; message: string }
  | { type: 'Network'; status: 0; message: string };

export function toApiError(e: unknown): ApiError {
  const err = e as AxiosError<any>;
  const s = err.response?.status ?? 0;
  if (!s) return { type: 'Network', status: 0, message: 'Network error' };
  if (s === 401 || s === 403) return { type: 'Auth', status: s, message: 'Unauthorized' };
  if (s === 429) return { type: 'RateLimit', status: 429, message: 'Too Many Requests',
    retryAfter: Number(err.response?.headers?.['retry-after']) || undefined };
  if (s === 400 || s === 422) return { type: 'Validation', status: s,
    fields: err.response?.data?.fieldErrors };
  if (s >= 500) return { type: 'Server', status: 500, message: 'Server error' };
  return { type: 'Server', status: s as any, message: 'Unexpected error' };
}
