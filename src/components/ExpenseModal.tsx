import React, { useState, useEffect } from 'react';
import {
  Transaction,
  ExpenseCategory,
  PaymentMethod,
  CATEGORY_DEFINITIONS,
} from '../types/finance';
import { getCurrencySymbol } from '../utils/storage';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (txData: {
    id?: string;
    title: string;
    amount: number;
    type: 'expense' | 'income';
    category: ExpenseCategory;
    date: string;
    note?: string;
    paymentMethod: PaymentMethod;
  }) => void;
  initialData?: Transaction | null;
  currencyCode: string;
}

const PAYMENT_METHODS: PaymentMethod[] = [
  'Credit Card',
  'Debit Card',
  'Apple Pay',
  'Cash',
  'Bank Transfer',
];

export const ExpenseModal: React.FC<ExpenseModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  currencyCode,
}) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [category, setCategory] = useState<ExpenseCategory>('Food & Dining');
  const [date, setDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Credit Card');
  const [note, setNote] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Reset or populate fields when modal opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTitle(initialData.title);
        setAmount(initialData.amount.toString());
        setType(initialData.type);
        setCategory(initialData.category);
        setDate(initialData.date ? initialData.date.slice(0, 16) : new Date().toISOString().slice(0, 16));
        setPaymentMethod(initialData.paymentMethod);
        setNote(initialData.note || '');
      } else {
        // Defaults for new transaction
        setTitle('');
        setAmount('');
        setType('expense');
        setCategory('Food & Dining');
        const now = new Date();
        // Local ISO slice for datetime-local
        const localOffset = now.getTimezoneOffset() * 60000;
        const localISOTime = new Date(now.getTime() - localOffset).toISOString().slice(0, 16);
        setDate(localISOTime);
        setPaymentMethod('Credit Card');
        setNote('');
      }
      setErrorMsg('');
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!title.trim()) {
      setErrorMsg('Please enter a merchant or transaction title.');
      return;
    }
    if (isNaN(numAmount) || numAmount <= 0) {
      setErrorMsg('Please enter a valid positive amount.');
      return;
    }

    const isoDate = date ? new Date(date).toISOString() : new Date().toISOString();

    onSave({
      id: initialData?.id,
      title: title.trim(),
      amount: numAmount,
      type,
      category,
      date: isoDate,
      note: note.trim() || undefined,
      paymentMethod,
    });

    onClose();
  };

  const currencySymbol = getCurrencySymbol(currencyCode);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs transition-opacity animate-fadeIn">
      {/* Click outside backdrop to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Slide-up Container */}
      <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-2xl z-10 overflow-hidden animate-slideUp">
        {/* Drag handle affordance */}
        <div className="w-full pt-3 pb-1 flex justify-center sm:hidden">
          <div className="w-10 h-1.5 rounded-full bg-[#3d4947]/20" />
        </div>

        {/* Modal Header */}
        <div className="px-6 py-3.5 border-b border-[#e5eeff] flex items-center justify-between">
          <h2 className="text-[18px] font-extrabold text-[#0b1c30]">
            {initialData ? 'Edit Transaction' : 'Record Transaction'}
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#3d4947] hover:bg-[#eff4ff] active:scale-95 transition-all cursor-pointer"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto no-scrollbar flex flex-col gap-4">
          {/* Validation Banner */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-[#ffdad6] text-[#ba1a1a] text-[13px] font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Type Segment Switch: Expense vs Income */}
          <div className="flex bg-[#eff4ff] p-1 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setType('expense');
                if (category === 'Income') setCategory('Food & Dining');
              }}
              className={`flex-1 py-2 text-[13px] font-bold rounded-lg transition-all cursor-pointer ${
                type === 'expense'
                  ? 'bg-white text-[#ba1a1a] shadow-sm'
                  : 'text-[#3d4947] hover:text-[#0b1c30]'
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => {
                setType('income');
                setCategory('Income');
              }}
              className={`flex-1 py-2 text-[13px] font-bold rounded-lg transition-all cursor-pointer ${
                type === 'income'
                  ? 'bg-white text-[#006947] shadow-sm'
                  : 'text-[#3d4947] hover:text-[#0b1c30]'
              }`}
            >
              Income / Inflow
            </button>
          </div>

          {/* Amount Input with big typography */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold text-[#3d4947] uppercase tracking-wide">
              Amount ({currencyCode})
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[26px] font-bold text-[#00685f]">
                {currencySymbol}
              </span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                autoFocus={!initialData}
                className="w-full h-15 pl-12 pr-4 rounded-2xl bg-[#f8f9ff] border border-[#e5eeff] text-[28px] font-extrabold text-[#0b1c30] font-mono tabular-nums focus:outline-none focus:border-[#00685f] focus:ring-2 focus:ring-[#00685f]/15 transition-all"
              />
            </div>
          </div>

          {/* Title / Merchant Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold text-[#3d4947] uppercase tracking-wide">
              Merchant or Description
            </label>
            <input
              type="text"
              placeholder="e.g. Starbucks, Grocery Store, Salary"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-12 px-4 rounded-xl bg-[#f8f9ff] border border-[#e5eeff] text-[15px] font-medium text-[#0b1c30] placeholder-[#3d4947]/50 focus:outline-none focus:border-[#00685f] transition-all"
            />
          </div>

          {/* Category Selection Grid */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold text-[#3d4947] uppercase tracking-wide">
              Category
            </label>
            <div className="grid grid-cols-4 gap-2">
              {Object.entries(CATEGORY_DEFINITIONS)
                .filter(([name]) => (type === 'income' ? name === 'Income' || name === 'Transfer' : name !== 'Income'))
                .map(([catName, info]) => {
                  const isSelected = category === catName;
                  return (
                    <button
                      key={catName}
                      type="button"
                      onClick={() => setCategory(catName as ExpenseCategory)}
                      className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#00685f] bg-[#e6faf2] ring-2 ring-[#00685f]/20 scale-102'
                          : 'border-[#e5eeff] bg-[#f8f9ff] hover:bg-white'
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center mb-1 ${info.bgClass}`}
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {info.iconName}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-[#0b1c30] text-center truncate w-full">
                        {catName}
                      </span>
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold text-[#3d4947] uppercase tracking-wide">
              Payment Method
            </label>
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {PAYMENT_METHODS.map((method) => {
                const isSelected = paymentMethod === method;
                return (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`px-3 py-1.5 rounded-xl text-[12px] font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 border ${
                      isSelected
                        ? 'bg-[#00685f] text-white border-[#00685f]'
                        : 'bg-[#f8f9ff] text-[#3d4947] border-[#e5eeff] hover:bg-white'
                    }`}
                  >
                    {method}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date & Time Picker */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold text-[#3d4947] uppercase tracking-wide">
              Date & Time
            </label>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full h-12 px-4 rounded-xl bg-[#f8f9ff] border border-[#e5eeff] text-[14px] font-semibold text-[#0b1c30] focus:outline-none focus:border-[#00685f] transition-all"
            />
          </div>

          {/* Optional Note */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold text-[#3d4947] uppercase tracking-wide">
              Note (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Lunch with team, monthly subscription"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-[#f8f9ff] border border-[#e5eeff] text-[14px] text-[#0b1c30] placeholder-[#3d4947]/50 focus:outline-none focus:border-[#00685f] transition-all"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full h-13 rounded-xl bg-[#00685f] hover:bg-[#005049] text-white text-[15px] font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-[#00685f]/25 active:scale-98 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">
                {initialData ? 'check' : 'add'}
              </span>
              <span>{initialData ? 'Save Changes' : 'Record Transaction'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
