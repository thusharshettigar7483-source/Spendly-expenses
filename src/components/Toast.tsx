import React, { useEffect } from 'react';

export interface ToastProps {
  message: string;
  type?: 'success' | 'info' | 'error';
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'success',
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const bgClass =
    type === 'error'
      ? 'bg-[#ba1a1a] text-white'
      : type === 'info'
      ? 'bg-[#213145] text-white'
      : 'bg-[#00685f] text-white';

  const iconName =
    type === 'error' ? 'error' : type === 'info' ? 'info' : 'check_circle';

  return (
    <div className="fixed top-18 left-1/2 -translate-x-1/2 z-50 max-w-sm w-[90%] px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 animate-bounce-subtle pointer-events-auto transition-all text-[13px] font-bold">
      <div className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl ${bgClass} shadow-lg`}>
        <div className="flex items-center gap-2 min-w-0">
          <span className="material-symbols-outlined text-[18px]">{iconName}</span>
          <span className="truncate">{message}</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-white/80 hover:text-white rounded-lg cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">close</span>
        </button>
      </div>
    </div>
  );
};
