import React from 'react';
import { 
  Lock, 
  Unlock, 
  Clock, 
  ArrowUpRight, 
  TrendingUp 
} from 'lucide-react';
import { useWalletStore } from '../store/walletStore';
import { formatRupees } from '../utils/affordabilityService';

export const WalletCard: React.FC = () => {
  const wallet = useWalletStore((s) => s.wallet);
  const setScreen = useWalletStore((s) => s.setScreen);

  const total = wallet.total || 1;
  const freePct = Math.round((wallet.free / total) * 100);
  const plannedPct = Math.round((wallet.planned / total) * 100);
  const lockedPct = Math.round((wallet.locked / total) * 100);

  return (
    <div className="w-full max-w-[340px] bg-white/60 hover:bg-white/75 backdrop-blur-xl p-4 rounded-2xl border border-white/80 shadow-glass transition-all duration-300 pointer-events-auto">
      {/* Header: Label & Breakdown link */}
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase font-bold">
          TOTAL WORLD CAPACITY
        </span>
        <button
          onClick={() => setScreen('wallet')}
          className="flex items-center gap-0.5 text-[10px] font-mono text-indigo-600 hover:text-indigo-800 font-bold transition-colors cursor-pointer"
          title="View full financial telemetry"
        >
          <span>Breakdown</span>
          <ArrowUpRight className="w-3 h-3" />
        </button>
      </div>

      {/* Main Balance Display */}
      <div className="flex items-baseline justify-between mb-2.5">
        <div className="text-2xl md:text-3xl font-black font-mono tracking-tight text-slate-950">
          {formatRupees(wallet.total)}
        </div>
        <span className="text-[11px] text-emerald-600 font-mono font-bold flex items-center gap-0.5">
          <TrendingUp className="w-3 h-3" /> +14.2%
        </span>
      </div>

      {/* Thin Micro Segmented Bar */}
      <div className="w-full h-1.5 bg-slate-200/70 rounded-full flex gap-0.5 overflow-hidden mb-3">
        <div
          className="h-full bg-emerald-500 transition-all duration-500 rounded-full"
          style={{ width: `${freePct}%` }}
          title={`Free: ${formatRupees(wallet.free)}`}
        />
        <div
          className="h-full bg-amber-400 transition-all duration-500 rounded-full"
          style={{ width: `${plannedPct}%` }}
          title={`Planned: ${formatRupees(wallet.planned)}`}
        />
        <div
          className="h-full bg-rose-500 transition-all duration-500 rounded-full"
          style={{ width: `${lockedPct}%` }}
          title={`Locked: ${formatRupees(wallet.locked)}`}
        />
      </div>

      {/* Compact 3-Pill Status Grid */}
      <div className="grid grid-cols-3 gap-1.5">
        {/* FREE */}
        <div className="px-2 py-1.5 rounded-xl bg-emerald-50/80 border border-emerald-200/80 text-center">
          <div className="flex items-center justify-center gap-1 text-[9px] font-mono font-bold text-emerald-700 uppercase">
            <Unlock className="w-2.5 h-2.5 text-emerald-600" />
            <span>FREE</span>
          </div>
          <div className="text-xs font-black font-mono text-emerald-900 mt-0.5">
            {formatRupees(wallet.free)}
          </div>
        </div>

        {/* PLANNED */}
        <div className="px-2 py-1.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-center">
          <div className="flex items-center justify-center gap-1 text-[9px] font-mono font-bold text-amber-700 uppercase">
            <Clock className="w-2.5 h-2.5 text-amber-600" />
            <span>PLANNED</span>
          </div>
          <div className="text-xs font-black font-mono text-amber-900 mt-0.5">
            {formatRupees(wallet.planned)}
          </div>
        </div>

        {/* LOCKED */}
        <div className="px-2 py-1.5 rounded-xl bg-rose-50/80 border border-rose-200/80 text-center">
          <div className="flex items-center justify-center gap-1 text-[9px] font-mono font-bold text-rose-700 uppercase">
            <Lock className="w-2.5 h-2.5 text-rose-600" />
            <span>LOCKED</span>
          </div>
          <div className="text-xs font-black font-mono text-rose-900 mt-0.5">
            {formatRupees(wallet.locked)}
          </div>
        </div>
      </div>
    </div>
  );
};
