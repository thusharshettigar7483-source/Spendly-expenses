import React, { useState } from 'react';
import { Transaction } from '../types/finance';
import { getCurrencySymbol } from '../utils/storage';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tx: Omit<Transaction, 'id'>) => void;
  currencyCode: string;
}

export const TransferModal: React.FC<TransferModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currencyCode,
}) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [note, setNote] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (!title.trim()) {
      setErrorMsg('Please specify transfer or deposit description.');
      return;
    }
    if (isNaN(num) || num <= 0) {
      setErrorMsg('Please specify a valid transfer amount.');
      return;
    }

    onSave({
      title: title.trim(),
      amount: num,
      type,
      category: type === 'income' ? 'Income' : 'Transfer',
      date: new Date().toISOString(),
      note: note.trim() || undefined,
      paymentMethod: 'Bank Transfer',
    });

    onClose();
  };

  const currencySymbol = getCurrencySymbol(currencyCode);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl z-10 flex flex-col gap-4 animate-scaleUp">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#eff4ff] text-[#00685f] flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">swap_horiz</span>
            </div>
            <h2 className="text-[18px] font-bold text-[#0b1c30]">Transfer / Deposit</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#3d4947] hover:bg-[#eff4ff] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {errorMsg && (
          <div className="p-2.5 rounded-xl bg-[#ffdad6] text-[#ba1a1a] text-[12px] font-semibold flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">error</span>
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          {/* Inflow vs Outflow toggle */}
          <div className="flex bg-[#eff4ff] p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex-1 py-1.5 text-[12px] font-bold rounded-lg transition-all cursor-pointer ${
                type === 'income' ? 'bg-white text-[#006947] shadow-sm' : 'text-[#3d4947]'
              }`}
            >
              Deposit / Inflow (+)
            </button>
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex-1 py-1.5 text-[12px] font-bold rounded-lg transition-all cursor-pointer ${
                type === 'expense' ? 'bg-white text-[#ba1a1a] shadow-sm' : 'text-[#3d4947]'
              }`}
            >
              Transfer Out (-)
            </button>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-[#3d4947] uppercase">Amount</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[20px] font-bold text-[#00685f]">
                {currencySymbol}
              </span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                autoFocus
                className="w-full h-12 pl-10 pr-3 rounded-xl bg-[#f8f9ff] border border-[#e5eeff] text-[20px] font-extrabold text-[#0b1c30] font-mono tabular-nums focus:outline-none focus:border-[#00685f]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-[#3d4947] uppercase">Description</label>
            <input
              type="text"
              placeholder="e.g. Savings transfer, bonus, freelance"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl bg-[#f8f9ff] border border-[#e5eeff] text-[14px] text-[#0b1c30] focus:outline-none focus:border-[#00685f]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-[#3d4947] uppercase">Note (Optional)</label>
            <input
              type="text"
              placeholder="Additional memo"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full h-10 px-3.5 rounded-xl bg-[#f8f9ff] border border-[#e5eeff] text-[13px] text-[#0b1c30] focus:outline-none focus:border-[#00685f]"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[13px] font-semibold text-[#3d4947] hover:bg-[#eff4ff] rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-[13px] font-bold bg-[#00685f] hover:bg-[#005049] text-white rounded-xl shadow-md cursor-pointer"
            >
              Record Transfer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
