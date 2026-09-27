import React from 'react';
import { useWalletStore } from '../store/walletStore';
import { formatRupees } from '../utils/affordabilityService';
import { 
  ShieldAlert, 
  CreditCard, 
  Home, 
  Laptop, 
  Tv, 
  Sparkles
} from 'lucide-react';

export const Wallet: React.FC = () => {
  const wallet = useWalletStore(s => s.wallet);
  const deductions = useWalletStore(s => s.deductions);
  const addSimulatedFunds = useWalletStore(s => s.addSimulatedFunds);

  const getDeductionIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'housing':
        return Home;
      case 'credit':
        return CreditCard;
      case 'tech emi':
        return Laptop;
      default:
        return Tv;
    }
  };

  return (
    <div className="absolute inset-0 z-10 pointer-events-none p-4 md:p-8 flex flex-col justify-between pt-24 pb-20 md:pb-8 overflow-y-auto">
      {/* Top Left: Financial World Allocation HUD */}
      <div className="pointer-events-auto max-w-md">
        <div className="glass-panel p-6 rounded-3xl border border-white/90 shadow-glass">
          <span className="text-[10px] font-mono tracking-widest text-indigo-600 uppercase font-bold block mb-1">
            Spatial Resource Allocation
          </span>
          <h2 className="text-3xl font-black font-mono text-slate-950 mb-4">
            {formatRupees(wallet.total)}
          </h2>

          <div className="space-y-2.5">
            {/* Free */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-glow-mint" />
                <div>
                  <span className="text-xs font-bold text-emerald-900 block">
                    FREE CAPITAL
                  </span>
                  <span className="text-[10px] text-emerald-700/80 font-medium">
                    Immediately deployable for acquisitions
                  </span>
                </div>
              </div>
              <span className="text-base font-black font-mono text-emerald-800">
                {formatRupees(wallet.free)}
              </span>
            </div>

            {/* Planned */}
            <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full bg-amber-500 shadow-glow-gold" />
                <div>
                  <span className="text-xs font-bold text-amber-900 block">
                    PLANNED ACCUMULATION
                  </span>
                  <span className="text-[10px] text-amber-700/80 font-medium">
                    Allocated toward active savings targets
                  </span>
                </div>
              </div>
              <span className="text-base font-black font-mono text-amber-800">
                {formatRupees(wallet.planned)}
              </span>
            </div>

            {/* Locked */}
            <div className="p-3.5 rounded-2xl bg-rose-50/80 border border-rose-200 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full bg-rose-500 shadow-glow-coral" />
                <div>
                  <span className="text-xs font-bold text-rose-900 block">
                    LOCKED OBLIGATIONS
                  </span>
                  <span className="text-[10px] text-rose-700/80 font-medium">
                    Protected for essential real-world commitments
                  </span>
                </div>
              </div>
              <span className="text-base font-black font-mono text-rose-800">
                {formatRupees(wallet.locked)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right / Bottom: Why is my money locked? */}
      <div className="pointer-events-auto max-w-lg w-full self-end mt-4">
        <div className="glass-panel p-6 rounded-3xl border border-white/90 shadow-glass">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900">
                Why is ₹14,420 Locked?
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-500 font-bold">
              4 Upcoming Auto-Debits
            </span>
          </div>

          <p className="text-xs text-slate-600 mb-4 leading-relaxed font-medium">
            Wallet World isolates recurring liabilities to guarantee your virtual ownership remains financially sustainable.
          </p>

          <div className="space-y-2 mb-5">
            {deductions.map((d) => {
              const Icon = getDeductionIcon(d.category);

              return (
                <div
                  key={d.id}
                  className="p-3 rounded-2xl bg-white border border-slate-100 flex items-center justify-between gap-3 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-slate-100 text-slate-600">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{d.name}</h4>
                      <span className="text-[10px] font-mono text-slate-500 font-medium">
                        {d.dueDate} • Auto-Debit
                      </span>
                    </div>
                  </div>
                  <div className="text-xs font-mono font-black text-rose-600">
                    -{formatRupees(d.amount)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Payday Simulation Inflow */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Simulate Bonus:
            </span>
            <div className="flex gap-1.5">
              {[15000, 50000, 100000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => addSimulatedFunds(amt)}
                  className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-[10px] font-mono font-bold transition-all active:scale-95 shadow-sm"
                >
                  +{formatRupees(amt, true)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
