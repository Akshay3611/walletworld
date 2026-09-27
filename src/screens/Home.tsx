import React from 'react';
import { useWalletStore } from '../store/walletStore';
import { calculateAffordability, formatRupees } from '../utils/affordabilityService';
import { Lock, MapPin } from 'lucide-react';

export const Home: React.FC = () => {
  const products = useWalletStore(s => s.products);
  const freeMoney = useWalletStore(s => s.wallet.free);
  const selectProduct = useWalletStore(s => s.selectProduct);
  const selectedProductId = useWalletStore(s => s.selectedProductId);

  const properties = products.filter(p => ['apartments', 'villas'].includes(p.category));

  return (
    <div className="absolute inset-0 z-10 pointer-events-none p-4 md:p-8 flex flex-col justify-between pt-24 pb-20 md:pb-8">
      {/* Top Floating Banner */}
      <div className="pointer-events-auto max-w-xl mx-auto w-full text-center">
        <div className="glass-panel p-4 rounded-3xl border border-white/90 shadow-glass">
          <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-600 font-bold block mb-0.5">
            Aspirational Domain
          </span>
          <h2 className="text-base md:text-lg font-bold text-slate-900">
            Skyline Residences & Architectural Estates
          </h2>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Turn life milestones into physical 3D spaces in your world.
          </p>
        </div>
      </div>

      {/* Bottom Properties Selector */}
      <div className="pointer-events-auto max-w-3xl mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {properties.map((prop) => {
            const calc = calculateAffordability(prop.price, freeMoney);
            const isSelected = selectedProductId === prop.id;

            return (
              <div
                key={prop.id}
                onClick={() => selectProduct(prop.id)}
                className={`p-4 rounded-3xl glass-panel border transition-all cursor-pointer shadow-glass ${
                  isSelected
                    ? 'border-indigo-400 shadow-glow-indigo scale-102 bg-indigo-50/50'
                    : 'border-white/90 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="flex items-center gap-1 text-[10px] font-mono uppercase text-indigo-600 font-bold">
                    <MapPin className="w-3 h-3" />
                    {prop.category}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-mono text-rose-700 bg-rose-100 px-2 py-0.5 rounded font-bold">
                    <Lock className="w-2.5 h-2.5" />
                    ~{calc.monthsToUnlock} mos
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 mb-1">{prop.name}</h3>

                <div className="text-sm font-black font-mono text-slate-950 mb-2">
                  {formatRupees(prop.price, true)}
                </div>

                <div className="text-[11px] text-slate-500 line-clamp-1">
                  {prop.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
