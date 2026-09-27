import React from 'react';
import { WalletCard } from '../components/WalletCard';
import { useWalletStore } from '../store/walletStore';
import { 
  ShoppingBag, 
  Car, 
  Building2, 
  Sparkles,
  ChevronRight,
  MousePointerClick
} from 'lucide-react';
import { calculateAffordability, formatRupees } from '../utils/affordabilityService';

export const Dashboard: React.FC = () => {
  const setScreen = useWalletStore(s => s.setScreen);
  const products = useWalletStore(s => s.products);
  const freeMoney = useWalletStore(s => s.wallet.free);
  const selectProduct = useWalletStore(s => s.selectProduct);
  const selectedProductId = useWalletStore(s => s.selectedProductId);

  // Aspirational highlight targets (e.g. Royal Enfield, iPhone 16 Pro, Smartwatch)
  const aspirationalTargets = products.filter(p => 
    ['prod-smartwatch', 'prod-macbookpro', 'prod-royal-enfield'].includes(p.id)
  );

  const isInspecting = Boolean(selectedProductId);

  return (
    <div className="absolute inset-0 z-10 pointer-events-none p-4 md:p-8 flex flex-col justify-between pt-20 md:pt-20 pb-20 md:pb-8 overflow-hidden">
      {/* Top Left Floating Wallet Panel */}
      <div className={`pointer-events-auto max-w-md mt-1 transition-opacity duration-300 ${
        isInspecting ? 'opacity-40 hover:opacity-100' : 'opacity-100'
      }`}>
        <WalletCard />
      </div>

      {/* Middle Hint: Interactive Room Prompt when not inspecting */}
      {!isInspecting && (
        <div className="pointer-events-none self-center flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-slate-200/80 text-slate-500 font-mono text-[11px] shadow-sm animate-pulse">
          <MousePointerClick className="w-3.5 h-3.5 text-indigo-600" />
          <span>Drag to orbit room • Click 3D MacBook, Smartwatch, or Headphones to inspect</span>
        </div>
      )}

      {/* Bottom Floating Hub: Aspirational Radar & Quick Portals */}
      <div className={`pointer-events-auto flex flex-col lg:flex-row items-stretch lg:items-end justify-between gap-4 mt-6 transition-all duration-300 ${
        isInspecting ? 'opacity-30 pointer-events-none' : 'opacity-100'
      }`}>
        {/* World Quick Portals */}
        <div className="glass-panel p-2.5 rounded-2xl border border-white/90 shadow-glass flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setScreen('shop')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200/80 hover:border-emerald-300 text-xs font-mono font-bold transition-all whitespace-nowrap active:scale-95 shadow-sm cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-emerald-600" />
            <span>3D Showroom</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
          </button>

          <button
            onClick={() => setScreen('garage')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-cyan-50 text-slate-700 hover:text-cyan-700 border border-slate-200/80 hover:border-cyan-300 text-xs font-mono font-bold transition-all whitespace-nowrap active:scale-95 shadow-sm cursor-pointer"
          >
            <Car className="w-4 h-4 text-cyan-600" />
            <span>Vehicle Bay</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
          </button>

          <button
            onClick={() => setScreen('home')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-700 border border-slate-200/80 hover:border-amber-300 text-xs font-mono font-bold transition-all whitespace-nowrap active:scale-95 shadow-sm cursor-pointer"
          >
            <Building2 className="w-4 h-4 text-amber-600" />
            <span>Sky Architecture</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
          </button>
        </div>

        {/* Aspirational Radar Cards */}
        <div className="flex flex-col sm:flex-row gap-3">
          {aspirationalTargets.map((item) => {
            const calc = calculateAffordability(item.price, freeMoney);

            return (
              <div
                key={item.id}
                onClick={() => selectProduct(item.id)}
                className="glass-panel p-3.5 rounded-2xl border border-white/90 hover:border-indigo-300 transition-all cursor-pointer group flex items-center justify-between gap-4 min-w-[220px] active:scale-95 shadow-glass"
              >
                <div>
                  <div className="flex items-center gap-1 text-[10px] font-mono uppercase text-slate-500 font-bold">
                    <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                    <span>{item.brand}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {item.name}
                  </h4>
                  <div className="text-xs font-mono font-black text-slate-950 mt-0.5">
                    {formatRupees(item.price)}
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-bold ${
                    calc.canAffordNow
                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-100 text-rose-700 border border-rose-200'
                  }`}>
                    {calc.canAffordNow ? 'UNLOCKED' : `${Math.round(calc.progress * 100)}%`}
                  </span>
                  <div className="w-16 h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        calc.canAffordNow ? 'bg-emerald-500' : 'bg-amber-400'
                      }`}
                      style={{ width: `${Math.round(calc.progress * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
