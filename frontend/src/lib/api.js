import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || '',
});

// Attach the JWT to every request when available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Central 401 handling: clear the token and send the user back to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      const { pathname } = window.location;
      const noRedirectPaths = ['/', '/login', '/signup', '/captain-login', '/captain-signup', '/user/logout', '/captain/logout'];
      if (!noRedirectPaths.includes(pathname)) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Convert an axios error (or any error) into a safe, user-friendly message.
 * Never surfaces raw backend stack traces.
 */
export function getErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  if (!error) return fallback;
  const data = error.response?.data;
  if (typeof data === 'string' && data.trim()) return data;
  if (data?.message && typeof data.message === 'string') return data.message;
  if (Array.isArray(data?.errors) && data.errors.length > 0) {
    return data.errors[0]?.msg || fallback;
  }
  if (error.code === 'ERR_NETWORK') {
    return 'Network error. Check your connection and try again.';
  }
  if (error.message && !error.message.includes('Request failed')) {
    return error.message;
  }
  return fallback;
}

export default api;
