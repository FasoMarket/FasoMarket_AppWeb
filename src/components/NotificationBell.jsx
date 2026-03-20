import { useState, useRef, useEffect } from 'react';
import { Bell }        from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../contexts/NotificationContext';
import { cn }          from '../utils/cn';

const ICONS = {
  new_message:    '💬',
  order_placed:   '🛒',
  order_confirmed:'✅',
  order_shipped:  '🚚',
  order_delivered:'🎉',
  order_cancelled:'❌',
  store_approved: '🎉',
  store_rejected: '❌',
  store_suspended:'⚠️',
  low_stock:      '⚠️',
};

export default function NotificationBell() {
  const { notifications, unreadCount, markAllRead, markOneRead } = useNotifications();
  const [open,    setOpen]    = useState(false);
  const panelRef              = useRef(null);
  const navigate              = useNavigate();

  useEffect(() => {
    const handler = (e) => { if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleClick = async (notif) => {
    if (!notif.isRead) await markOneRead(notif._id);
    if (notif.link)    navigate(notif.link);
    setOpen(false);
  };

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setOpen(prev => !prev)}
        className="relative p-2.5 text-gray-600 hover:bg-gray-50 rounded-xl transition-all duration-200"
      >
        <Bell size={22} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl shadow-slate-200/80 border border-slate-100 overflow-hidden z-[100]">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-sm">
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">
                  {unreadCount}
                </span>
              )}
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-primary font-bold hover:underline"
              >
                Tout marquer lu
              </button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto divide-y divide-slate-50">
            {notifications.length === 0 ? (
              <div className="py-12 text-center">
                <Bell className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                <p className="text-sm text-slate-400 font-medium">Aucune notification</p>
              </div>
            ) : (
              notifications.map(notif => (
                <div
                  key={notif._id}
                  onClick={() => handleClick(notif)}
                  className={cn(
                    'flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors duration-150',
                    notif.isRead ? 'hover:bg-slate-50 opacity-70' : 'bg-blue-50/40 hover:bg-blue-50'
                  )}
                >
                  <span className="text-xl mt-0.5 flex-shrink-0">
                    {ICONS[notif.type] || '🔔'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={cn('text-sm leading-snug', notif.isRead ? 'text-slate-600' : 'text-slate-900 font-bold')}>
                      {notif.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{notif.message}</p>
                    <p className="text-[10px] text-slate-400 mt-1 font-medium">
                      {new Date(notif.createdAt).toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {!notif.isRead && (
                    <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
