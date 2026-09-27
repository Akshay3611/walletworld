import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, PackageCheck, Sparkles } from 'lucide-react';
import { useWalletStore } from '../store/walletStore';
import { formatRupees } from '../utils/affordabilityService';

export const PurchaseSuccess: React.FC = () => {
  const item = useWalletStore(s => s.purchaseCelebrationItem);
  const close = useWalletStore(s => s.closePurchaseCelebration);
  const setScreen = useWalletStore(s => s.setScreen);
  const wallet = useWalletStore(s => s.wallet);

  useEffect(() => {
    if (item) {
      // Fire victory cyber confetti in bright vibrant hues
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#10B981', '#6366F1', '#EC4899', '#0EA5E9', '#F59E0B'],
      });
    }
  }, [item]);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-2xl animate-in zoom-in-95 duration-300">
      <div 
        className="w-full max-w-md glass-panel p-8 rounded-3xl border border-white/90 shadow-2xl flex flex-col items-center text-center relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Soft Pastel Gradient Aura */}
        <div className="absolute -top-20 w-52 h-52 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />

        {/* Large Victory Check Badge */}
        <div className="relative mb-4">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-[2px] shadow-glow-mint animate-bounce">
            <div className="w-full h-full rounded-[22px] bg-white flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-emerald-500 text-white shadow-sm">
            <Sparkles className="w-4 h-4 fill-current" />
          </div>
        </div>

        {/* Status */}
        <span className="text-xs font-mono font-bold tracking-widest text-emerald-700 uppercase mb-1">
          ✓ OBJECT ACQUIRED • WORLD EXPANDED
        </span>

        <h2 className="text-2xl font-black text-slate-900 mb-2">
          {item.name}
        </h2>

        <p className="text-sm text-slate-600 mb-6 leading-relaxed font-medium">
          Has officially unlocked into your virtual world and persistent personal inventory.
        </p>

        {/* Post-Purchase Telemetry */}
        <div className="w-full p-4 rounded-3xl bg-slate-50 border border-slate-200 mb-6 text-xs font-mono space-y-2">
          <div className="flex items-center justify-between text-slate-600 font-medium">
            <span>Acquisition Cost:</span>
            <span className="text-slate-900 font-bold">{formatRupees(item.price)}</span>
          </div>
          <div className="flex items-center justify-between text-slate-600 font-medium">
            <span>Remaining Free Wallet:</span>
            <span className="text-emerald-700 font-black">{formatRupees(wallet.free)}</span>
          </div>
          <div className="flex items-center justify-between text-slate-600 font-medium">
            <span>New World Net Worth:</span>
            <span className="text-indigo-600 font-black">₹2.4L + Real Assets</span>
          </div>
        </div>

        {/* Actions */}
        <div className="w-full flex flex-col gap-2.5">
          <button
            onClick={() => {
              close();
              setScreen('avatar');
            }}
            className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-glow-mint transition-all active:scale-95 cursor-pointer"
          >
            <PackageCheck className="w-4 h-4" />
            <span>VIEW IN MY STUFF & AVATAR</span>
          </button>

          <button
            onClick={close}
            className="w-full py-2.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-xs font-bold transition-all"
          >
            Return to Showroom
          </button>
        </div>
      </div>
    </div>
  );
};
