import React from 'react';
import { 
  Lock, 
  Unlock, 
  Clock, 
  ArrowUpRight, 
  HelpCircle,
  TrendingUp
} from 'lucide-react';
import { useWalletStore } from '../store/walletStore';
import { formatRupees } from '../utils/affordabilityService';

export const WalletCard: React.FC = () => {
  const wallet = useWalletStore(s => s.wallet);
  const setScreen = useWalletStore(s => s.setScreen);

  const total = wallet.total || 1;
  const freePct = Math.round((wallet.free / total) * 100);
  const plannedPct = Math.round((wallet.planned / total) * 100);
  const lockedPct = Math.round((wallet.locked / total) * 100);

  return (
    <div className="w-full max-w-md glass-panel p-6 rounded-3xl border border-white/90 shadow-glass relative overflow-hidden group">
      {/* Decorative Pastel Gradient Corner Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-500/10 via-emerald-500/10 to-transparent pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-mono tracking-widest text-slate-500 uppercase font-bold">
          YOUR WALLET
        </span>
        <button
          onClick={() => setScreen('wallet')}
          className="flex items-center gap-1 text-[11px] font-mono text-indigo-600 hover:text-indigo-800 font-bold transition-colors"
        >
          <span>Resource Breakdown</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Major Game Statistic Number */}
      <div className="mb-4">
        <div className="text-4xl md:text-5xl font-black font-mono tracking-tight text-slate-950 flex items-baseline gap-2">
          <span>{formatRupees(wallet.total)}</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-slate-500 font-medium">Total World Capacity</span>
          <span className="w-1 h-1 rounded-full bg-slate-300" />
          <span className="text-xs text-emerald-600 font-mono font-bold flex items-center gap-0.5">
            <TrendingUp className="w-3.5 h-3.5" /> +14.2% vs last month
          </span>
        </div>
      </div>

      {/* Segmented Financial Bar */}
      <div className="mb-5">
        <div className="w-full h-3 bg-slate-100 rounded-full p-0.5 border border-slate-200/80 flex gap-1 overflow-hidden shadow-inner">
          {/* Free Segment */}
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${freePct}%` }}
            title={`Free: ${formatRupees(wallet.free)}`}
          />
          {/* Planned Segment */}
          <div
            className="h-full bg-amber-400 rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${plannedPct}%` }}
            title={`Planned: ${formatRupees(wallet.planned)}`}
          />
          {/* Locked Segment */}
          <div
            className="h-full bg-rose-500 rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${lockedPct}%` }}
            title={`Locked: ${formatRupees(wallet.locked)}`}
          />
        </div>
      </div>

      {/* Segmented Cards */}
      <div className="grid grid-cols-3 gap-2.5">
        {/* FREE */}
        <div className="p-3 rounded-2xl border border-emerald-200 bg-emerald-50/70 shadow-sm">
          <div className="flex items-center gap-1.5 text-emerald-700 text-[10px] font-mono font-bold uppercase mb-1">
            <Unlock className="w-3 h-3 text-emerald-600" />
            FREE
          </div>
          <div className="text-sm md:text-base font-black font-mono text-emerald-800">
            {formatRupees(wallet.free)}
          </div>
          <div className="text-[10px] text-emerald-700/80 mt-1 leading-tight font-medium">
            Deployable now
          </div>
        </div>

        {/* PLANNED */}
        <div className="p-3 rounded-2xl border border-amber-200 bg-amber-50/70 shadow-sm">
          <div className="flex items-center gap-1.5 text-amber-700 text-[10px] font-mono font-bold uppercase mb-1">
            <Clock className="w-3 h-3 text-amber-600" />
            PLANNED
          </div>
          <div className="text-sm md:text-base font-black font-mono text-amber-800">
            {formatRupees(wallet.planned)}
          </div>
          <div className="text-[10px] text-amber-700/80 mt-1 leading-tight font-medium">
            Upcoming goals
          </div>
        </div>

        {/* LOCKED */}
        <div className="p-3 rounded-2xl border border-rose-200 bg-rose-50/70 shadow-sm">
          <div className="flex items-center gap-1.5 text-rose-700 text-[10px] font-mono font-bold uppercase mb-1">
            <Lock className="w-3 h-3 text-rose-600" />
            LOCKED
          </div>
          <div className="text-sm md:text-base font-black font-mono text-rose-800">
            {formatRupees(wallet.locked)}
          </div>
          <div className="text-[10px] text-rose-700/80 mt-1 leading-tight font-medium">
            Committed rent & EMI
          </div>
        </div>
      </div>

      {/* Action footer */}
      <div className="mt-4 pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs">
        <span className="text-slate-500 text-[11px] flex items-center gap-1.5 font-medium">
          <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
          Protected: {formatRupees(wallet.planned + wallet.locked)}
        </span>
        <button
          onClick={() => setScreen('shop')}
          className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-[11px] font-bold shadow-glow-indigo transition-all cursor-pointer"
        >
          Explore Showroom →
        </button>
      </div>
    </div>
  );
};
