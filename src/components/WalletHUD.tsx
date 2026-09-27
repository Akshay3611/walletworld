import React from 'react';
import { 
  Volume2, 
  VolumeX, 
  PlusCircle, 
  Flame, 
  ShieldCheck, 
  RotateCcw
} from 'lucide-react';
import { useWalletStore } from '../store/walletStore';
import { formatRupees } from '../utils/affordabilityService';

export const WalletHUD: React.FC = () => {
  const user = useWalletStore(s => s.user);
  const wallet = useWalletStore(s => s.wallet);
  const soundEnabled = useWalletStore(s => s.soundEnabled);
  const toggleSound = useWalletStore(s => s.toggleSound);
  const addSimulatedFunds = useWalletStore(s => s.addSimulatedFunds);
  const resetSimulation = useWalletStore(s => s.resetSimulation);

  return (
    <header className="fixed top-3 left-4 right-4 md:left-24 md:right-6 z-30 pointer-events-none flex items-center justify-between gap-4">
      {/* User Greeting & Tagline */}
      <div className="glass-panel px-3.5 py-2 rounded-2xl border border-white/80 pointer-events-auto flex items-center gap-3 shadow-glass">
        <div className="relative">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 via-cyan-400 to-emerald-400 p-[1.5px] shadow-sm">
            <div className="w-full h-full rounded-[9px] bg-white flex items-center justify-center font-bold text-indigo-600 text-xs">
              AK
            </div>
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xs md:text-sm font-bold text-slate-900 tracking-tight">
              Hey, {user.name} 👋
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" />
              LVL {user.level} BUILDER
            </span>
          </div>
          <p className="text-[10px] text-slate-500 hidden sm:block">
            Turn your money into a bigger world.
          </p>
        </div>
      </div>

      {/* Financial Game Stats & Actions */}
      <div className="flex items-center gap-2 pointer-events-auto self-end md:self-auto">
        {/* Streak Counter */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-2xl glass-panel border border-amber-200 bg-amber-50/80 text-xs font-mono shadow-sm">
          <Flame className="w-4 h-4 text-amber-500" />
          <span className="text-amber-800 font-bold">{user.savingsStreakWeeks} WEEKS STREAK</span>
        </div>

        {/* Available to Play Pill */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-2xl glass-panel border border-emerald-300 bg-emerald-50/80 text-xs font-mono shadow-sm">
          <span className="text-emerald-700 uppercase font-bold text-[10px]">Free Power:</span>
          <span className="text-emerald-800 font-extrabold text-sm">
            {formatRupees(wallet.free)}
          </span>
        </div>

        {/* Add Simulation Cash Button */}
        <button
          onClick={() => addSimulatedFunds(25000)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-mono font-bold transition-all shadow-glow-indigo active:scale-95 cursor-pointer"
          title="Simulate receiving salary or bonus funds"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">+₹25k Payday</span>
          <span className="sm:hidden">+₹25k</span>
        </button>

        {/* Reset Simulation */}
        <button
          onClick={resetSimulation}
          className="p-2 rounded-2xl glass-panel border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-white transition-all active:scale-95 shadow-sm"
          title="Reset to default mock financial profile"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Sound Toggle */}
        <button
          onClick={toggleSound}
          className="p-2 rounded-2xl glass-panel border border-slate-200 text-slate-600 hover:text-indigo-600 hover:bg-white transition-all active:scale-95 shadow-sm"
          title={soundEnabled ? 'Mute SFX' : 'Enable SFX'}
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-emerald-600" />
          ) : (
            <VolumeX className="w-4 h-4 text-slate-400" />
          )}
        </button>
      </div>
    </header>
  );
};
