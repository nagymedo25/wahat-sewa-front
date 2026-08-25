import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info, Sparkles } from 'lucide-react';

const ToastContext = createContext(null);

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef(new Map());

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const add = useCallback((firstArg, type = 'success', secondArg, thirdArg) => {
    let title = '';
    let message = '';
    let duration = 3800;

    if (typeof firstArg === 'object' && firstArg !== null) {
      title = firstArg.title || '';
      message = firstArg.message || firstArg.description || '';
      duration = firstArg.duration || duration;
    } else if (typeof secondArg === 'string') {
      title = String(firstArg || '');
      message = secondArg;
      if (typeof thirdArg === 'number') duration = thirdArg;
    } else {
      message = String(firstArg || '');
      if (typeof secondArg === 'number') duration = secondArg;
    }

    const id = ++toastId;
    const toast = { id, title, message, type, duration };
    setToasts((prev) => [...prev.slice(-4), toast]);

    const timer = setTimeout(() => remove(id), duration);
    timersRef.current.set(id, timer);
    return id;
  }, [remove]);

  const success = useCallback((arg1, arg2, arg3) => add(arg1, 'success', arg2, arg3), [add]);
  const error = useCallback((arg1, arg2, arg3) => add(arg1, 'error', arg2, arg3), [add]);
  const info = useCallback((arg1, arg2, arg3) => add(arg1, 'info', arg2, arg3), [add]);
  const warning = useCallback((arg1, arg2, arg3) => add(arg1, 'warning', arg2, arg3), [add]);

  const value = useMemo(() => ({ add, success, error, info, warning }), [add, success, error, info, warning]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onRemove={remove} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

function ToastContainer({ toasts, onRemove }) {
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[250] flex flex-col gap-3 w-full max-w-md px-4 pointer-events-none">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  );
}

const toastConfig = {
  success: {
    icon: CheckCircle2,
    border: 'border-[var(--palm-shade)]/35 dark:border-[var(--palm-shade-light)]/40',
    glow: 'shadow-[0_12px_36px_rgba(91,107,74,0.18)] dark:shadow-[0_12px_36px_rgba(91,107,74,0.30)]',
    iconColor: 'text-[var(--palm-shade)] dark:text-[var(--palm-shade-light)]',
    iconBg: 'bg-[var(--palm-shade)]/12 dark:bg-[var(--palm-shade)]/25',
    bar: 'bg-[var(--palm-shade)] dark:bg-[var(--palm-shade-light)]',
  },
  error: {
    icon: AlertCircle,
    border: 'border-[var(--discount-badge)]/40',
    glow: 'shadow-[0_12px_36px_rgba(196,94,59,0.22)] dark:shadow-[0_12px_36px_rgba(196,94,59,0.35)]',
    iconColor: 'text-[var(--discount-badge)]',
    iconBg: 'bg-[var(--discount-badge)]/12 dark:bg-[var(--discount-badge)]/25',
    bar: 'bg-[var(--discount-badge)]',
  },
  warning: {
    icon: AlertTriangle,
    border: 'border-[var(--warning)]/50',
    glow: 'shadow-[0_12px_36px_rgba(196,168,122,0.25)]',
    iconColor: 'text-[var(--siwa-earth)] dark:text-[var(--warning)]',
    iconBg: 'bg-[var(--warning)]/20',
    bar: 'bg-[var(--siwa-earth)] dark:bg-[var(--warning)]',
  },
  info: {
    icon: Sparkles,
    border: 'border-[var(--border-accent)]',
    glow: 'shadow-[0_12px_36px_rgba(138,88,51,0.18)] dark:shadow-[0_12px_36px_rgba(138,88,51,0.30)]',
    iconColor: 'text-[var(--siwa-earth)] dark:text-[var(--text-accent)]',
    iconBg: 'bg-[var(--siwa-earth)]/12 dark:bg-[var(--siwa-earth)]/25',
    bar: 'bg-[var(--siwa-earth)] dark:bg-[var(--text-accent)]',
  },
};

function ToastItem({ toast, onRemove }) {
  const config = toastConfig[toast.type] || toastConfig.info;
  const Icon = config.icon;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const enter = setTimeout(() => setVisible(true), 20);
    return () => clearTimeout(enter);
  }, []);

  const handleRemove = () => {
    setVisible(false);
    setTimeout(() => onRemove(toast.id), 350);
  };

  const durationSec = (toast.duration || 3800) / 1000;

  return (
    <div
      role="alert"
      className={
        'pointer-events-auto relative overflow-hidden rounded-2xl border bg-[var(--bg-elevated)]/95 backdrop-blur-2xl px-4 py-3.5 sm:px-5 sm:py-4 flex items-start gap-3.5 transition-all duration-350 font-ar ' +
        `${config.border} ${config.glow} ` +
        (visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-3 scale-95')
      }
      style={{ transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)' }}
    >
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[var(--border-subtle)]">
        <div
          className={`h-full ${config.bar} opacity-75`}
          style={{
            animation: `toastProgress ${durationSec}s linear forwards`,
          }}
        />
      </div>

      {/* Icon with subtle rounded background pill */}
      <div className={`p-2 rounded-xl shrink-0 ${config.iconBg} ${config.iconColor} mt-0.5`}>
        <Icon className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.2} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pt-0.5 text-right">
        {toast.title && (
          <h4 className="font-bold text-[var(--text-primary)] text-[0.95rem] leading-snug mb-0.5">
            {toast.title}
          </h4>
        )}
        <p className="text-[var(--text-secondary)] text-[0.88rem] leading-[1.6] break-words">
          {toast.message}
        </p>
      </div>

      {/* Dismiss Button */}
      <button
        type="button"
        onClick={handleRemove}
        className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--border-subtle)] transition-all cursor-pointer"
        aria-label="إغلاق التنبيه"
      >
        <X className="w-4 h-4" strokeWidth={2} />
      </button>

      <style>{`
        @keyframes toastProgress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}
