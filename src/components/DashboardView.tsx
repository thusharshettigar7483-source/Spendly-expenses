import React, { useState, useMemo } from 'react';
import { Transaction, CATEGORY_DEFINITIONS } from '../types/finance';
import {
  formatCurrency,
  getCurrencySymbol,
  getDaysLeftInCurrentMonth,
  getRelativeTimeString,
} from '../utils/storage';

interface DashboardViewProps {
  transactions: Transaction[];
  monthlyBudget: number;
  startingCash: number;
  currencyCode: string;
  hideBalance: boolean;
  onToggleHideBalance: () => void;
  onOpenAddExpense: () => void;
  onOpenTransfer: () => void;
  onOpenSetBudget: () => void;
  onExport: () => void;
  onNavigateToExpenses: () => void;
  onEditTransaction: (tx: Transaction) => void;
  userName: string;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  transactions,
  monthlyBudget,
  startingCash,
  currencyCode,
  hideBalance,
  onToggleHideBalance,
  onOpenAddExpense,
  onOpenTransfer,
  onOpenSetBudget,
  onExport,
  onNavigateToExpenses,
  onEditTransaction,
  userName,
}) => {
  const [weeklyTab, setWeeklyTab] = useState<'thisWeek' | 'lastWeek'>('thisWeek');
  const [activeTooltipDay, setActiveTooltipDay] = useState<number | null>(null);

  // Financial calculations
  const totalIncome = useMemo(() => {
    return transactions
      .filter((tx) => tx.type === 'income')
      .reduce((sum, tx) => sum + tx.amount, 0);
  }, [transactions]);

  const totalSpending = useMemo(() => {
    return transactions
      .filter((tx) => tx.type === 'expense')
      .reduce((sum, tx) => sum + tx.amount, 0);
  }, [transactions]);

  const netBalance = useMemo(() => {
    return startingCash + totalIncome - totalSpending;
  }, [startingCash, totalIncome, totalSpending]);

  const remainingBudget = Math.max(0, monthlyBudget - totalSpending);
  const budgetSpentPercent = monthlyBudget > 0 ? (totalSpending / monthlyBudget) * 100 : 0;
  const daysLeft = getDaysLeftInCurrentMonth();
  const safeDailyPace = daysLeft > 0 ? remainingBudget / daysLeft : 0;

  // Budget status evaluation
  const isBudgetSafe = budgetSpentPercent <= 75;
  const isBudgetWarning = budgetSpentPercent > 75 && budgetSpentPercent <= 95;
  const isBudgetExceeded = budgetSpentPercent > 95;

  const budgetHealthLabel = isBudgetExceeded
    ? 'Over Budget'
    : isBudgetWarning
    ? 'Caution'
    : 'Good Health';

  // Calculate Today's Spending
  const todaysTotal = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return transactions
      .filter((tx) => {
        if (tx.type !== 'expense') return false;
        const txDate = new Date(tx.date);
        txDate.setHours(0, 0, 0, 0);
        return txDate.getTime() === today.getTime();
      })
      .reduce((sum, tx) => sum + tx.amount, 0);
  }, [transactions]);

  // Weekly spending bars calculation (Mon to Sun)
  const weeklyData = useMemo(() => {
    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const now = new Date();
    const currentDayOfWeek = (now.getDay() + 6) % 7; // 0 for Monday, 6 for Sunday

    // Day offset shift for this week vs last week
    const offset = weeklyTab === 'thisWeek' ? 0 : 7;

    return days.map((dayLabel, index) => {
      const targetDate = new Date();
      const diffFromCurrentMonday = index - currentDayOfWeek - offset;
      targetDate.setDate(now.getDate() + diffFromCurrentMonday);
      targetDate.setHours(0, 0, 0, 0);

      const dayExpenses = transactions
        .filter((tx) => {
          if (tx.type !== 'expense') return false;
          const d = new Date(tx.date);
          d.setHours(0, 0, 0, 0);
          return d.getTime() === targetDate.getTime();
        })
        .reduce((sum, tx) => sum + tx.amount, 0);

      const isToday = weeklyTab === 'thisWeek' && index === currentDayOfWeek;

      return {
        label: dayLabel,
        index,
        amount: dayExpenses,
        isToday,
        dateFormatted: targetDate.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        }),
      };
    });
  }, [transactions, weeklyTab]);

  const maxWeeklyAmount = Math.max(1, ...weeklyData.map((d) => d.amount));

  // Recent transactions preview (most recent 4)
  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 4);
  }, [transactions]);

  const currencySymbol = getCurrencySymbol(currencyCode);

  return (
    <div className="flex flex-col w-full px-4 sm:px-6 pb-6 gap-6 pt-2">
      {/* 1. Greeting & Status Header */}
      <section className="flex items-center justify-between pt-1">
        <div className="flex flex-col">
          <h1 className="text-[26px] leading-tight text-[#0b1c30] tracking-tight font-extrabold flex items-center gap-1.5">
            Hello, {userName} <span className="inline-block animate-bounce origin-bottom-right">👋</span>
          </h1>
          <p className="text-[15px] text-[#3d4947] font-normal">
            Track your spending effortlessly
          </p>
        </div>
        <div className="flex items-center">
          <div
            className={`px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm ${
              isBudgetExceeded
                ? 'bg-[#ffdad6] text-[#ba1a1a]'
                : isBudgetWarning
                ? 'bg-[#fef3c7] text-[#92400e]'
                : 'bg-[#dae2fd] text-[#131b2e]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px] text-[#006947]">verified_user</span>
            <span className="text-[11px] font-semibold tracking-wide uppercase">
              {isBudgetExceeded ? 'Exceeded' : 'On Track'}
            </span>
          </div>
        </div>
      </section>

      {/* 2. Hero Balance Card (Dark Slate with Teal Radial Accents) */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#008378] via-[#00685f] to-[#213145] p-6 text-white shadow-xl">
        {/* Ambient organic gradient glows */}
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-[#6bd8cb]/20 blur-3xl pointer-events-none"></div>
        <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-[#4edea3]/15 blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-[12px] text-white/80 tracking-wide uppercase font-semibold">
                Total Net Balance
              </span>
              <button
                onClick={onToggleHideBalance}
                className="p-1 text-white/70 hover:text-white transition-colors flex items-center cursor-pointer"
                aria-label={hideBalance ? 'Show Balance' : 'Hide Balance'}
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {hideBalance ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-white/15 text-[#89f5e7] text-[11px] font-bold">
              {currencyCode} • Main
            </span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-baseline gap-1">
              <span className="text-[20px] text-[#89f5e7] font-semibold">{currencySymbol}</span>
              <span className="text-[38px] leading-tight text-white tracking-tight font-extrabold font-mono tabular-nums">
                {hideBalance ? '••••••••' : Math.abs(netBalance).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>

          {/* Quick Insight Inflow & Outflow Pills */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/10 backdrop-blur-sm shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-[#6ffbbe] text-[#002113] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px] font-bold">arrow_downward</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] text-white/75 font-medium">Income</span>
                <span className="text-[14px] text-white font-bold truncate font-mono tabular-nums">
                  +{formatCurrency(totalIncome, currencyCode)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/10 backdrop-blur-sm shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-[#ffdad6] text-[#93000a] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px] font-bold">arrow_upward</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] text-white/75 font-medium">Spending</span>
                <span className="text-[14px] text-white font-bold truncate font-mono tabular-nums">
                  -{formatCurrency(totalSpending, currencyCode)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Budget Progress Card */}
      <section className="rounded-2xl bg-white p-6 shadow-sm border border-[#e5eeff]/80 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#dae2fd] text-[#131b2e] flex items-center justify-center">
              <span className="material-symbols-outlined text-[16px]">pie_chart</span>
            </div>
            <span className="text-[20px] text-[#0b1c30] font-bold">Monthly Budget</span>
          </div>
          <span className="text-[11px] text-[#3d4947] flex items-center gap-1 font-semibold">
            <span className="material-symbols-outlined text-[14px]">calendar_today</span> {daysLeft} days left
          </span>
        </div>

        <div className="flex items-baseline justify-between mt-1">
          <div className="flex items-baseline gap-1">
            <span className="text-[26px] text-[#0b1c30] font-extrabold font-mono tabular-nums">
              {formatCurrency(remainingBudget, currencyCode)}
            </span>
            <span className="text-[13px] text-[#3d4947] font-medium">left</span>
          </div>
          <span className="text-[12px] text-[#3d4947] font-medium">
            {budgetSpentPercent.toFixed(1)}% spent of {formatCurrency(monthlyBudget, currencyCode)}
          </span>
        </div>

        {/* Progress Track */}
        <div className="relative w-full h-3 rounded-full bg-[#eff4ff] overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${
              isBudgetExceeded
                ? 'bg-[#ba1a1a]'
                : isBudgetWarning
                ? 'bg-[#f59e0b]'
                : 'bg-[#00685f]'
            }`}
            style={{ width: `${Math.min(100, Math.max(0, budgetSpentPercent))}%` }}
          ></div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                isBudgetExceeded ? 'bg-[#ba1a1a]' : isBudgetWarning ? 'bg-[#f59e0b]' : 'bg-[#006947]'
              }`}
            ></span>
            <span className="text-[11px] text-[#3d4947] font-medium">
              Safe spending pace (~{formatCurrency(safeDailyPace, currencyCode)}/day)
            </span>
          </div>
          <span
            className={`text-[11px] font-bold ${
              isBudgetExceeded
                ? 'text-[#ba1a1a]'
                : isBudgetWarning
                ? 'text-[#92400e]'
                : 'text-[#00685f]'
            }`}
          >
            {budgetHealthLabel}
          </span>
        </div>
      </section>

      {/* 4. Quick Action Row */}
      <section className="grid grid-cols-4 gap-2">
        <button
          onClick={onOpenAddExpense}
          className="group flex flex-col items-center gap-1.5 p-2.5 rounded-2xl bg-white shadow-sm border border-[#e5eeff]/80 active:scale-95 transition-all cursor-pointer"
          type="button"
        >
          <div className="w-12 h-12 rounded-xl bg-[#00685f] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[24px]">add</span>
          </div>
          <span className="text-[11px] text-[#0b1c30] font-semibold text-center leading-tight">
            Add Spend
          </span>
        </button>

        <button
          onClick={onOpenTransfer}
          className="group flex flex-col items-center gap-1.5 p-2.5 rounded-2xl bg-white shadow-sm border border-[#e5eeff]/80 active:scale-95 transition-all cursor-pointer"
          type="button"
        >
          <div className="w-12 h-12 rounded-xl bg-[#dae2fd] text-[#131b2e] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[22px]">swap_horiz</span>
          </div>
          <span className="text-[11px] text-[#0b1c30] font-semibold text-center leading-tight">
            Transfer
          </span>
        </button>

        <button
          onClick={onOpenSetBudget}
          className="group flex flex-col items-center gap-1.5 p-2.5 rounded-2xl bg-white shadow-sm border border-[#e5eeff]/80 active:scale-95 transition-all cursor-pointer"
          type="button"
        >
          <div className="w-12 h-12 rounded-xl bg-[#eff4ff] text-[#00685f] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[22px]">tune</span>
          </div>
          <span className="text-[11px] text-[#0b1c30] font-semibold text-center leading-tight">
            Set Budget
          </span>
        </button>

        <button
          onClick={onExport}
          className="group flex flex-col items-center gap-1.5 p-2.5 rounded-2xl bg-white shadow-sm border border-[#e5eeff]/80 active:scale-95 transition-all cursor-pointer"
          type="button"
        >
          <div className="w-12 h-12 rounded-xl bg-[#eff4ff] text-[#3d4947] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[22px]">ios_share</span>
          </div>
          <span className="text-[11px] text-[#0b1c30] font-semibold text-center leading-tight">
            Export
          </span>
        </button>
      </section>

      {/* 5. Weekly Spending Chart Section */}
      <section className="rounded-2xl bg-white p-6 shadow-sm border border-[#e5eeff]/80 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[20px] text-[#0b1c30] font-bold">Weekly Spending</h2>
            <span className="text-[13px] text-[#3d4947]">Daily expense breakdown</span>
          </div>
          {/* Tab Filter Pill Switch */}
          <div className="flex items-center bg-[#eff4ff] p-1 rounded-full">
            <button
              onClick={() => setWeeklyTab('thisWeek')}
              className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                weeklyTab === 'thisWeek'
                  ? 'bg-white text-[#00685f] shadow-sm'
                  : 'text-[#3d4947] hover:text-[#0b1c30]'
              }`}
              type="button"
            >
              This Week
            </button>
            <button
              onClick={() => setWeeklyTab('lastWeek')}
              className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                weeklyTab === 'lastWeek'
                  ? 'bg-white text-[#00685f] shadow-sm'
                  : 'text-[#3d4947] hover:text-[#0b1c30]'
              }`}
              type="button"
            >
              Last Week
            </button>
          </div>
        </div>

        {/* Today Highlight banner badge */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#f8f9ff]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00685f] animate-pulse"></span>
            <span className="text-[12px] text-[#0b1c30] font-semibold">Today's Total:</span>
          </div>
          <span className="text-[14px] text-[#00685f] font-extrabold font-mono tabular-nums">
            {formatCurrency(todaysTotal, currencyCode)}
          </span>
        </div>

        {/* Chart Columns */}
        <div className="grid grid-cols-7 gap-1.5 items-end h-40 pt-4">
          {weeklyData.map((day) => {
            const barHeightPercent =
              maxWeeklyAmount > 0 ? Math.max(12, Math.round((day.amount / maxWeeklyAmount) * 95)) : 12;

            return (
              <div
                key={day.index}
                className="flex flex-col items-center gap-1.5 h-full justify-end relative group cursor-pointer"
                onClick={() =>
                  setActiveTooltipDay(activeTooltipDay === day.index ? null : day.index)
                }
                onMouseEnter={() => setActiveTooltipDay(day.index)}
                onMouseLeave={() => setActiveTooltipDay(null)}
              >
                {/* Amount on top */}
                <span
                  className={`text-[11px] font-mono tabular-nums ${
                    day.isToday ? 'text-[#00685f] font-bold' : 'text-[#3d4947]'
                  }`}
                >
                  {currencySymbol}
                  {Math.round(day.amount)}
                </span>

                {/* Animated Bar */}
                <div
                  className={`w-full max-w-[28px] rounded-t-lg transition-all duration-300 relative ${
                    day.isToday
                      ? 'bg-[#00685f] shadow-md hover:bg-[#005049]'
                      : 'bg-[#dae2fd] hover:bg-[#bec6e0]'
                  }`}
                  style={{ height: `${barHeightPercent}%` }}
                >
                  {/* Floating Tooltip */}
                  {(activeTooltipDay === day.index) && (
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-20 bg-[#213145] text-white text-[11px] px-2 py-1 rounded shadow-lg whitespace-nowrap font-sans flex flex-col items-center">
                      <span className="font-bold">{formatCurrency(day.amount, currencyCode)}</span>
                      <span className="text-[9px] text-[#89f5e7]">{day.dateFormatted}</span>
                    </div>
                  )}
                </div>

                {/* Day of Week Label */}
                <span
                  className={`text-[11px] font-medium ${
                    day.isToday ? 'text-[#00685f] font-bold' : 'text-[#3d4947]'
                  }`}
                >
                  {day.label}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Recent Transactions Preview */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-[20px] text-[#0b1c30] font-bold">Recent Transactions</h2>
          <button
            onClick={onNavigateToExpenses}
            className="text-[12px] text-[#00685f] font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
            type="button"
          >
            See All <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </div>

        <div className="rounded-2xl bg-white p-2 shadow-sm border border-[#e5eeff]/80 flex flex-col gap-1">
          {recentTransactions.length === 0 ? (
            <div className="p-8 text-center flex flex-col items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[36px] text-[#3d4947]/40">receipt</span>
              <p className="text-[14px] text-[#3d4947] font-medium">No transactions recorded yet.</p>
              <button
                onClick={onOpenAddExpense}
                className="mt-2 px-4 py-2 bg-[#00685f] text-white text-xs font-bold rounded-lg hover:bg-[#005049] transition-all cursor-pointer"
              >
                Add Your First Expense
              </button>
            </div>
          ) : (
            recentTransactions.map((tx) => {
              const cat = CATEGORY_DEFINITIONS[tx.category] || CATEGORY_DEFINITIONS['Other'];
              const isIncome = tx.type === 'income';

              return (
                <div
                  key={tx.id}
                  onClick={() => onEditTransaction(tx)}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#f8f9ff] active:bg-[#eff4ff] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${cat.bgClass}`}
                    >
                      <span className="material-symbols-outlined text-[20px]">{cat.iconName}</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[14px] font-semibold text-[#0b1c30] truncate">
                        {tx.title}
                      </span>
                      <div className="flex items-center gap-1.5 text-[13px] text-[#3d4947]">
                        <span>{tx.category}</span>
                        <span>•</span>
                        <span>{getRelativeTimeString(tx.date)}</span>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`text-[14px] font-extrabold shrink-0 pl-2 font-mono tabular-nums ${
                      isIncome ? 'text-[#006947]' : 'text-[#0b1c30]'
                    }`}
                  >
                    {isIncome ? '+' : '-'}
                    {formatCurrency(tx.amount, currencyCode)}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
};
