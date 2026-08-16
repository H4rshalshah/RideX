import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { useEffect } from 'react';

const ToastContext = createContext(null);

const styles = {
  success: 'bg-ink-900 text-white',
  error: 'bg-red-600 text-white',
  info: 'bg-brand-600 text-white',
};

let counter = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    clearTimeout(timers.current[id]);
    delete timers.current[id];
  }, []);

  const push = useCallback(
    (message, type = 'info', duration = 4000) => {
      const id = ++counter;
      setToasts((prev) => [...prev.slice(-2), { id, message, type }]);
      timers.current[id] = setTimeout(() => dismiss(id), duration);
    },
    [dismiss]
  );

  useEffect(() => {
    const current = timers.current;
    return () => Object.values(current).forEach(clearTimeout);
  }, []);

  return (
    <ToastContext.Provider value={{ toast: push, dismiss }}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2 px-4"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`pointer-events-auto flex max-w-md items-start gap-3 rounded-xl px-4 py-3 text-sm font-medium shadow-lift animate-[fadeIn_.2s_ease] ${styles[t.type]}`}
          >
            <span className="flex-1">{t.message}</span>
            <button
              onClick={() => dismiss(t.id)}
              className="text-current/70 hover:text-current"
              aria-label="Dismiss notification"
            >
              <i className="ri-close-line text-lg leading-none" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
};
