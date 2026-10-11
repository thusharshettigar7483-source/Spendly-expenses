import React from 'react';
import { ActiveTab } from '../types/finance';

interface BottomNavProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenAddExpense: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenAddExpense,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 pb-safe bg-[#f8f9ff]/90 backdrop-blur-xl shadow-[0_-4px_24px_rgba(11,28,48,0.06)] border-t border-[#e5eeff]/80">
      <div className="max-w-2xl mx-auto flex items-center justify-around h-16 px-2">
        {/* Tab 1: Home / Dashboard */}
        <button
          onClick={() => onSelectTab('dashboard')}
          aria-current={activeTab === 'dashboard' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] gap-0.5 active:scale-95 transition-all cursor-pointer ${
            activeTab === 'dashboard' ? 'text-[#00685f] font-bold' : 'text-[#565e74] hover:text-[#0b1c30]'
          }`}
          type="button"
        >
          <span className="material-symbols-outlined text-[24px]">
            {activeTab === 'dashboard' ? 'grid_view' : 'grid_view'}
          </span>
          <span className="text-[11px] font-semibold tracking-wide">Home</span>
        </button>

        {/* Tab 2: Expenses */}
        <button
          onClick={() => onSelectTab('expenses')}
          aria-current={activeTab === 'expenses' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] gap-0.5 active:scale-95 transition-all cursor-pointer ${
            activeTab === 'expenses' ? 'text-[#00685f] font-bold' : 'text-[#565e74] hover:text-[#0b1c30]'
          }`}
          type="button"
        >
          <span className="material-symbols-outlined text-[24px]">receipt_long</span>
          <span className="text-[11px] font-semibold tracking-wide">Expenses</span>
        </button>

        {/* Center Floating Elevated Add Button */}
        <div className="relative -top-5 flex items-center justify-center">
          <button
            onClick={onOpenAddExpense}
            aria-label="Add New Expense"
            className="w-14 h-14 rounded-full bg-[#00685f] hover:bg-[#005049] text-white flex items-center justify-center shadow-[0_10px_25px_-4px_rgba(0,104,95,0.45)] hover:shadow-[0_12px_28px_-2px_rgba(0,104,95,0.55)] active:scale-90 transition-all cursor-pointer ring-4 ring-[#f8f9ff]"
            type="button"
          >
            <span className="material-symbols-outlined text-[30px] font-bold">add</span>
          </button>
        </div>

        {/* Tab 3: Analytics */}
        <button
          onClick={() => onSelectTab('analytics')}
          aria-current={activeTab === 'analytics' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] gap-0.5 active:scale-95 transition-all cursor-pointer ${
            activeTab === 'analytics' ? 'text-[#00685f] font-bold' : 'text-[#565e74] hover:text-[#0b1c30]'
          }`}
          type="button"
        >
          <span className="material-symbols-outlined text-[24px]">donut_large</span>
          <span className="text-[11px] font-semibold tracking-wide">Analytics</span>
        </button>

        {/* Tab 4: Budget */}
        <button
          onClick={() => onSelectTab('budget')}
          aria-current={activeTab === 'budget' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] gap-0.5 active:scale-95 transition-all cursor-pointer ${
            activeTab === 'budget' ? 'text-[#00685f] font-bold' : 'text-[#565e74] hover:text-[#0b1c30]'
          }`}
          type="button"
        >
          <span className="material-symbols-outlined text-[24px]">account_balance_wallet</span>
          <span className="text-[11px] font-semibold tracking-wide">Budget</span>
        </button>
      </div>
    </nav>
  );
};
