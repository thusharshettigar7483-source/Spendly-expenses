import React, { useState, useMemo } from 'react';
import { Transaction, CURRENCIES } from '../types/finance';
import {
  formatCurrency,
  getCurrencySymbol,
  getDaysLeftInCurrentMonth,
} from '../utils/storage';

interface BudgetViewProps {
  transactions: Transaction[];
  monthlyBudget: number;
  currencyCode: string;
  onUpdateBudget: (newBudget: number) => void;
  onUpdateCurrency: (currency: string) => void;
  onExportCSV: () => void;
  onResetDemoData: () => void;
  onClearAllData: () => void;
}

export const BudgetView: React.FC<BudgetViewProps> = ({
  transactions,
  monthlyBudget,
  currencyCode,
  onUpdateBudget,
  onUpdateCurrency,
  onExportCSV,
  onResetDemoData,
  onClearAllData,
}) => {
  const [budgetInput, setBudgetInput] = useState<string>(monthlyBudget.toString());
  const [isSavedToast, setIsSavedToast] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Current month spending
  const totalSpending = useMemo(() => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    return transactions
      .filter((tx) => tx.type === 'expense' && new Date(tx.date).getTime() >= monthStart)
      .reduce((sum, tx) => sum + tx.amount, 0);
  }, [transactions]);

  const daysLeft = getDaysLeftInCurrentMonth();
  const todayDate = new Date().getDate();
  const daysPassed = Math.max(1, todayDate);
  const currentDailyAverage = totalSpending / daysPassed;

  const remainingBudget = Math.max(0, monthlyBudget - totalSpending);
  const allowedDailyPace = daysLeft > 0 ? remainingBudget / daysLeft : 0;
  const spentPercent = monthlyBudget > 0 ? (totalSpending / monthlyBudget) * 100 : 0;
  
  // Total days in current month
  const now = new Date();
  const totalDaysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const projectedMonthSpend = currentDailyAverage * totalDaysInMonth;

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(budgetInput);
    if (!isNaN(val) && val > 0) {
      onUpdateBudget(val);
      setIsSavedToast(true);
      setTimeout(() => setIsSavedToast(false), 2500);
    }
  };

  const handlePresetSelect = (preset: number) => {
    setBudgetInput(preset.toString());
    onUpdateBudget(preset);
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 2500);
  };

  const currencySymbol = getCurrencySymbol(currencyCode);

  return (
    <div className="flex flex-col w-full px-4 sm:px-6 pb-6 gap-5 pt-2">
      {/* Title */}
      <div>
        <h1 className="text-[26px] leading-tight text-[#0b1c30] tracking-tight font-extrabold">
          Monthly Budget
        </h1>
        <p className="text-[13px] text-[#3d4947]">
          Manage your monthly limit and track spending velocity
        </p>
      </div>

      {/* Target Setting Card */}
      <section className="rounded-2xl bg-white p-5 border border-[#e5eeff] shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-[14px] font-bold text-[#0b1c30]">Configure Monthly Limit</span>
          {isSavedToast && (
            <span className="text-[11px] font-bold text-[#00685f] bg-[#e6faf2] px-2 py-0.5 rounded-full animate-fadeIn">
              Saved successfully!
            </span>
          )}
        </div>

        <form onSubmit={handleSaveBudget} className="flex flex-col gap-3">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[20px] font-bold text-[#3d4947]">
              {currencySymbol}
            </span>
            <input
              type="number"
              step="50"
              min="100"
              max="100000"
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
              className="w-full h-13 pl-10 pr-24 rounded-xl bg-[#f8f9ff] border border-[#e5eeff] text-[22px] font-extrabold text-[#0b1c30] font-mono tabular-nums focus:outline-none focus:border-[#00685f] focus:ring-2 focus:ring-[#00685f]/15 transition-all"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-[#00685f] hover:bg-[#005049] text-white text-[12px] font-bold rounded-lg shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              Update
            </button>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
            <span className="text-[11px] text-[#3d4947] font-semibold mr-1">Presets:</span>
            {[2000, 3000, 4000, 5000, 6000].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handlePresetSelect(preset)}
                className={`px-3 py-1 rounded-lg text-[12px] font-semibold border transition-all cursor-pointer shrink-0 ${
                  monthlyBudget === preset
                    ? 'bg-[#00685f] text-white border-[#00685f]'
                    : 'bg-white text-[#3d4947] border-[#e5eeff] hover:bg-[#eff4ff]'
                }`}
              >
                {currencySymbol}
                {preset.toLocaleString()}
              </button>
            ))}
          </div>
        </form>
      </section>

      {/* Real-time Velocity & Pace Analysis */}
      <section className="rounded-2xl bg-white p-5 border border-[#e5eeff] shadow-sm flex flex-col gap-4">
        <h2 className="text-[16px] font-bold text-[#0b1c30]">Budget Health & Spending Pace</h2>

        {/* Big Remaining Display */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#f8f9ff] border border-[#e5eeff]">
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold text-[#3d4947]">Remaining This Month</span>
            <span className="text-[24px] font-extrabold text-[#0b1c30] font-mono tabular-nums">
              {formatCurrency(remainingBudget, currencyCode)}
            </span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-[11px] font-semibold text-[#3d4947]">{daysLeft} Days Left</span>
            <span
              className={`text-[13px] font-bold ${
                spentPercent > 95
                  ? 'text-[#ba1a1a]'
                  : spentPercent > 75
                  ? 'text-[#f59e0b]'
                  : 'text-[#00685f]'
              }`}
            >
              {spentPercent.toFixed(1)}% spent
            </span>
          </div>
        </div>

        {/* Daily Pace Comparison Strip */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-[#eff4ff] border border-[#dce9ff] flex flex-col">
            <span className="text-[11px] font-semibold text-[#00685f]">Recommended Daily Allowance</span>
            <span className="text-[18px] font-extrabold text-[#00685f] font-mono tabular-nums mt-0.5">
              ~{formatCurrency(allowedDailyPace, currencyCode)}/day
            </span>
            <span className="text-[10px] text-[#3d4947] mt-1">To stay within monthly limit</span>
          </div>

          <div className="p-3 rounded-xl bg-[#f8f9ff] border border-[#e5eeff] flex flex-col">
            <span className="text-[11px] font-semibold text-[#3d4947]">Actual Daily Average</span>
            <span className="text-[18px] font-extrabold text-[#0b1c30] font-mono tabular-nums mt-0.5">
              {formatCurrency(currentDailyAverage, currencyCode)}/day
            </span>
            <span className="text-[10px] text-[#3d4947] mt-1">Over past {daysPassed} days</span>
          </div>
        </div>

        {/* Projected Month End Spend */}
        <div className="flex items-center justify-between pt-1 text-[13px]">
          <span className="text-[#3d4947]">Projected End of Month Outflow:</span>
          <span
            className={`font-bold font-mono tabular-nums ${
              projectedMonthSpend > monthlyBudget ? 'text-[#ba1a1a]' : 'text-[#006947]'
            }`}
          >
            {formatCurrency(projectedMonthSpend, currencyCode)}
          </span>
        </div>
      </section>

      {/* Preferences & Currency */}
      <section className="rounded-2xl bg-white p-5 border border-[#e5eeff] shadow-sm flex flex-col gap-4">
        <h2 className="text-[16px] font-bold text-[#0b1c30]">App Preferences</h2>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[14px] font-semibold text-[#0b1c30]">Display Currency</span>
            <span className="text-[12px] text-[#3d4947]">Select primary currency symbol</span>
          </div>

          <select
            value={currencyCode}
            onChange={(e) => onUpdateCurrency(e.target.value)}
            className="h-10 px-3 bg-[#f8f9ff] border border-[#e5eeff] rounded-xl text-[13px] font-bold text-[#0b1c30] focus:outline-none focus:border-[#00685f] cursor-pointer"
          >
            {CURRENCIES.map((curr) => (
              <option key={curr.code} value={curr.code}>
                {curr.label}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Data Management & Backup */}
      <section className="rounded-2xl bg-white p-5 border border-[#e5eeff] shadow-sm flex flex-col gap-3">
        <h2 className="text-[16px] font-bold text-[#0b1c30]">Data & Privacy</h2>
        <p className="text-[12px] text-[#3d4947]">
          All your transaction data is stored locally in your browser storage. No financial data leaves your device.
        </p>

        <div className="flex flex-col gap-2 pt-1">
          {/* Export CSV button */}
          <button
            onClick={onExportCSV}
            className="w-full h-11 rounded-xl bg-[#eff4ff] hover:bg-[#dce9ff] text-[#00685f] text-[13px] font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export All Transactions (CSV)
          </button>

          {/* Reset Demo Data button */}
          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full h-11 rounded-xl bg-[#f8f9ff] hover:bg-[#eff4ff] text-[#3d4947] text-[13px] font-semibold flex items-center justify-center gap-2 border border-[#e5eeff] transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">restart_alt</span>
            Reset Demo Data (Sarah's Balance)
          </button>

          {/* Clear All Data */}
          <button
            onClick={() => setShowClearConfirm(true)}
            className="w-full h-11 rounded-xl bg-[#ffdad6]/40 hover:bg-[#ffdad6] text-[#ba1a1a] text-[13px] font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">delete_forever</span>
            Clear All Stored Records
          </button>
        </div>
      </section>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl flex flex-col gap-3 animate-scaleUp">
            <h3 className="text-[18px] font-bold text-[#0b1c30]">Reset Demo Data?</h3>
            <p className="text-[13px] text-[#3d4947]">
              This will restore Sarah's original demo transactions, $4,000 budget, and $8,450.20 net balance.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl text-[13px] font-semibold text-[#3d4947] hover:bg-[#eff4ff] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onResetDemoData();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-2 rounded-xl text-[13px] font-bold bg-[#00685f] text-white hover:bg-[#005049] cursor-pointer"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear All Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl flex flex-col gap-3 animate-scaleUp">
            <h3 className="text-[18px] font-bold text-[#ba1a1a]">Wipe All Records?</h3>
            <p className="text-[13px] text-[#3d4947]">
              This will remove all transactions from local storage, starting your ledger completely fresh. This cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 rounded-xl text-[13px] font-semibold text-[#3d4947] hover:bg-[#eff4ff] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onClearAllData();
                  setShowClearConfirm(false);
                }}
                className="px-4 py-2 rounded-xl text-[13px] font-bold bg-[#ba1a1a] text-white hover:bg-[#93000a] cursor-pointer"
              >
                Wipe All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
