import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, PackageCheck, Sparkles, X } from 'lucide-react';
import { useWalletStore } from '../store/walletStore';
import { formatRupees } from '../utils/affordabilityService';

export const PurchaseSuccess: React.FC = () => {
  const item = useWalletStore((s) => s.purchaseCelebrationItem);
  const close = useWalletStore((s) => s.closePurchaseCelebration);
  const setScreen = useWalletStore((s) => s.setScreen);
  const wallet = useWalletStore((s) => s.wallet);

  useEffect(() => {
    if (item) {
      // Fire victory cyber confetti in bright vibrant hues
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.7, x: 0.5 },
        colors: ['#10B981', '#6366F1', '#EC4899', '#0EA5E9', '#F59E0B'],
      });
    }
  }, [item]);

  if (!item) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto w-[92vw] max-w-lg glass-panel p-5 rounded-3xl border border-emerald-300 shadow-2xl animate-in slide-in-from-bottom-8 duration-300">
      <div className="flex items-start gap-4">
        {/* Victory Glow Icon */}
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-[1.5px] shadow-glow-mint flex-shrink-0 animate-bounce">
          <div className="w-full h-full rounded-[14px] bg-white flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold tracking-widest text-emerald-700 uppercase">
            <Sparkles className="w-3 h-3 text-amber-500 fill-current" />
            <span>UNLOCKED & ADDED TO YOUR WORLD</span>
          </div>

          <h3 className="text-base md:text-lg font-black text-slate-900 truncate mt-0.5">
            {item.name}
          </h3>

          <p className="text-xs text-slate-600 mt-0.5 font-medium">
            Acquired for {formatRupees(item.price)}. Free Power: {formatRupees(wallet.free)} remaining.
          </p>

          <div className="flex items-center gap-3 mt-3 pt-2.5 border-t border-slate-200/80">
            <button
              onClick={() => {
                close();
                setScreen('avatar');
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-bold flex items-center gap-1.5 shadow-glow-mint transition-all active:scale-95 cursor-pointer"
            >
              <PackageCheck className="w-3.5 h-3.5" />
              <span>VIEW IN MY STUFF</span>
            </button>

            <button
              onClick={close}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-xs font-bold transition-all cursor-pointer"
            >
              Keep Exploring
            </button>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={close}
          className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
