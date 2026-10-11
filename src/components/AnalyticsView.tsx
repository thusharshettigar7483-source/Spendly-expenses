import React, { useState, useMemo } from 'react';
import { Transaction, CATEGORY_DEFINITIONS, ExpenseCategory } from '../types/finance';
import { formatCurrency } from '../utils/storage';

interface AnalyticsViewProps {
  transactions: Transaction[];
  monthlyBudget: number;
  currencyCode: string;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  transactions,
  monthlyBudget,
  currencyCode,
}) => {
  const [timeframe, setTimeframe] = useState<'thisMonth' | 'last30' | 'all'>('thisMonth');

  // Filter transactions according to selected timeframe
  const timeframeTransactions = useMemo(() => {
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).getTime();

    return transactions.filter((tx) => {
      const txTime = new Date(tx.date).getTime();
      if (timeframe === 'thisMonth') return txTime >= thisMonthStart;
      if (timeframe === 'last30') return txTime >= thirtyDaysAgo;
      return true;
    });
  }, [transactions, timeframe]);

  // Spending totals
  const totalSpending = useMemo(() => {
    return timeframeTransactions
      .filter((tx) => tx.type === 'expense')
      .reduce((sum, tx) => sum + tx.amount, 0);
  }, [timeframeTransactions]);

  const totalIncome = useMemo(() => {
    return timeframeTransactions
      .filter((tx) => tx.type === 'income')
      .reduce((sum, tx) => sum + tx.amount, 0);
  }, [timeframeTransactions]);

  const netSavings = totalIncome - totalSpending;
  const savingsRate = totalIncome > 0 ? Math.max(0, (netSavings / totalIncome) * 100) : 0;

  // Category breakdown calculation
  const categoryStats = useMemo(() => {
    const expenseTxs = timeframeTransactions.filter((tx) => tx.type === 'expense');
    const map: Record<string, { amount: number; count: number }> = {};

    expenseTxs.forEach((tx) => {
      if (!map[tx.category]) {
        map[tx.category] = { amount: 0, count: 0 };
      }
      map[tx.category].amount += tx.amount;
      map[tx.category].count += 1;
    });

    const list = Object.entries(map).map(([category, data]) => {
      const percentage = totalSpending > 0 ? (data.amount / totalSpending) * 100 : 0;
      return {
        category: category as ExpenseCategory,
        amount: data.amount,
        count: data.count,
        percentage,
        config: CATEGORY_DEFINITIONS[category as ExpenseCategory] || CATEGORY_DEFINITIONS['Other'],
      };
    });

    // Sort highest spend first
    return list.sort((a, b) => b.amount - a.amount);
  }, [timeframeTransactions, totalSpending]);

  // Insight calculations
  const topCategory = categoryStats[0] || null;
  const expenseCount = timeframeTransactions.filter((tx) => tx.type === 'expense').length;
  const avgExpense = expenseCount > 0 ? totalSpending / expenseCount : 0;
  
  const largestExpense = useMemo(() => {
    const expenseTxs = timeframeTransactions.filter((tx) => tx.type === 'expense');
    if (expenseTxs.length === 0) return null;
    return [...expenseTxs].sort((a, b) => b.amount - a.amount)[0];
  }, [timeframeTransactions]);

  return (
    <div className="flex flex-col w-full px-4 sm:px-6 pb-6 gap-5 pt-2">
      {/* Title & Timeframe Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-[26px] leading-tight text-[#0b1c30] tracking-tight font-extrabold">
            Spending Analytics
          </h1>
          <p className="text-[13px] text-[#3d4947]">
            Comprehensive breakdown of your money outflow
          </p>
        </div>

        <div className="flex items-center bg-[#eff4ff] p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setTimeframe('thisMonth')}
            className={`px-3 py-1 text-[12px] font-bold rounded-lg transition-all cursor-pointer ${
              timeframe === 'thisMonth' ? 'bg-white text-[#00685f] shadow-sm' : 'text-[#3d4947]'
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setTimeframe('last30')}
            className={`px-3 py-1 text-[12px] font-bold rounded-lg transition-all cursor-pointer ${
              timeframe === 'last30' ? 'bg-white text-[#00685f] shadow-sm' : 'text-[#3d4947]'
            }`}
          >
            30 Days
          </button>
          <button
            onClick={() => setTimeframe('all')}
            className={`px-3 py-1 text-[12px] font-bold rounded-lg transition-all cursor-pointer ${
              timeframe === 'all' ? 'bg-white text-[#00685f] shadow-sm' : 'text-[#3d4947]'
            }`}
          >
            All Time
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="p-3 rounded-2xl bg-white border border-[#e5eeff] shadow-sm flex flex-col">
          <span className="text-[11px] font-semibold text-[#3d4947]">Total Spent</span>
          <span className="text-[16px] font-extrabold text-[#ba1a1a] font-mono tabular-nums mt-0.5">
            {formatCurrency(totalSpending, currencyCode)}
          </span>
          <span className="text-[10px] text-[#3d4947] mt-1">{expenseCount} purchases</span>
        </div>

        <div className="p-3 rounded-2xl bg-white border border-[#e5eeff] shadow-sm flex flex-col">
          <span className="text-[11px] font-semibold text-[#3d4947]">Total Income</span>
          <span className="text-[16px] font-extrabold text-[#006947] font-mono tabular-nums mt-0.5">
            {formatCurrency(totalIncome, currencyCode)}
          </span>
          <span className="text-[10px] text-[#3d4947] mt-1">Inflows</span>
        </div>

        <div className="p-3 rounded-2xl bg-white border border-[#e5eeff] shadow-sm flex flex-col">
          <span className="text-[11px] font-semibold text-[#3d4947]">Savings Rate</span>
          <span className="text-[16px] font-extrabold text-[#00685f] font-mono tabular-nums mt-0.5">
            {savingsRate.toFixed(1)}%
          </span>
          <span className="text-[10px] text-[#3d4947] mt-1">
            {netSavings >= 0 ? 'Surplus' : 'Deficit'}
          </span>
        </div>
      </div>

      {/* Visual Category Proportion Bar */}
      <div className="rounded-2xl bg-white p-5 border border-[#e5eeff] shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[17px] font-bold text-[#0b1c30]">Category Distribution</h2>
          <span className="text-[12px] font-semibold text-[#3d4947]">
            {categoryStats.length} active categories
          </span>
        </div>

        {/* Stacked Proportional Bar */}
        {totalSpending > 0 ? (
          <div className="w-full h-4 rounded-full bg-[#eff4ff] flex overflow-hidden shadow-inner">
            {categoryStats.map((cat, idx) => (
              <div
                key={idx}
                style={{
                  width: `${cat.percentage}%`,
                  backgroundColor: cat.config.hexColor,
                }}
                className="h-full transition-all duration-500 first:rounded-l-full last:rounded-r-full hover:opacity-90 relative group"
                title={`${cat.category}: ${cat.percentage.toFixed(1)}% (${formatCurrency(
                  cat.amount,
                  currencyCode
                )})`}
              ></div>
            ))}
          </div>
        ) : (
          <div className="w-full h-4 rounded-full bg-[#eff4ff]"></div>
        )}

        {/* Legend Pills */}
        <div className="flex flex-wrap gap-2 pt-1">
          {categoryStats.slice(0, 5).map((cat, idx) => (
            <div key={idx} className="flex items-center gap-1.5 text-[11px] text-[#3d4947]">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: cat.config.hexColor }}
              ></span>
              <span className="font-medium text-[#0b1c30]">{cat.category}</span>
              <span className="text-[#3d4947] font-mono">({cat.percentage.toFixed(0)}%)</span>
            </div>
          ))}
        </div>
      </div>

      {/* Category Breakdown List */}
      <div className="rounded-2xl bg-white p-5 border border-[#e5eeff] shadow-sm flex flex-col gap-3">
        <h2 className="text-[17px] font-bold text-[#0b1c30]">Category Spending Ranking</h2>

        {categoryStats.length === 0 ? (
          <p className="text-[13px] text-[#3d4947] py-4 text-center">
            No expenses found in this timeframe.
          </p>
        ) : (
          <div className="flex flex-col gap-3.5">
            {categoryStats.map((cat) => (
              <div key={cat.category} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${cat.config.bgClass}`}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {cat.config.iconName}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[13px] font-bold text-[#0b1c30]">{cat.category}</span>
                      <span className="text-[11px] text-[#3d4947]">{cat.count} transactions</span>
                    </div>
                  </div>

                  <div className="flex flex-col text-right">
                    <span className="text-[14px] font-extrabold text-[#0b1c30] font-mono tabular-nums">
                      {formatCurrency(cat.amount, currencyCode)}
                    </span>
                    <span className="text-[11px] font-semibold text-[#00685f]">
                      {cat.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Progress bar per category */}
                <div className="w-full h-2 rounded-full bg-[#eff4ff] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, cat.percentage)}%`,
                      backgroundColor: cat.config.hexColor,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Spending Insights Section */}
      <div className="rounded-2xl bg-white p-5 border border-[#e5eeff] shadow-sm flex flex-col gap-3">
        <h2 className="text-[17px] font-bold text-[#0b1c30]">Key Spending Insights</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Top Category Insight */}
          <div className="p-3.5 rounded-xl bg-[#f8f9ff] border border-[#e5eeff] flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#dae2fd] text-[#131b2e] flex items-center justify-center shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[20px]">trending_up</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] font-semibold text-[#3d4947] uppercase">
                Top Expense Area
              </span>
              <span className="text-[14px] font-bold text-[#0b1c30] truncate">
                {topCategory ? topCategory.category : 'N/A'}
              </span>
              <span className="text-[12px] text-[#3d4947] mt-0.5 font-mono">
                {topCategory
                  ? `${formatCurrency(topCategory.amount, currencyCode)} (${topCategory.percentage.toFixed(
                      1
                    )}% of total)`
                  : 'No expenses'}
              </span>
            </div>
          </div>

          {/* Average Size Insight */}
          <div className="p-3.5 rounded-xl bg-[#f8f9ff] border border-[#e5eeff] flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#e5eeff] text-[#00685f] flex items-center justify-center shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[20px]">analytics</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] font-semibold text-[#3d4947] uppercase">
                Average Expense Size
              </span>
              <span className="text-[14px] font-bold text-[#0b1c30] font-mono tabular-nums">
                {formatCurrency(avgExpense, currencyCode)}
              </span>
              <span className="text-[12px] text-[#3d4947] mt-0.5">
                Across {expenseCount} transactions
              </span>
            </div>
          </div>

          {/* Largest Expense Insight */}
          {largestExpense && (
            <div className="p-3.5 rounded-xl bg-[#f8f9ff] border border-[#e5eeff] flex items-start gap-3 sm:col-span-2">
              <div className="w-9 h-9 rounded-lg bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[20px]">price_change</span>
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-[11px] font-semibold text-[#3d4947] uppercase">
                  Largest Single Expense
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-bold text-[#0b1c30] truncate">
                    {largestExpense.title}
                  </span>
                  <span className="text-[14px] font-extrabold text-[#ba1a1a] font-mono tabular-nums">
                    {formatCurrency(largestExpense.amount, currencyCode)}
                  </span>
                </div>
                <span className="text-[12px] text-[#3d4947] mt-0.5">
                  {largestExpense.category} • {new Date(largestExpense.date).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
