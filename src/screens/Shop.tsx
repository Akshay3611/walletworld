import React, { useState } from 'react';
import { useWalletStore } from '../store/walletStore';
import { calculateAffordability, formatRupees } from '../utils/affordabilityService';
import { 
  Lock, 
  CheckCircle2, 
  Compass, 
  ChevronRight
} from 'lucide-react';

export const Shop: React.FC = () => {
  const products = useWalletStore(s => s.products);
  const freeMoney = useWalletStore(s => s.wallet.free);
  const selectProduct = useWalletStore(s => s.selectProduct);
  const selectedProductId = useWalletStore(s => s.selectedProductId);

  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'phones', label: 'Phones' },
    { id: 'audio', label: 'Audio' },
    { id: 'laptops', label: 'Laptops' },
    { id: 'watches', label: 'Watches' },
    { id: 'gaming', label: 'Gaming' },
    { id: 'fashion', label: 'Fashion' },
  ];

  const shopProducts = products.filter(p => {
    if (!['phones', 'laptops', 'audio', 'gaming', 'watches', 'fashion'].includes(p.category)) {
      return false;
    }
    if (activeCategory === 'all') return true;
    return p.category === activeCategory;
  });

  return (
    <div className="absolute inset-0 z-10 pointer-events-none p-4 md:p-8 flex flex-col justify-between pt-24 pb-20 md:pb-8">
      {/* Top Floating Category Selector Bar */}
      <div className="pointer-events-auto max-w-4xl mx-auto w-full">
        <div className="glass-panel p-2 rounded-2xl border border-white/90 flex items-center justify-between gap-2 overflow-x-auto shadow-glass">
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap ${
                  activeCategory === cat.id
                    ? 'bg-indigo-600 text-white shadow-glow-indigo'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-slate-500 font-bold px-3 border-l border-slate-200 whitespace-nowrap">
            <Compass className="w-3.5 h-3.5 text-indigo-600" />
            <span>Interactive 3D Showroom</span>
          </div>
        </div>
      </div>

      {/* Bottom Floating Shelf of Pedestals */}
      <div className="pointer-events-auto max-w-5xl mx-auto w-full">
        <div className="glass-panel p-3 rounded-3xl border border-white/90 flex items-center gap-3 overflow-x-auto shadow-glass">
          {shopProducts.map((p) => {
            const calc = calculateAffordability(p.price, freeMoney);
            const isSelected = selectedProductId === p.id;

            return (
              <button
                key={p.id}
                onClick={() => selectProduct(p.id)}
                className={`p-3 rounded-2xl min-w-[200px] text-left transition-all flex flex-col justify-between border ${
                  isSelected
                    ? 'bg-indigo-50 border-indigo-400 shadow-glow-indigo scale-102'
                    : 'bg-white hover:bg-slate-50 border-slate-100 hover:border-slate-200 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[10px] font-mono uppercase text-slate-500 font-bold truncate">
                    {p.brand}
                  </span>
                  {calc.canAffordNow ? (
                    <span className="flex items-center gap-1 text-[9px] font-mono text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded font-bold">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      BUY
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[9px] font-mono text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded font-bold">
                      <Lock className="w-2.5 h-2.5" />
                      {Math.round(calc.progress * 100)}%
                    </span>
                  )}
                </div>

                <div className="text-xs font-bold text-slate-900 truncate mb-1">
                  {p.name}
                </div>

                <div className="flex items-center justify-between text-xs font-mono font-black text-slate-950">
                  <span>{formatRupees(p.price)}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
