import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, Trash2, Package, Truck, CheckCircle, XCircle } from 'lucide-react';
import { useNotifications } from '@/context/NotificationContext.jsx';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

export default function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'order_update': return <Package className="w-4 h-4 text-[var(--action-primary)]" />;
      case 'shipping': return <Truck className="w-4 h-4 text-blue-500" />;
      case 'delivery': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      default: return <Bell className="w-4 h-4 text-[var(--siwa-earth)]" />;
    }
  };

  return (
    <div className="relative font-ar" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-full bg-[var(--bg-card)] border border-[var(--border-default)] hover:border-[var(--border-accent)] text-[var(--text-primary)] transition-all group cursor-pointer active:scale-95 shadow-sm"
        aria-label="الإشعارات"
      >
        <Bell className={`w-[18px] h-[18px] transition-transform duration-300 ${unreadCount > 0 ? 'animate-bounce text-[var(--discount-badge)]' : 'group-hover:rotate-12'}`} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-[var(--discount-badge)] text-white text-[0.62rem] font-bold font-number rounded-full flex items-center justify-center border-2 border-[var(--bg-primary)] shadow-md px-1">
            {unreadCount > 9 ? '+9' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-3 w-80 sm:w-96 bg-[var(--bg-elevated)]/98 backdrop-blur-2xl border border-[var(--border-default)] rounded-2xl shadow-[var(--shadow-xl)] overflow-hidden z-[150] animate-in fade-in zoom-in-95 duration-200">
          <div className="p-4 border-b border-[var(--border-default)] flex items-center justify-between bg-[var(--bg-secondary)]/50">
            <h3 className="font-bold text-[var(--text-primary)] text-[0.95rem] flex items-center gap-2">
              <Bell className="w-4 h-4 text-[var(--siwa-earth)]" />
              <span>الإشعارات</span>
            </h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-xs text-[var(--action-primary)] hover:text-[var(--action-primary-hover)] font-bold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>تحديد الكل كمقروء</span>
              </button>
            )}
          </div>

          <div className="max-h-[380px] overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="p-10 text-center text-[var(--text-muted)] flex flex-col items-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[var(--border-subtle)] text-[var(--text-muted)] mb-3">
                  <Bell className="w-6 h-6 opacity-40" />
                </div>
                <p className="text-sm font-medium text-[var(--text-secondary)]">لا توجد إشعارات حالياً</p>
                <p className="text-xs text-[var(--text-muted)] mt-1">ستصلك التنبيهات حول طلباتك هنا فوراً</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div 
                  key={n.id}
                  onClick={() => !n.is_read && markAsRead(n.id)}
                  className={`p-4 border-b border-[var(--border-subtle)] hover:bg-[var(--bg-secondary)]/60 transition-colors cursor-pointer relative group ${!n.is_read ? 'bg-[var(--action-primary)]/[0.06]' : ''}`}
                >
                  {!n.is_read && (
                    <div className="absolute top-4 left-4 w-2 h-2 bg-[var(--discount-badge)] rounded-full shadow-[0_0_8px_rgba(196,94,59,0.6)]" />
                  )}
                  <div className="flex gap-3.5 items-start">
                    <div className="mt-0.5">
                      <div className="p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)] shadow-xs">
                        {getIcon(n.type)}
                      </div>
                    </div>
                    <div className="flex-1 space-y-1 text-right">
                      <p className="font-bold text-sm text-[var(--text-primary)] group-hover:text-[var(--action-primary)] transition-colors">{n.title}</p>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{n.message}</p>
                      <p className="text-[0.68rem] text-[var(--text-muted)] font-ar mt-1.5 flex items-center gap-1">
                        {formatDistanceToNow(new Date(n.created_at), { addSuffix: true, locale: ar })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-2.5 bg-[var(--bg-secondary)]/30 border-t border-[var(--border-subtle)] text-center">
            <p className="text-[0.7rem] text-[var(--text-muted)] font-ar">تصلك التحديثات لحظياً فور حدوثها</p>
          </div>
        </div>
      )}
    </div>
  );
}
