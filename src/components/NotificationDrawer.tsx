import React from 'react';
import { AppNotification } from '../types/finance';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAllRead: () => void;
  onClearNotifications: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onClearNotifications,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl z-10 flex flex-col max-h-[80vh] overflow-hidden animate-scaleUp">
        <div className="px-5 py-4 border-b border-[#e5eeff] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[22px] text-[#00685f]">notifications</span>
            <h2 className="text-[17px] font-bold text-[#0b1c30]">Notifications & Alerts</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#3d4947] hover:bg-[#eff4ff] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="p-4 overflow-y-auto no-scrollbar flex flex-col gap-2.5">
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-[#3d4947] text-[13px]">
              No notifications yet. You're all caught up!
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-3 rounded-xl border transition-colors flex items-start gap-3 ${
                  n.read
                    ? 'bg-white border-[#e5eeff]'
                    : 'bg-[#eff4ff]/60 border-[#dce9ff]'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    n.type === 'budget'
                      ? 'bg-[#dae2fd] text-[#131b2e]'
                      : n.type === 'alert'
                      ? 'bg-[#ffdad6] text-[#ba1a1a]'
                      : 'bg-[#e5eeff] text-[#00685f]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {n.type === 'budget' ? 'pie_chart' : n.type === 'alert' ? 'warning' : 'info'}
                  </span>
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-bold text-[#0b1c30]">{n.title}</span>
                    <span className="text-[10px] text-[#3d4947]">{n.timestamp}</span>
                  </div>
                  <p className="text-[12px] text-[#3d4947] mt-0.5">{n.message}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {notifications.length > 0 && (
          <div className="px-5 py-3 border-t border-[#e5eeff] bg-[#f8f9ff] flex items-center justify-between">
            <button
              onClick={onMarkAllRead}
              className="text-[12px] font-bold text-[#00685f] hover:underline cursor-pointer"
            >
              Mark all as read
            </button>
            <button
              onClick={onClearNotifications}
              className="text-[12px] font-semibold text-[#ba1a1a] hover:underline cursor-pointer"
            >
              Clear all
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
