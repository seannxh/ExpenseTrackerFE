import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

/** Base URL MUST include /api at the end. */
const rawBase = import.meta.env.VITE_API_URL;
if (!rawBase) throw new Error('VITE_API_URL is not defined. Example: https://<env>.elasticbeanstalk.com/api');

export const API = axios.create({
  baseURL: rawBase.replace(/\/+$/, ''), // trim trailing slash
});

/** -------- Types -------- */
export type AuthResponse = {
  token?: string;
  accessToken?: string;
  refreshToken?: string;
  refresh_token?: string;
};
export type LoginCredentials = { email: string; password: string };
export type SignupCredentials = { name: string; email: string; password: string };
export type UpdateUserData = { name?: string; email?: string; password?: string };

/** -------- Helpers -------- */
const pickToken   = (d: AuthResponse) => d.token ?? d.accessToken ?? '';
const pickRefresh = (d: AuthResponse) => d.refreshToken ?? d.refresh_token ?? '';

export const setAuthToken = (jwt: string | null) => {
  if (jwt && jwt.trim()) {
    localStorage.setItem('token', jwt);
    API.defaults.headers.Authorization = `Bearer ${jwt}`;
  } else {
    localStorage.removeItem('token');
    delete API.defaults.headers.Authorization;
  }
};

export const setRefreshToken = (rt: string | null) => {
  if (rt && rt.trim()) localStorage.setItem('refreshToken', rt);
  else localStorage.removeItem('refreshToken');
};

/** Initialize default header from storage (call once on app boot) */
export const initAuthFromStorage = () => {
  const t = localStorage.getItem('token');
  if (t) API.defaults.headers.Authorization = `Bearer ${t}`;
};

/** Always attach JWT */
API.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const t = localStorage.getItem('token');
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

/** Optional: auto-refresh on 401 with single-flight */
let isRefreshing = false;
let waiters: Array<(t: string) => void> = [];

API.interceptors.response.use(
  (r) => r,
  async (err: AxiosError) => {
    const status = err.response?.status;
    const original: any = err.config || {};
    if (status === 401 && !original._retry) {
      const rt = localStorage.getItem('refreshToken');
      if (!rt) return Promise.reject(err);

      if (isRefreshing) {
        return new Promise((resolve) => {
          waiters.push((newT) => {
            original._retry = true;
            original.headers = { ...(original.headers || {}), Authorization: `Bearer ${newT}` };
            resolve(API(original));
          });
        });
      }

      try {
        isRefreshing = true;
        original._retry = true;
        const res = await API.post<AuthResponse>('/auth/refresh', { refreshToken: rt }, {
          headers: { 'Content-Type': 'application/json' }
        });
        const newT = pickToken(res.data);
        if (!newT) throw new Error('No token in refresh response');
        setAuthToken(newT);

        waiters.forEach(fn => fn(newT));
        waiters = [];

        original.headers = { ...(original.headers || {}), Authorization: `Bearer ${newT}` };
        return API(original);
      } catch (e) {
        setAuthToken(null);
        setRefreshToken(null);
        waiters = [];
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(err);
  }
);

/** -------- Auth endpoints aligned to Swagger -------- */
export const login = async (credentials: LoginCredentials) => {
  const res = await API.post<AuthResponse>('/auth/login', credentials, {
    headers: { 'Content-Type': 'application/json' },
  });
  const token = pickToken(res.data);
  const refresh = pickRefresh(res.data);
  if (!token) throw new Error('Login succeeded but no token in response');
  setAuthToken(token);
  setRefreshToken(refresh);
  return { token, refreshToken: refresh };
};

export const signup = async (credentials: SignupCredentials) => {
  const res = await API.post<AuthResponse>('/auth/signup', credentials, {
    headers: { 'Content-Type': 'application/json' },
  });
  const token = pickToken(res.data);
  const refresh = pickRefresh(res.data);
  if (!token) throw new Error('Signup succeeded but no token in response');
  setAuthToken(token);
  setRefreshToken(refresh);
  return { token, refreshToken: refresh };
};

export const refreshToken = async (refreshToken: string) => {
  const res = await API.post<AuthResponse>('/auth/refresh', { refreshToken }, {
    headers: { 'Content-Type': 'application/json' },
  });
  const newT = pickToken(res.data);
  if (!newT) throw new Error('No token returned from refresh');
  setAuthToken(newT);
  return { token: newT };
};

export const updateUser = async (data: UpdateUserData): Promise<void> => {
  await API.put('/auth/update', data, { headers: { 'Content-Type': 'application/json' } });
};

export const deleteUser = async (): Promise<void> => {
  await API.delete('/auth/delete');
  setAuthToken(null);
  setRefreshToken(null);
};

export const signout = () => {
  setAuthToken(null);
  setRefreshToken(null);
}
