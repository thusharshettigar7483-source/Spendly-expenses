import { Transaction, CURRENCIES, AppNotification } from '../types/finance';

const STORAGE_KEYS = {
  TRANSACTIONS: 'spendly_transactions_v1',
  MONTHLY_BUDGET: 'spendly_monthly_budget_v1',
  STARTING_CASH: 'spendly_starting_cash_v1',
  CURRENCY_CODE: 'spendly_currency_code_v1',
  HIDE_BALANCE: 'spendly_hide_balance_v1',
  USER_NAME: 'spendly_user_name_v1',
  NOTIFICATIONS: 'spendly_notifications_v1',
};

// Generates ISO timestamp for days ago at given hour and minute
function getDateAgo(daysAgo: number, hours = 12, minutes = 0): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hours, minutes, 0, 0);
  return d.toISOString();
}

export const INITIAL_DEMO_TRANSACTIONS: Transaction[] = [
  // Today's expenses (Total: 5.40 + 84.20 + 34.90 = $124.50)
  {
    id: 'tx-1',
    title: 'Starbucks Coffee',
    amount: 5.40,
    type: 'expense',
    category: 'Food & Dining',
    date: getDateAgo(0, 10, 15),
    note: 'Iced Caramel Macchiato with oat milk',
    paymentMethod: 'Credit Card',
  },
  {
    id: 'tx-2',
    title: 'Whole Foods Market',
    amount: 84.20,
    type: 'expense',
    category: 'Groceries',
    date: getDateAgo(0, 8, 30),
    note: 'Fresh organic greens, berries and pantry restock',
    paymentMethod: 'Debit Card',
  },
  {
    id: 'tx-3',
    title: 'CVS Pharmacy Essentials',
    amount: 34.90,
    type: 'expense',
    category: 'Healthcare',
    date: getDateAgo(0, 13, 45),
    note: 'Vitamins & skincare essentials',
    paymentMethod: 'Apple Pay',
  },
  // Yesterday's expenses
  {
    id: 'tx-4',
    title: 'Uber Ride',
    amount: 22.50,
    type: 'expense',
    category: 'Transport',
    date: getDateAgo(1, 19, 45),
    note: 'Ride home from downtown dinner',
    paymentMethod: 'Apple Pay',
  },
  {
    id: 'tx-5',
    title: 'Trader Joe\'s Flowers & Snacks',
    amount: 42.50,
    type: 'expense',
    category: 'Groceries',
    date: getDateAgo(1, 14, 20),
    paymentMethod: 'Debit Card',
  },
  // Additional weekly expenses matching design curve
  {
    id: 'tx-6',
    title: 'Sweetgreen Salad Bowl',
    amount: 24.00,
    type: 'expense',
    category: 'Food & Dining',
    date: getDateAgo(2, 12, 30),
    note: 'Harvest bowl with avocado',
    paymentMethod: 'Credit Card',
  },
  {
    id: 'tx-7',
    title: 'Chevron Fuel Refill',
    amount: 52.00,
    type: 'expense',
    category: 'Transport',
    date: getDateAgo(3, 17, 10),
    note: 'Full tank unleaded',
    paymentMethod: 'Credit Card',
  },
  {
    id: 'tx-8',
    title: 'Barnes & Noble Books',
    amount: 38.00,
    type: 'expense',
    category: 'Shopping',
    date: getDateAgo(4, 15, 20),
    note: 'Design and finance paperbacks',
    paymentMethod: 'Credit Card',
  },
  {
    id: 'tx-9',
    title: 'Weekend Italian Bistro',
    amount: 70.00,
    type: 'expense',
    category: 'Food & Dining',
    date: getDateAgo(5, 20, 0),
    note: 'Dinner with friends',
    paymentMethod: 'Credit Card',
  },
  {
    id: 'tx-10',
    title: 'App Store Audio Subscription',
    amount: 18.00,
    type: 'expense',
    category: 'Entertainment',
    date: getDateAgo(6, 9, 0),
    paymentMethod: 'Apple Pay',
  },
  // Monthly recurring & larger expenses to reach ~$2,380.50 spending
  {
    id: 'tx-11',
    title: 'Netflix Subscription',
    amount: 15.99,
    type: 'expense',
    category: 'Entertainment',
    date: getDateAgo(10, 8, 0),
    note: 'Premium 4K Family plan',
    paymentMethod: 'Credit Card',
  },
  {
    id: 'tx-12',
    title: 'Residential Apartment Rent Share',
    amount: 1450.00,
    type: 'expense',
    category: 'Bills & Utilities',
    date: getDateAgo(11, 7, 0),
    note: 'October apartment lease portion',
    paymentMethod: 'Bank Transfer',
  },
  {
    id: 'tx-13',
    title: 'High-Speed Fiber Internet',
    amount: 79.99,
    type: 'expense',
    category: 'Bills & Utilities',
    date: getDateAgo(12, 11, 0),
    paymentMethod: 'Debit Card',
  },
  {
    id: 'tx-14',
    title: 'Equinox Fitness Club Membership',
    amount: 160.00,
    type: 'expense',
    category: 'Healthcare',
    date: getDateAgo(13, 9, 30),
    paymentMethod: 'Credit Card',
  },
  {
    id: 'tx-15',
    title: 'Uniqlo Autumn Wardrobe',
    amount: 213.02,
    type: 'expense',
    category: 'Shopping',
    date: getDateAgo(14, 16, 45),
    note: 'Warm merino knits & outerwear',
    paymentMethod: 'Credit Card',
  },
  // Incomes (Total: $5,200.00)
  {
    id: 'tx-income-1',
    title: 'Product Design Monthly Salary',
    amount: 4500.00,
    type: 'income',
    category: 'Income',
    date: getDateAgo(10, 9, 0),
    note: 'Acme Corp direct deposit',
    paymentMethod: 'Bank Transfer',
  },
  {
    id: 'tx-income-2',
    title: 'UI Design Freelance Consultation',
    amount: 700.00,
    type: 'income',
    category: 'Income',
    date: getDateAgo(5, 14, 0),
    note: 'Fintech audit client payment',
    paymentMethod: 'Bank Transfer',
  },
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Budget On Track',
    message: 'You have spent 59.5% of your monthly budget. Safe pace: ~$115.67/day.',
    timestamp: '1 hour ago',
    read: false,
    type: 'budget',
  },
  {
    id: 'notif-2',
    title: 'Weekly Summary Ready',
    message: 'Your spending decreased by 12% compared to last week.',
    timestamp: 'Yesterday',
    read: true,
    type: 'system',
  },
  {
    id: 'notif-3',
    title: 'Subscription Renewed',
    message: 'Netflix Subscription ($15.99) was billed to Credit Card.',
    timestamp: '3 days ago',
    read: true,
    type: 'alert',
  },
];

// Baseline balance anchor so that Initial Net Balance = $8,450.20
// Formula: Net Balance = Starting Cash ($5,630.70) + Income ($5,200.00) - Expense ($2,380.50) = $8,450.20
export const DEFAULT_STARTING_CASH = 5630.70;
export const DEFAULT_MONTHLY_BUDGET = 4000.00;

export function loadTransactions(): Transaction[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (!raw) {
      saveTransactions(INITIAL_DEMO_TRANSACTIONS);
      return INITIAL_DEMO_TRANSACTIONS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_DEMO_TRANSACTIONS;
  } catch {
    return INITIAL_DEMO_TRANSACTIONS;
  }
}

export function saveTransactions(txs: Transaction[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(txs));
  } catch (err) {
    console.error('Failed to save transactions to localStorage', err);
  }
}

export function loadMonthlyBudget(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MONTHLY_BUDGET);
    if (!raw) return DEFAULT_MONTHLY_BUDGET;
    const val = parseFloat(raw);
    return isNaN(val) ? DEFAULT_MONTHLY_BUDGET : val;
  } catch {
    return DEFAULT_MONTHLY_BUDGET;
  }
}

export function saveMonthlyBudget(budget: number): void {
  try {
    localStorage.setItem(STORAGE_KEYS.MONTHLY_BUDGET, budget.toString());
  } catch (err) {
    console.error('Failed to save budget', err);
  }
}

export function loadStartingCash(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STARTING_CASH);
    if (!raw) return DEFAULT_STARTING_CASH;
    const val = parseFloat(raw);
    return isNaN(val) ? DEFAULT_STARTING_CASH : val;
  } catch {
    return DEFAULT_STARTING_CASH;
  }
}

export function saveStartingCash(cash: number): void {
  try {
    localStorage.setItem(STORAGE_KEYS.STARTING_CASH, cash.toString());
  } catch (err) {
    console.error('Failed to save cash', err);
  }
}

export function loadCurrencyCode(): string {
  try {
    return localStorage.getItem(STORAGE_KEYS.CURRENCY_CODE) || 'USD';
  } catch {
    return 'USD';
  }
}

export function saveCurrencyCode(code: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENCY_CODE, code);
  } catch (err) {
    console.error('Failed to save currency', err);
  }
}

export function loadHideBalance(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEYS.HIDE_BALANCE) === 'true';
  } catch {
    return false;
  }
}

export function saveHideBalance(hidden: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEYS.HIDE_BALANCE, hidden.toString());
  } catch (err) {
    console.error('Failed to save hide balance', err);
  }
}

export function loadNotifications(): AppNotification[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (!raw) {
      saveNotifications(INITIAL_NOTIFICATIONS);
      return INITIAL_NOTIFICATIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_NOTIFICATIONS;
  }
}

export function saveNotifications(notifs: AppNotification[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
  } catch (err) {
    console.error('Failed to save notifications', err);
  }
}

export function resetDemoData(): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(INITIAL_DEMO_TRANSACTIONS));
    localStorage.setItem(STORAGE_KEYS.MONTHLY_BUDGET, DEFAULT_MONTHLY_BUDGET.toString());
    localStorage.setItem(STORAGE_KEYS.STARTING_CASH, DEFAULT_STARTING_CASH.toString());
    localStorage.setItem(STORAGE_KEYS.CURRENCY_CODE, 'USD');
    localStorage.setItem(STORAGE_KEYS.HIDE_BALANCE, 'false');
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
  } catch (err) {
    console.error('Failed to reset demo data', err);
  }
}

export function clearAllData(): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.STARTING_CASH, '0');
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([]));
  } catch (err) {
    console.error('Failed to clear all data', err);
  }
}

// Financial Math Helpers
export function formatCurrency(amount: number, currencyCode = 'USD'): string {
  const currency = CURRENCIES.find((c) => c.code === currencyCode) || CURRENCIES[0];
  const abs = Math.abs(amount);
  const formatted = abs.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${currency.symbol}${formatted}`;
}

export function getCurrencySymbol(currencyCode = 'USD'): string {
  const currency = CURRENCIES.find((c) => c.code === currencyCode);
  return currency ? currency.symbol : '$';
}

export function getDaysLeftInCurrentMonth(): number {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const lastDay = new Date(year, month + 1, 0).getDate();
  const today = now.getDate();
  const remaining = lastDay - today;
  return Math.max(1, remaining);
}

export function getRelativeTimeString(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();
  
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  const timePart = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  if (isToday) return `Today, ${timePart}`;
  if (isYesterday) return `Yesterday, ${timePart}`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function exportTransactionsToCSV(txs: Transaction[]): void {
  const headers = ['ID', 'Date', 'Type', 'Title', 'Category', 'Amount', 'Payment Method', 'Note'];
  const rows = txs.map((tx) => [
    `"${tx.id}"`,
    `"${tx.date}"`,
    `"${tx.type}"`,
    `"${tx.title.replace(/"/g, '""')}"`,
    `"${tx.category}"`,
    tx.amount.toFixed(2),
    `"${tx.paymentMethod}"`,
    `"${(tx.note || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `spendly_transactions_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
