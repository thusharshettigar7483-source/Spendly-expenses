import React, { useState } from 'react';
import { CURRENCIES } from '../types/finance';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  onUpdateUserName: (name: string) => void;
  currencyCode: string;
  onUpdateCurrency: (code: string) => void;
  onResetDemoData: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  userName,
  onUpdateUserName,
  currencyCode,
  onUpdateCurrency,
  onResetDemoData,
}) => {
  const [nameInput, setNameInput] = useState(userName);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      onUpdateUserName(nameInput.trim());
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl z-10 flex flex-col gap-4 animate-scaleUp">
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-bold text-[#0b1c30]">Profile & Account</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#3d4947] hover:bg-[#eff4ff] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="flex flex-col items-center gap-2 py-2">
          <img
            alt="Profile Avatar"
            className="w-18 h-18 rounded-full object-cover ring-4 ring-[#89f5e7] shadow-md"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBofvEE3jrNt9IFyntNDDKMmTvpS806SBLETOUArt5iGg5TWNe0-T2JWp5NzDxTI5fkSVx68bwyTOrWSutamw_4k343K5uTSGRx6GLXsguw1-4gtUX0Jvn8EDUwoxOCKQbQY_rebH-9JgjQsAbZqQhzBSWmdHaHAybj9mXjN1zBzfaj8ZSkern97LTit7AZGzeuQFDRikxi81TIjnRhZwJrJ12HoeRtTx6kJMSyf9uyOpsM3lf000IR"
          />
          <span className="text-[16px] font-bold text-[#0b1c30]">{userName}</span>
          <span className="text-[12px] text-[#3d4947] font-medium">Personal Finance OS</span>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-[#3d4947] uppercase">Display Name</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="flex-1 h-10 px-3 rounded-xl bg-[#f8f9ff] border border-[#e5eeff] text-[14px] text-[#0b1c30] focus:outline-none focus:border-[#00685f]"
              />
              <button
                type="submit"
                className="px-3.5 h-10 bg-[#00685f] hover:bg-[#005049] text-white text-[12px] font-bold rounded-xl cursor-pointer"
              >
                Save
              </button>
            </div>
            {isSaved && (
              <span className="text-[11px] text-[#00685f] font-bold">Name updated!</span>
            )}
          </div>

          <div className="flex flex-col gap-1 pt-1">
            <label className="text-[11px] font-bold text-[#3d4947] uppercase">Currency</label>
            <select
              value={currencyCode}
              onChange={(e) => onUpdateCurrency(e.target.value)}
              className="h-10 px-3 rounded-xl bg-[#f8f9ff] border border-[#e5eeff] text-[13px] font-semibold text-[#0b1c30] focus:outline-none focus:border-[#00685f] cursor-pointer"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </form>

        <div className="border-t border-[#e5eeff] pt-3 flex flex-col gap-2">
          <button
            onClick={() => {
              onResetDemoData();
              onClose();
            }}
            className="w-full h-10 rounded-xl bg-[#eff4ff] hover:bg-[#dce9ff] text-[#00685f] text-[12px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">restart_alt</span>
            Reset to Sarah's Demo Data
          </button>
        </div>
      </div>
    </div>
  );
};
