import React, { useState } from 'react';
import { useWalletStore } from '../store/walletStore';
import { calculateAffordability, formatRupees } from '../utils/affordabilityService';
import { 
  Car, 
  Bike, 
  Flame, 
  Lock, 
  Sparkles, 
  Gauge
} from 'lucide-react';

export const Garage: React.FC = () => {
  const products = useWalletStore(s => s.products);
  const freeMoney = useWalletStore(s => s.wallet.free);
  const selectProduct = useWalletStore(s => s.selectProduct);
  const selectedProductId = useWalletStore(s => s.selectedProductId);

  const [activeFilter, setActiveFilter] = useState<'ALL' | 'BIKES' | 'CARS' | 'SUPERCARS'>('ALL');

  const filterTabs = [
    { id: 'ALL', label: 'All Fleet', icon: Gauge },
    { id: 'BIKES', label: 'Bikes & Cruisers', icon: Bike },
    { id: 'CARS', label: 'Performance Cars', icon: Car },
    { id: 'SUPERCARS', label: 'Hypercars', icon: Flame },
  ];

  const vehicles = products.filter(p => {
    if (!['bikes', 'cars', 'supercars'].includes(p.category)) return false;
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'BIKES') return p.category === 'bikes';
    if (activeFilter === 'CARS') return p.category === 'cars';
    if (activeFilter === 'SUPERCARS') return p.category === 'supercars';
    return true;
  });

  return (
    <div className="absolute inset-0 z-10 pointer-events-none p-4 md:p-8 flex flex-col justify-between pt-24 pb-20 md:pb-8">
      {/* Top Floating Filter Bar */}
      <div className="pointer-events-auto max-w-2xl mx-auto w-full">
        <div className="glass-panel p-2 rounded-2xl border border-white/90 flex items-center justify-center gap-2 overflow-x-auto shadow-glass">
          {filterTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeFilter === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as any)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-cyan-600 text-white shadow-glow-cyan'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Floating Telemetry Bay */}
      <div className="pointer-events-auto max-w-4xl mx-auto w-full">
        <div className="glass-panel p-4 rounded-3xl border border-white/90 shadow-glass flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex items-center gap-3 overflow-x-auto py-1">
            {vehicles.map((v) => {
              const calc = calculateAffordability(v.price, freeMoney);
              const isSelected = selectedProductId === v.id;

              return (
                <button
                  key={v.id}
                  onClick={() => selectProduct(v.id)}
                  className={`p-3 rounded-2xl min-w-[220px] text-left transition-all border ${
                    isSelected
                      ? 'bg-cyan-50 border-cyan-400 shadow-glow-cyan scale-102'
                      : 'bg-white hover:bg-slate-50 border-slate-100 hover:border-slate-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-mono text-cyan-700 font-bold uppercase">
                      {v.brand}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-mono text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded font-bold">
                      <Lock className="w-2.5 h-2.5" />
                      {Math.round(calc.progress * 100)}%
                    </span>
                  </div>

                  <div className="text-xs font-bold text-slate-900 mb-1 truncate">
                    {v.name}
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono font-black text-slate-950">
                    <span>{formatRupees(v.price, true)}</span>
                    <span className="text-[10px] font-medium text-slate-500">
                      ~{calc.monthsToUnlock} mos
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-4 flex flex-col justify-center min-w-[200px]">
            <div className="text-[11px] font-mono text-slate-500 mb-1 flex items-center gap-1.5 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Fleet Strategy:</span>
            </div>
            <div className="text-xs font-mono text-slate-900 font-extrabold">
              Save ₹14,300/month
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5 font-medium">
              Target Royal Enfield in 12 mos
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
