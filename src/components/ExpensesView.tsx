import React, { useState, useMemo } from 'react';
import { Transaction, ExpenseCategory, CATEGORY_DEFINITIONS } from '../types/finance';
import { formatCurrency, getRelativeTimeString } from '../utils/storage';

interface ExpensesViewProps {
  transactions: Transaction[];
  currencyCode: string;
  onEditTransaction: (tx: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
  onOpenAddExpense: () => void;
}

export const ExpensesView: React.FC<ExpensesViewProps> = ({
  transactions,
  currencyCode,
  onEditTransaction,
  onDeleteTransaction,
  onOpenAddExpense,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'amount-high' | 'amount-low'>('newest');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const categories = useMemo(() => {
    return ['All', ...Object.keys(CATEGORY_DEFINITIONS)];
  }, []);

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    
    // Week start (Monday)
    const dayOfWeek = (now.getDay() + 6) % 7;
    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek).getTime();

    // Month start
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

    return transactions
      .filter((tx) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = tx.title.toLowerCase().includes(q);
          const matchesCat = tx.category.toLowerCase().includes(q);
          const matchesNote = (tx.note || '').toLowerCase().includes(q);
          const matchesPayment = tx.paymentMethod.toLowerCase().includes(q);
          if (!matchesTitle && !matchesCat && !matchesNote && !matchesPayment) {
            return false;
          }
        }

        // Category filter
        if (selectedCategory !== 'All' && tx.category !== selectedCategory) {
          return false;
        }

        // Date filter
        const txTime = new Date(tx.date).getTime();
        if (dateFilter === 'today' && txTime < todayStart) return false;
        if (dateFilter === 'week' && txTime < weekStart) return false;
        if (dateFilter === 'month' && txTime < monthStart) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        if (sortBy === 'oldest') {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        }
        if (sortBy === 'amount-high') {
          return b.amount - a.amount;
        }
        if (sortBy === 'amount-low') {
          return a.amount - b.amount;
        }
        return 0;
      });
  }, [transactions, searchQuery, selectedCategory, dateFilter, sortBy]);

  const totalFilteredSum = useMemo(() => {
    return filteredTransactions.reduce((sum, tx) => {
      return tx.type === 'income' ? sum + tx.amount : sum - tx.amount;
    }, 0);
  }, [filteredTransactions]);

  const totalExpensesSum = useMemo(() => {
    return filteredTransactions
      .filter((tx) => tx.type === 'expense')
      .reduce((sum, tx) => sum + tx.amount, 0);
  }, [filteredTransactions]);

  const handleConfirmDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteTransaction(id);
    setDeletingId(null);
  };

  return (
    <div className="flex flex-col w-full px-4 sm:px-6 pb-6 gap-4 pt-2">
      {/* Title bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[26px] leading-tight text-[#0b1c30] tracking-tight font-extrabold">
            Expense History
          </h1>
          <p className="text-[13px] text-[#3d4947]">
            {filteredTransactions.length} transaction{filteredTransactions.length === 1 ? '' : 's'} found
          </p>
        </div>

        <button
          onClick={onOpenAddExpense}
          className="px-3.5 py-2 rounded-xl bg-[#00685f] hover:bg-[#005049] text-white text-[13px] font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Add</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative w-full">
        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[20px] text-[#3d4947]">
          search
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by merchant, note, payment..."
          className="w-full h-12 pl-10 pr-10 rounded-xl bg-white border border-[#e5eeff] text-[#0b1c30] text-[14px] placeholder-[#3d4947]/60 focus:outline-none focus:border-[#00685f] focus:ring-2 focus:ring-[#00685f]/15 transition-all shadow-sm"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#3d4947] hover:text-[#0b1c30] p-1 cursor-pointer"
            aria-label="Clear search"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        )}
      </div>

      {/* Date & Sort Controls */}
      <div className="flex items-center justify-between gap-2">
        {/* Date Filter Tabs */}
        <div className="flex items-center gap-1 bg-[#eff4ff] p-1 rounded-xl overflow-x-auto no-scrollbar shrink-0">
          {(['all', 'today', 'week', 'month'] as const).map((filter) => {
            const labels = {
              all: 'All',
              today: 'Today',
              week: 'Week',
              month: 'Month',
            };
            return (
              <button
                key={filter}
                onClick={() => setDateFilter(filter)}
                className={`px-3 py-1 rounded-lg text-[12px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  dateFilter === filter
                    ? 'bg-white text-[#00685f] shadow-sm font-bold'
                    : 'text-[#3d4947] hover:text-[#0b1c30]'
                }`}
                type="button"
              >
                {labels[filter]}
              </button>
            );
          })}
        </div>

        {/* Sort Dropdown */}
        <div className="relative shrink-0">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="h-8.5 px-2.5 pr-7 bg-white border border-[#e5eeff] rounded-xl text-[12px] font-semibold text-[#0b1c30] focus:outline-none focus:border-[#00685f] cursor-pointer shadow-sm appearance-none"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="amount-high">Highest Amount</option>
            <option value="amount-low">Lowest Amount</option>
          </select>
          <span className="material-symbols-outlined absolute right-1.5 top-1/2 -translate-y-1/2 text-[18px] text-[#3d4947] pointer-events-none">
            unfold_more
          </span>
        </div>
      </div>

      {/* Horizontal Category Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
        {categories.map((catName) => {
          const isSelected = selectedCategory === catName;
          return (
            <button
              key={catName}
              onClick={() => setSelectedCategory(catName)}
              className={`px-3 py-1.5 rounded-full text-[12px] font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                isSelected
                  ? 'bg-[#00685f] text-white shadow-sm'
                  : 'bg-white text-[#3d4947] border border-[#e5eeff] hover:bg-[#eff4ff]'
              }`}
              type="button"
            >
              {catName}
            </button>
          );
        })}
      </div>

      {/* Filtered Summary Card */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#e5eeff] shadow-sm">
        <div className="flex flex-col">
          <span className="text-[11px] font-medium text-[#3d4947]">Filtered Outflow:</span>
          <span className="text-[16px] font-extrabold text-[#ba1a1a] font-mono tabular-nums">
            -{formatCurrency(totalExpensesSum, currencyCode)}
          </span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-[11px] font-medium text-[#3d4947]">Filtered Net:</span>
          <span
            className={`text-[16px] font-extrabold font-mono tabular-nums ${
              totalFilteredSum >= 0 ? 'text-[#006947]' : 'text-[#0b1c30]'
            }`}
          >
            {totalFilteredSum >= 0 ? '+' : '-'}
            {formatCurrency(Math.abs(totalFilteredSum), currencyCode)}
          </span>
        </div>
      </div>

      {/* Transactions List */}
      <div className="flex flex-col gap-2">
        {filteredTransactions.length === 0 ? (
          <div className="p-10 rounded-2xl bg-white border border-[#e5eeff] text-center flex flex-col items-center justify-center gap-3 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-[#eff4ff] text-[#00685f] flex items-center justify-center">
              <span className="material-symbols-outlined text-[30px]">search_off</span>
            </div>
            <h3 className="text-[16px] font-bold text-[#0b1c30]">No transactions found</h3>
            <p className="text-[13px] text-[#3d4947] max-w-xs">
              {searchQuery || selectedCategory !== 'All' || dateFilter !== 'all'
                ? 'Try adjusting your search terms or clearing the selected filters.'
                : 'Get started by tracking your first daily expense!'}
            </p>
            {(searchQuery || selectedCategory !== 'All' || dateFilter !== 'all') ? (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setDateFilter('all');
                }}
                className="mt-1 px-4 py-2 bg-[#eff4ff] text-[#00685f] text-[13px] font-bold rounded-xl hover:bg-[#dce9ff] transition-all cursor-pointer"
              >
                Reset Filters
              </button>
            ) : (
              <button
                onClick={onOpenAddExpense}
                className="mt-1 px-4 py-2 bg-[#00685f] text-white text-[13px] font-bold rounded-xl hover:bg-[#005049] transition-all cursor-pointer"
              >
                Add First Expense
              </button>
            )}
          </div>
        ) : (
          filteredTransactions.map((tx) => {
            const cat = CATEGORY_DEFINITIONS[tx.category] || CATEGORY_DEFINITIONS['Other'];
            const isIncome = tx.type === 'income';

            return (
              <div
                key={tx.id}
                onClick={() => onEditTransaction(tx)}
                className="group relative flex items-center justify-between p-3.5 rounded-2xl bg-white border border-[#e5eeff] hover:border-[#00685f]/30 hover:shadow-sm active:bg-[#f8f9ff] transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${cat.bgClass}`}
                  >
                    <span className="material-symbols-outlined text-[22px]">{cat.iconName}</span>
                  </div>

                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-[15px] font-bold text-[#0b1c30] truncate">
                      {tx.title}
                    </span>
                    <div className="flex items-center gap-1.5 text-[12px] text-[#3d4947] flex-wrap">
                      <span className="font-medium text-[#0b1c30]/80">{tx.category}</span>
                      <span>•</span>
                      <span>{getRelativeTimeString(tx.date)}</span>
                      <span>•</span>
                      <span className="px-1.5 py-0.2 rounded bg-[#eff4ff] text-[#3d4947] text-[10px] font-semibold">
                        {tx.paymentMethod}
                      </span>
                    </div>
                    {tx.note && (
                      <p className="text-[11px] text-[#3d4947]/80 truncate mt-0.5 italic">
                        "{tx.note}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 pl-3">
                  <span
                    className={`text-[15px] font-extrabold font-mono tabular-nums ${
                      isIncome ? 'text-[#006947]' : 'text-[#0b1c30]'
                    }`}
                  >
                    {isIncome ? '+' : '-'}
                    {formatCurrency(tx.amount, currencyCode)}
                  </span>

                  {/* Actions: Edit & Delete buttons */}
                  <div className="flex items-center gap-0.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditTransaction(tx);
                      }}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-[#3d4947] hover:bg-[#eff4ff] hover:text-[#00685f] active:scale-95 transition-all cursor-pointer"
                      title="Edit Transaction"
                      aria-label="Edit"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletingId(tx.id);
                      }}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-[#ba1a1a]/70 hover:bg-[#ffdad6] hover:text-[#ba1a1a] active:scale-95 transition-all cursor-pointer"
                      title="Delete Transaction"
                      aria-label="Delete"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>

                {/* Delete Confirmation Overlay for this card */}
                {deletingId === tx.id && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute inset-0 bg-white/95 rounded-2xl flex items-center justify-between px-4 z-10 border border-[#ffdad6] shadow-sm animate-fadeIn"
                  >
                    <span className="text-[13px] font-bold text-[#ba1a1a]">
                      Delete this transaction?
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingId(null);
                        }}
                        className="px-3 py-1 text-[12px] font-semibold text-[#3d4947] hover:bg-[#eff4ff] rounded-lg cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={(e) => handleConfirmDelete(tx.id, e)}
                        className="px-3 py-1 text-[12px] font-bold text-white bg-[#ba1a1a] hover:bg-[#93000a] rounded-lg shadow-sm cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
