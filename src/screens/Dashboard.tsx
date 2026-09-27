import React from 'react';
import { WalletCard } from '../components/WalletCard';
import { useWalletStore } from '../store/walletStore';
import { useWorldStore } from '../store/worldStore';
import { 
  ShoppingBag, 
  Car, 
  Building2, 
  Sparkles,
  ChevronRight,
  MousePointerClick,
  Compass
} from 'lucide-react';
import { calculateAffordability, formatRupees } from '../utils/affordabilityService';

export const Dashboard: React.FC = () => {
  const setScreen = useWalletStore((s) => s.setScreen);
  const products = useWalletStore((s) => s.products);
  const freeMoney = useWalletStore((s) => s.wallet.free);
  const selectProduct = useWalletStore((s) => s.selectProduct);
  const selectedProductId = useWalletStore((s) => s.selectedProductId);

  const hasInteracted = useWorldStore((s) => s.hasInteracted);
  const setHasInteracted = useWorldStore((s) => s.setHasInteracted);
  const unlockedRoomItems = useWorldStore((s) => s.unlockedRoomItems);

  // Focus specifically on the 3 physical objects located in the apartment
  const inRoomTargets = products.filter((p) => 
    ['prod-smartwatch', 'prod-macbookpro', 'prod-sony-wh1000xm6'].includes(p.id)
  );

  const isInspecting = Boolean(selectedProductId);

  const handleSelectObject = (id: string) => {
    setHasInteracted(true);
    selectProduct(id);
  };

  return (
    <div className="absolute inset-0 z-10 pointer-events-none p-4 md:p-8 flex flex-col justify-between pt-20 md:pt-20 pb-20 md:pb-8 overflow-hidden select-none">
      {/* Top Left Floating Wallet HUD */}
      <div className={`pointer-events-auto max-w-sm mt-1 transition-opacity duration-300 ${
        isInspecting ? 'opacity-40 hover:opacity-100' : 'opacity-100'
      }`}>
        <WalletCard />
      </div>

      {/* Middle Tutorial Hint: Disappears permanently after first interaction */}
      {!hasInteracted && !isInspecting && (
        <div className="pointer-events-none self-center flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/75 backdrop-blur-md border border-slate-200/90 text-slate-600 font-mono text-[11px] font-medium shadow-glass animate-pulse">
          <MousePointerClick className="w-3.5 h-3.5 text-indigo-600" />
          <span>Drag to orbit room • Click 3D objects on the desk to inspect</span>
        </div>
      )}

      {/* Bottom Floating Hub: In-Room Radar HUD & Quick Portals */}
      <div className={`pointer-events-auto flex flex-col lg:flex-row items-stretch lg:items-end justify-between gap-4 mt-6 transition-all duration-300 ${
        isInspecting ? 'opacity-30 pointer-events-none' : 'opacity-100'
      }`}>
        {/* World Location Portals */}
        <div className="bg-white/60 hover:bg-white/75 backdrop-blur-xl p-2 rounded-2xl border border-white/80 shadow-glass flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setScreen('shop')}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200/80 hover:border-emerald-300 text-xs font-mono font-bold transition-all whitespace-nowrap active:scale-95 shadow-sm cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-emerald-600" />
            <span>3D Showroom</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
          </button>

          <button
            onClick={() => setScreen('garage')}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 hover:bg-cyan-50 text-slate-700 hover:text-cyan-800 border border-slate-200/80 hover:border-cyan-300 text-xs font-mono font-bold transition-all whitespace-nowrap active:scale-95 shadow-sm cursor-pointer"
          >
            <Car className="w-4 h-4 text-cyan-600" />
            <span>Vehicle Bay</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
          </button>

          <button
            onClick={() => setScreen('home')}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-800 border border-slate-200/80 hover:border-amber-300 text-xs font-mono font-bold transition-all whitespace-nowrap active:scale-95 shadow-sm cursor-pointer"
          >
            <Building2 className="w-4 h-4 text-amber-600" />
            <span>Sky Architecture</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
          </button>
        </div>

        {/* Compact In-Room Radar HUD */}
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <div className="hidden xl:flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold px-1">
            <Compass className="w-3.5 h-3.5 text-indigo-500" />
            <span>IN-ROOM OBJECTS:</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            {inRoomTargets.map((item) => {
              const calc = calculateAffordability(item.price, freeMoney);
              const isOwned = unlockedRoomItems.includes(item.id);

              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectObject(item.id)}
                  className="bg-white/65 hover:bg-white/90 backdrop-blur-xl px-3 py-2.5 rounded-2xl border border-white/80 hover:border-indigo-300 transition-all cursor-pointer group flex items-center justify-between gap-3 min-w-[200px] active:scale-95 shadow-glass"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1 text-[9px] font-mono uppercase text-slate-500 font-bold truncate">
                      <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                      <span>{item.brand}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                      {item.name}
                    </h4>
                    <div className="text-[11px] font-mono font-black text-slate-950 mt-0.5">
                      {formatRupees(item.price)}
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded-md font-bold block ${
                      isOwned
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : calc.canAffordNow
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-100 text-rose-700 border border-rose-200'
                    }`}>
                      {isOwned ? 'OWNED' : calc.canAffordNow ? 'UNLOCKED' : `${Math.round(calc.progress * 100)}%`}
                    </span>
                    <div className="w-14 h-1 bg-slate-200 rounded-full mt-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          isOwned || calc.canAffordNow ? 'bg-emerald-500' : 'bg-amber-400'
                        }`}
                        style={{ width: isOwned ? '100%' : `${Math.round(calc.progress * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
