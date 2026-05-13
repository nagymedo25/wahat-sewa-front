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
      case 'order_update': return <Package className="w-4 h-4 text-olive-glow" />;
      case 'shipping': return <Truck className="w-4 h-4 text-blue-400" />;
      case 'delivery': return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      default: return <Bell className="w-4 h-4 text-sand" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
      >
        <Bell className={`w-5 h-5 transition-transform duration-300 ${unreadCount > 0 ? 'animate-bounce' : 'group-hover:rotate-12'}`} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-sunset text-white text-[0.65rem] font-bold rounded-full flex items-center justify-center border-2 border-[#1a1c13] shadow-lg">
            {unreadCount > 9 ? '+9' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-3 w-80 sm:w-96 bg-shadow/95 backdrop-blur-xl border border-olive/30 rounded-2xl shadow-2xl overflow-hidden z-[100] animate-in fade-in zoom-in-95 duration-200">
          <div className="p-4 border-b border-olive/20 flex items-center justify-between bg-olive-deep/20">
            <h3 className="font-bold text-cream">الإشعارات</h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-xs text-olive-glow hover:text-white flex items-center gap-1 transition-colors"
              >
                <Check className="w-3 h-3" />
                تحديد الكل كمقروء
              </button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="p-12 text-center text-sand opacity-40">
                <Bell className="w-10 h-10 mx-auto mb-3 opacity-20" />
                <p className="text-sm">لا توجد إشعارات حالياً</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div 
                  key={n.id}
                  onClick={() => !n.is_read && markAsRead(n.id)}
                  className={`p-4 border-b border-olive/10 hover:bg-white/5 transition-colors cursor-pointer relative group ${!n.is_read ? 'bg-olive/5' : ''}`}
                >
                  {!n.is_read && (
                    <div className="absolute top-4 left-4 w-2 h-2 bg-olive-glow rounded-full shadow-[0_0_10px_rgba(164,184,107,0.5)]" />
                  )}
                  <div className="flex gap-4">
                    <div className="mt-1">
                      <div className={`p-2 rounded-lg bg-shadow-soft border border-olive/20`}>
                        {getIcon(n.type)}
                      </div>
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="font-bold text-sm text-cream">{n.title}</p>
                      <p className="text-xs text-sand leading-relaxed opacity-80">{n.message}</p>
                      <p className="text-[0.6rem] text-sand opacity-40 font-mono mt-1">
                        {formatDistanceToNow(new Date(n.created_at), { addSuffix: true, locale: ar })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-3 bg-olive-deep/10 text-center">
            <p className="text-[0.65rem] text-sand opacity-40">تصلك التحديثات لحظياً فور حدوثها</p>
          </div>
        </div>
      )}
    </div>
  );
}
