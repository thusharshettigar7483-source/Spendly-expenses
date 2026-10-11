export type ExpenseCategory =
  | 'Food & Dining'
  | 'Groceries'
  | 'Transport'
  | 'Entertainment'
  | 'Shopping'
  | 'Bills & Utilities'
  | 'Healthcare'
  | 'Income'
  | 'Transfer'
  | 'Other';

export type PaymentMethod =
  | 'Credit Card'
  | 'Debit Card'
  | 'Cash'
  | 'Apple Pay'
  | 'Bank Transfer';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: 'expense' | 'income';
  category: ExpenseCategory;
  date: string; // ISO 8601 string
  note?: string;
  paymentMethod: PaymentMethod;
}

export interface CurrencyConfig {
  code: string;
  symbol: string;
  label: string;
}

export const CURRENCIES: CurrencyConfig[] = [
  { code: 'USD', symbol: '$', label: 'USD ($) - US Dollar' },
  { code: 'EUR', symbol: '€', label: 'EUR (€) - Euro' },
  { code: 'GBP', symbol: '£', label: 'GBP (£) - British Pound' },
  { code: 'INR', symbol: '₹', label: 'INR (₹) - Indian Rupee' },
  { code: 'CAD', symbol: '$', label: 'CAD ($) - Canadian Dollar' },
  { code: 'AUD', symbol: '$', label: 'AUD ($) - Australian Dollar' },
];

export interface CategoryInfo {
  name: ExpenseCategory;
  iconName: string; // Material symbol or Lucide name
  lucideIcon: string;
  bgClass: string;
  textClass: string;
  badgeBg: string;
  badgeText: string;
  hexColor: string;
}

export const CATEGORY_DEFINITIONS: Record<ExpenseCategory, CategoryInfo> = {
  'Food & Dining': {
    name: 'Food & Dining',
    iconName: 'local_cafe',
    lucideIcon: 'Coffee',
    bgClass: 'bg-[#6ffbbe]/25 text-[#006947]',
    textClass: 'text-[#006947]',
    badgeBg: 'bg-[#e6faf2]',
    badgeText: 'text-[#006947]',
    hexColor: '#00855b',
  },
  'Groceries': {
    name: 'Groceries',
    iconName: 'shopping_cart',
    lucideIcon: 'ShoppingCart',
    bgClass: 'bg-[#dae2fd] text-[#3f465c]',
    textClass: 'text-[#3f465c]',
    badgeBg: 'bg-[#edf2ff]',
    badgeText: 'text-[#3f465c]',
    hexColor: '#565e74',
  },
  'Transport': {
    name: 'Transport',
    iconName: 'directions_car',
    lucideIcon: 'Car',
    bgClass: 'bg-[#d3e4fe] text-[#0b1c30]',
    textClass: 'text-[#0b1c30]',
    badgeBg: 'bg-[#e2eeff]',
    badgeText: 'text-[#0b1c30]',
    hexColor: '#3b82f6',
  },
  'Entertainment': {
    name: 'Entertainment',
    iconName: 'movie',
    lucideIcon: 'Film',
    bgClass: 'bg-[#ffdad6] text-[#ba1a1a]',
    textClass: 'text-[#ba1a1a]',
    badgeBg: 'bg-[#ffebee]',
    badgeText: 'text-[#ba1a1a]',
    hexColor: '#ef4444',
  },
  'Shopping': {
    name: 'Shopping',
    iconName: 'storefront',
    lucideIcon: 'ShoppingBag',
    bgClass: 'bg-[#fef3c7] text-[#92400e]',
    textClass: 'text-[#92400e]',
    badgeBg: 'bg-[#fffbeb]',
    badgeText: 'text-[#92400e]',
    hexColor: '#f59e0b',
  },
  'Bills & Utilities': {
    name: 'Bills & Utilities',
    iconName: 'receipt_long',
    lucideIcon: 'Receipt',
    bgClass: 'bg-[#e0e7ff] text-[#3730a3]',
    textClass: 'text-[#3730a3]',
    badgeBg: 'bg-[#eef2ff]',
    badgeText: 'text-[#3730a3]',
    hexColor: '#6366f1',
  },
  'Healthcare': {
    name: 'Healthcare',
    iconName: 'favorite',
    lucideIcon: 'HeartPulse',
    bgClass: 'bg-[#fce7f3] text-[#9d174d]',
    textClass: 'text-[#9d174d]',
    badgeBg: 'bg-[#fdf2f8]',
    badgeText: 'text-[#9d174d]',
    hexColor: '#ec4899',
  },
  'Income': {
    name: 'Income',
    iconName: 'arrow_downward',
    lucideIcon: 'ArrowDownLeft',
    bgClass: 'bg-[#6ffbbe] text-[#002113]',
    textClass: 'text-[#006947]',
    badgeBg: 'bg-[#d1fae5]',
    badgeText: 'text-[#065f46]',
    hexColor: '#10b981',
  },
  'Transfer': {
    name: 'Transfer',
    iconName: 'swap_horiz',
    lucideIcon: 'ArrowLeftRight',
    bgClass: 'bg-[#e5eeff] text-[#006a64]',
    textClass: 'text-[#006a64]',
    badgeBg: 'bg-[#e5eeff]',
    badgeText: 'text-[#006a64]',
    hexColor: '#006a64',
  },
  'Other': {
    name: 'Other',
    iconName: 'more_horiz',
    lucideIcon: 'MoreHorizontal',
    bgClass: 'bg-[#f1f5f9] text-[#475569]',
    textClass: 'text-[#475569]',
    badgeBg: 'bg-[#f8fafc]',
    badgeText: 'text-[#475569]',
    hexColor: '#64748b',
  },
};

export type ActiveTab = 'dashboard' | 'expenses' | 'analytics' | 'budget';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'budget' | 'alert' | 'system';
}
