import React from 'react';
import { 
  X, 
  Lock, 
  CheckCircle2, 
  Calendar, 
  Sparkles, 
  ShoppingBag, 
  ArrowRight,
  TrendingUp,
  Cpu
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useWalletStore } from '../store/walletStore';
import { useWorldStore } from '../store/worldStore';
import { calculateAffordability, formatRupees } from '../utils/affordabilityService';

export const ContextualProductPanel: React.FC = () => {
  const selectedProductId = useWalletStore(s => s.selectedProductId);
  const products = useWalletStore(s => s.products);
  const freeMoney = useWalletStore(s => s.wallet.free);
  const selectProduct = useWalletStore(s => s.selectProduct);
  const buyProduct = useWalletStore(s => s.buyProduct);
  const addSimulatedFunds = useWalletStore(s => s.addSimulatedFunds);
  
  const unlockedRoomItems = useWorldStore(s => s.unlockedRoomItems);
  const unlockRoomItem = useWorldStore(s => s.unlockRoomItem);
  const inspectRoomObject = useWorldStore(s => s.inspectRoomObject);

  const product = products.find(p => p.id === selectedProductId);
  if (!product) return null;

  const isOwned = unlockedRoomItems.includes(product.id);
  const calc = calculateAffordability(product.price, freeMoney);

  const handleClose = () => {
    selectProduct(null);
    inspectRoomObject(null);
  };

  const handleBuy = () => {
    const success = buyProduct(product.id);
    if (success) {
      unlockRoomItem(product);
      // Trigger festive celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6, x: 0.75 },
        colors: ['#10B981', '#34D399', '#6366F1', '#F59E0B'],
      });
    }
  };

  return (
    <aside 
      aria-label="Contextual Product Panel"
      className="fixed right-4 md:right-8 top-20 bottom-24 md:bottom-8 w-96 max-w-[calc(100vw-2rem)] glass-panel rounded-3xl p-6 shadow-2xl border border-white/90 z-40 flex flex-col justify-between overflow-y-auto pointer-events-auto animate-in slide-in-from-right-8 duration-300"
    >
      <div>
        {/* Header with Brand & Close Button */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-indigo-600 font-bold">
              {product.brand} • {product.category}
            </span>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-all active:scale-95 cursor-pointer"
            title="Close inspection (ESC)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status Badge & Product Title */}
        <div className="mb-3">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            {isOwned ? (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1 shadow-sm">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                OWNED IN WORLD
              </span>
            ) : calc.canAffordNow ? (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1 shadow-sm animate-pulse">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                AFFORDABLE NOW
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1">
                <Lock className="w-3 h-3 text-rose-600" />
                LOCKED ({Math.round(calc.progress * 100)}%)
              </span>
            )}

            <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">
              3D Object Target
            </span>
          </div>

          <h2 className="text-xl md:text-2xl font-black text-slate-950 leading-tight">
            {product.name}
          </h2>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* World Acquisition Value Card */}
        <div className="p-4 rounded-2xl bg-white/70 border border-slate-200/90 shadow-sm mb-4">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">
              World Acquisition Value
            </span>
            <span className="text-2xl font-black font-mono text-slate-950">
              {formatRupees(product.price)}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono font-bold">
              <span className="text-slate-500 text-[11px]">
                Available Power: {formatRupees(freeMoney)}
              </span>
              <span className={isOwned || calc.canAffordNow ? 'text-emerald-700' : 'text-amber-600'}>
                {isOwned ? '100%' : `${Math.round(calc.progress * 100)}%`}
              </span>
            </div>

            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isOwned || calc.canAffordNow
                    ? 'bg-emerald-500 shadow-sm'
                    : 'bg-gradient-to-r from-amber-400 to-amber-500'
                }`}
                style={{ width: isOwned ? '100%' : `${Math.min(100, Math.round(calc.progress * 100))}%` }}
              />
            </div>

            {!isOwned && !calc.canAffordNow && (
              <p className="text-[11px] text-rose-600 font-mono mt-2 flex items-center gap-1 font-bold">
                <span>Need:</span>
                <span className="font-black text-slate-900">{formatRupees(calc.remaining)}</span>
                <span>more to unlock into your world.</span>
              </p>
            )}
          </div>
        </div>

        {/* Financial Velocity Projection (if locked) */}
        {!isOwned && !calc.canAffordNow && (
          <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-1.5 mb-4 text-xs font-mono">
            <div className="flex items-center justify-between text-slate-700">
              <span className="flex items-center gap-1 text-slate-500 text-[11px]">
                <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
                Monthly Savings Velocity:
              </span>
              <span className="text-slate-900 font-bold">₹14,300/mo</span>
            </div>
            <div className="flex items-center justify-between text-slate-700">
              <span className="flex items-center gap-1 text-slate-500 text-[11px]">
                <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                Estimated Unlock Time:
              </span>
              <span className="text-indigo-700 font-extrabold">
                ≈ {calc.monthsToUnlock} Months
              </span>
            </div>
          </div>
        )}

        {/* Hardware Specifications */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
            <Cpu className="w-3 h-3 text-slate-400" />
            <span>Specifications</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            {Object.entries(product.specs).map(([key, val]) => (
              <div key={key} className="p-2 rounded-xl bg-white/60 border border-slate-200/70">
                <span className="text-slate-400 block text-[9px] font-bold uppercase">{key}</span>
                <span className="text-slate-900 font-bold truncate block">{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-slate-200/80 flex flex-col gap-2.5">
        {isOwned ? (
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
            <span className="text-xs font-mono font-bold text-emerald-800 flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Active in your Personal Room
            </span>
          </div>
        ) : calc.canAffordNow ? (
          <button
            onClick={handleBuy}
            className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-glow-mint transition-all active:scale-98 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>BUY NOW • {formatRupees(product.price)}</span>
          </button>
        ) : (
          <>
            <button
              onClick={() => addSimulatedFunds(calc.remaining)}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm cursor-pointer"
              title="Inject required funds to test instant purchase"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Simulate Payday (+{formatRupees(calc.remaining)})</span>
            </button>
            <button
              onClick={handleClose}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Set Savings Goal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </>
        )}

        <button
          onClick={handleClose}
          className="text-center text-[11px] font-mono text-slate-500 hover:text-slate-800 transition-colors py-1"
        >
          [ Return to Room View ]
        </button>
      </div>
    </aside>
  );
};
