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

  const add = useCallback((message, type = 'success', duration = 3500) => {
    const id = ++toastId;
    const toast = { id, message, type };
    setToasts((prev) => [...prev.slice(-4), toast]);

    const timer = setTimeout(() => remove(id), duration);
    timersRef.current.set(id, timer);
    return id;
  }, [remove]);

  const success = useCallback((message, duration) => add(message, 'success', duration), [add]);
  const error = useCallback((message, duration) => add(message, 'error', duration), [add]);
  const info = useCallback((message, duration) => add(message, 'info', duration), [add]);
  const warning = useCallback((message, duration) => add(message, 'warning', duration), [add]);

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
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] flex flex-col gap-3 w-full max-w-md px-4 pointer-events-none">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  );
}

const toastConfig = {
  success: {
    icon: CheckCircle2,
    border: 'border-[rgba(146,108,72,0.45)]',
    bg: 'bg-[rgba(33,21,13,0.95)]',
    glow: 'shadow-[0_0_30px_rgba(146,108,72,0.20)]',
    iconColor: 'text-siwa-gold',
    bar: 'bg-siwa-gold',
  },
  error: {
    icon: AlertCircle,
    border: 'border-[rgba(201,123,79,0.45)]',
    bg: 'bg-[rgba(33,21,13,0.95)]',
    glow: 'shadow-[0_0_30px_rgba(201,123,79,0.20)]',
    iconColor: 'text-[#E8A87C]',
    bar: 'bg-[#C97B4F]',
  },
  warning: {
    icon: AlertTriangle,
    border: 'border-[rgba(211,200,178,0.40)]',
    bg: 'bg-[rgba(33,21,13,0.95)]',
    glow: 'shadow-[0_0_30px_rgba(211,200,178,0.15)]',
    iconColor: 'text-siwa-cream-light',
    bar: 'bg-siwa-cream',
  },
  info: {
    icon: Sparkles,
    border: 'border-[rgba(146,108,72,0.35)]',
    bg: 'bg-[rgba(33,21,13,0.95)]',
    glow: 'shadow-[0_0_30px_rgba(146,108,72,0.15)]',
    iconColor: 'text-siwa-gold',
    bar: 'bg-siwa-gold',
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

  return (
    <div
      className={
        'pointer-events-auto relative overflow-hidden rounded-2xl border [backdrop-filter:blur(24px)] [-webkit-backdrop-filter:blur(24px)] px-5 py-4 flex items-start gap-3 transition-all duration-350 ' +
        `${config.border} ${config.bg} ${config.glow} ` +
        (visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-3 scale-95')
      }
      style={{ transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)' }}
    >
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[rgba(255,255,255,0.05)]">
        <div
          className={`h-full ${config.bar} opacity-60`}
          style={{
            animation: 'toastProgress 3.5s linear forwards',
          }}
        />
      </div>

      <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${config.iconColor}`} strokeWidth={2} />

      <div className="flex-1">
        <p className="text-cream text-[0.92rem] font-ar leading-[1.6]">{toast.message}</p>
      </div>

      <button
        type="button"
        onClick={handleRemove}
        className="shrink-0 mt-0.5 text-sand opacity-50 hover:opacity-100 hover:text-cream transition-opacity"
        aria-label="إغلاق"
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
