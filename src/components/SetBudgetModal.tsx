import React, { useState } from 'react';
import { getCurrencySymbol } from '../utils/storage';

interface SetBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  monthlyBudget: number;
  currencyCode: string;
  onSaveBudget: (budget: number) => void;
}

export const SetBudgetModal: React.FC<SetBudgetModalProps> = ({
  isOpen,
  onClose,
  monthlyBudget,
  currencyCode,
  onSaveBudget,
}) => {
  const [val, setVal] = useState(monthlyBudget.toString());

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      onSaveBudget(num);
      onClose();
    }
  };

  const currencySymbol = getCurrencySymbol(currencyCode);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl z-10 flex flex-col gap-4 animate-scaleUp">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#eff4ff] text-[#00685f] flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">tune</span>
            </div>
            <h2 className="text-[18px] font-bold text-[#0b1c30]">Set Monthly Budget</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#3d4947] hover:bg-[#eff4ff] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <p className="text-[13px] text-[#3d4947]">
            Specify your total target spending limit for the month.
          </p>

          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[22px] font-bold text-[#00685f]">
              {currencySymbol}
            </span>
            <input
              type="number"
              step="50"
              min="100"
              value={val}
              onChange={(e) => setVal(e.target.value)}
              autoFocus
              className="w-full h-14 pl-10 pr-4 rounded-xl bg-[#f8f9ff] border border-[#e5eeff] text-[22px] font-extrabold text-[#0b1c30] font-mono tabular-nums focus:outline-none focus:border-[#00685f]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {[2500, 3500, 4000, 5000].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setVal(preset.toString())}
                className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#eff4ff] hover:bg-[#dce9ff] text-[#00685f] cursor-pointer shrink-0"
              >
                {currencySymbol}
                {preset.toLocaleString()}
              </button>
            ))}
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
              Save Budget
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
