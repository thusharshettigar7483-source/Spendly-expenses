import React, { useState, useEffect } from 'react';
import { ActiveTab, Transaction, AppNotification } from './types/finance';
import {
  loadTransactions,
  saveTransactions,
  loadMonthlyBudget,
  saveMonthlyBudget,
  loadStartingCash,
  saveStartingCash,
  loadCurrencyCode,
  saveCurrencyCode,
  loadHideBalance,
  saveHideBalance,
  loadNotifications,
  saveNotifications,
  resetDemoData,
  clearAllData,
  exportTransactionsToCSV,
} from './utils/storage';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { DashboardView } from './components/DashboardView';
import { ExpensesView } from './components/ExpensesView';
import { AnalyticsView } from './components/AnalyticsView';
import { BudgetView } from './components/BudgetView';
import { ExpenseModal } from './components/ExpenseModal';
import { TransferModal } from './components/TransferModal';
import { SetBudgetModal } from './components/SetBudgetModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { ProfileModal } from './components/ProfileModal';
import { Toast } from './components/Toast';

export default function App() {
  // Core finance state
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [monthlyBudget, setMonthlyBudget] = useState<number>(4000);
  const [startingCash, setStartingCash] = useState<number>(5630.70);
  const [currencyCode, setCurrencyCode] = useState<string>('USD');
  const [hideBalance, setHideBalance] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('Sarah');
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  // Navigation & Modals
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isSetBudgetModalOpen, setIsSetBudgetModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // User feedback toast
  const [toast, setToast] = useState<{
    message: string;
    type?: 'success' | 'info' | 'error';
  } | null>(null);

  // Initialize from LocalStorage on mount
  useEffect(() => {
    const txs = loadTransactions();
    const budget = loadMonthlyBudget();
    const cash = loadStartingCash();
    const curr = loadCurrencyCode();
    const hidden = loadHideBalance();
    const notifs = loadNotifications();

    setTransactions(txs);
    setMonthlyBudget(budget);
    setStartingCash(cash);
    setCurrencyCode(curr);
    setHideBalance(hidden);
    setNotifications(notifs);
  }, []);

  // Save changes to transactions
  const handleSaveExpense = (txData: {
    id?: string;
    title: string;
    amount: number;
    type: 'expense' | 'income';
    category: any;
    date: string;
    note?: string;
    paymentMethod: any;
  }) => {
    let updated: Transaction[];
    if (txData.id) {
      // Editing existing transaction
      updated = transactions.map((t) =>
        t.id === txData.id ? ({ ...t, ...txData } as Transaction) : t
      );
      setToast({ message: `Updated "${txData.title}"`, type: 'success' });
    } else {
      // Creating new transaction
      const newTx: Transaction = {
        ...txData,
        id: `tx-${Date.now()}`,
      };
      updated = [newTx, ...transactions];
      setToast({
        message: `Recorded ${txData.type === 'income' ? 'income' : 'expense'}: ${txData.title}`,
        type: 'success',
      });
    }

    setTransactions(updated);
    saveTransactions(updated);

    // Auto budget-check notification if expense exceeded 80%
    if (txData.type === 'expense') {
      const totalSpent = updated
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      if (monthlyBudget > 0 && totalSpent / monthlyBudget > 0.8) {
        const notif: AppNotification = {
          id: `notif-${Date.now()}`,
          title: 'Budget Alert',
          message: `You've spent ${((totalSpent / monthlyBudget) * 100).toFixed(0)}% of your monthly budget.`,
          timestamp: 'Just now',
          read: false,
          type: 'alert',
        };
        const newNotifs = [notif, ...notifications];
        setNotifications(newNotifs);
        saveNotifications(newNotifs);
      }
    }
  };

  // Delete transaction
  const handleDeleteExpense = (id: string) => {
    const toDelete = transactions.find((t) => t.id === id);
    const updated = transactions.filter((t) => t.id !== id);
    setTransactions(updated);
    saveTransactions(updated);
    setToast({
      message: `Deleted "${toDelete?.title || 'transaction'}"`,
      type: 'info',
    });
  };

  // Record transfer or income
  const handleTransfer = (txData: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...txData,
      id: `tx-${Date.now()}`,
    };
    const updated = [newTx, ...transactions];
    setTransactions(updated);
    saveTransactions(updated);
    setToast({ message: `Recorded transfer: ${txData.title}`, type: 'success' });
  };

  // Update monthly budget limit
  const handleUpdateBudget = (newLimit: number) => {
    setMonthlyBudget(newLimit);
    saveMonthlyBudget(newLimit);
    setToast({
      message: `Monthly budget updated to ${newLimit.toLocaleString()}`,
      type: 'success',
    });
  };

  // Update display currency
  const handleUpdateCurrency = (newCode: string) => {
    setCurrencyCode(newCode);
    saveCurrencyCode(newCode);
    setToast({ message: `Currency switched to ${newCode}`, type: 'info' });
  };

  // Toggle hide balance
  const handleToggleHideBalance = () => {
    const next = !hideBalance;
    setHideBalance(next);
    saveHideBalance(next);
  };

  // Reset to original demo data
  const handleResetDemoData = () => {
    resetDemoData();
    setTransactions(loadTransactions());
    setMonthlyBudget(loadMonthlyBudget());
    setStartingCash(loadStartingCash());
    setCurrencyCode('USD');
    setHideBalance(false);
    setNotifications(loadNotifications());
    setToast({ message: "Reset to Sarah's demo data!", type: 'info' });
  };

  // Clear all stored data
  const handleClearAllData = () => {
    clearAllData();
    setTransactions([]);
    setStartingCash(0);
    setNotifications([]);
    setToast({ message: 'All stored data wiped clean.', type: 'info' });
  };

  // Export CSV
  const handleExportCSV = () => {
    exportTransactionsToCSV(transactions);
    setToast({ message: 'Transactions exported to CSV', type: 'success' });
  };

  // Open edit modal for specific transaction
  const handleEditTransaction = (tx: Transaction) => {
    setEditingTransaction(tx);
    setIsExpenseModalOpen(true);
  };

  // Open modal for new expense
  const handleOpenAddExpense = () => {
    setEditingTransaction(null);
    setIsExpenseModalOpen(true);
  };

  // Notification actions
  const handleMarkAllNotificationsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    saveNotifications(updated);
  };

  const handleClearNotifications = () => {
    setNotifications([]);
    saveNotifications([]);
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col font-sans selection:bg-[#89f5e7] selection:text-[#00201d]">
      {/* Toast Feedback */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Top Application Header */}
      <Header
        activeTab={activeTab}
        notifications={notifications}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        userName={userName}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative w-full pt-16 pb-28 max-w-2xl mx-auto">
        {activeTab === 'dashboard' && (
          <DashboardView
            transactions={transactions}
            monthlyBudget={monthlyBudget}
            startingCash={startingCash}
            currencyCode={currencyCode}
            hideBalance={hideBalance}
            onToggleHideBalance={handleToggleHideBalance}
            onOpenAddExpense={handleOpenAddExpense}
            onOpenTransfer={() => setIsTransferModalOpen(true)}
            onOpenSetBudget={() => setIsSetBudgetModalOpen(true)}
            onExport={handleExportCSV}
            onNavigateToExpenses={() => setActiveTab('expenses')}
            onEditTransaction={handleEditTransaction}
            userName={userName}
          />
        )}

        {activeTab === 'expenses' && (
          <ExpensesView
            transactions={transactions}
            currencyCode={currencyCode}
            onEditTransaction={handleEditTransaction}
            onDeleteTransaction={handleDeleteExpense}
            onOpenAddExpense={handleOpenAddExpense}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView
            transactions={transactions}
            monthlyBudget={monthlyBudget}
            currencyCode={currencyCode}
          />
        )}

        {activeTab === 'budget' && (
          <BudgetView
            transactions={transactions}
            monthlyBudget={monthlyBudget}
            currencyCode={currencyCode}
            onUpdateBudget={handleUpdateBudget}
            onUpdateCurrency={handleUpdateCurrency}
            onExportCSV={handleExportCSV}
            onResetDemoData={handleResetDemoData}
            onClearAllData={handleClearAllData}
          />
        )}
      </main>

      {/* Fixed Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenAddExpense={handleOpenAddExpense}
      />

      {/* Modals & Drawers */}
      <ExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => {
          setIsExpenseModalOpen(false);
          setEditingTransaction(null);
        }}
        onSave={handleSaveExpense}
        initialData={editingTransaction}
        currencyCode={currencyCode}
      />

      <TransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        onSave={handleTransfer}
        currencyCode={currencyCode}
      />

      <SetBudgetModal
        isOpen={isSetBudgetModalOpen}
        onClose={() => setIsSetBudgetModalOpen(false)}
        monthlyBudget={monthlyBudget}
        currencyCode={currencyCode}
        onSaveBudget={handleUpdateBudget}
      />

      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllNotificationsRead}
        onClearNotifications={handleClearNotifications}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        userName={userName}
        onUpdateUserName={setUserName}
        currencyCode={currencyCode}
        onUpdateCurrency={handleUpdateCurrency}
        onResetDemoData={handleResetDemoData}
      />
    </div>
  );
}
