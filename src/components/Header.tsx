import React from 'react';
import { ActiveTab, AppNotification } from '../types/finance';

interface HeaderProps {
  activeTab: ActiveTab;
  notifications: AppNotification[];
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  userName: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  notifications,
  onOpenNotifications,
  onOpenProfile,
}) => {
  const unreadCount = notifications.filter((n) => !n.read).length;

  const tabTitles: Record<ActiveTab, string> = {
    dashboard: 'Dashboard',
    expenses: 'Expenses',
    analytics: 'Analytics',
    budget: 'Budget',
  };

  return (
    <header className="fixed top-0 w-full z-40 bg-[#f8f9ff]/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.03)] pt-safe">
      <div className="max-w-2xl mx-auto h-16 px-4 sm:px-6 flex items-center justify-between">
        {/* Brand Lockup */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#008378] to-[#00685f] flex items-center justify-center shadow-md shadow-[#00685f]/20">
            <span className="material-symbols-outlined text-[20px] text-white">account_balance_wallet</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[20px] leading-tight text-[#00685f] tracking-tight font-extrabold font-sans">
              Spendly
            </span>
            <span className="text-[11px] leading-none text-[#3d4947] font-semibold tracking-wide uppercase">
              {tabTitles[activeTab]}
            </span>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5">
          {/* Notification Bell Button */}
          <button
            onClick={onOpenNotifications}
            aria-label="Notifications"
            className="relative w-11 h-11 flex items-center justify-center rounded-full text-[#3d4947] hover:bg-[#e5eeff] active:scale-95 transition-all cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[24px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#ba1a1a] ring-2 ring-[#f8f9ff]"></span>
            )}
          </button>

          {/* Profile Avatar Button */}
          <button
            onClick={onOpenProfile}
            aria-label="Profile and Settings"
            className="w-11 h-11 flex items-center justify-center rounded-full active:scale-95 transition-all cursor-pointer"
            type="button"
          >
            <img
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-[#89f5e7] shadow-sm"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBofvEE3jrNt9IFyntNDDKMmTvpS806SBLETOUArt5iGg5TWNe0-T2JWp5NzDxTI5fkSVx68bwyTOrWSutamw_4k343K5uTSGRx6GLXsguw1-4gtUX0Jvn8EDUwoxOCKQbQY_rebH-9JgjQsAbZqQhzBSWmdHaHAybj9mXjN1zBzfaj8ZSkern97LTit7AZGzeuQFDRikxi81TIjnRhZwJrJ12HoeRtTx6kJMSyf9uyOpsM3lf000IR"
            />
          </button>
        </div>
      </div>
    </header>
  );
};
