import React from 'react';
import { useWalletStore } from '../store/walletStore';
import { categoryMeta } from '../data/mockData';
import { 
  Smartphone, 
  Laptop, 
  Headphones, 
  Gamepad2, 
  Watch, 
  Sparkles, 
  Bike, 
  Car, 
  Flame, 
  Building2, 
  Home, 
  Plane,
  ArrowRight
} from 'lucide-react';
import type { ScreenType } from '../types';

export const Categories: React.FC = () => {
  const setScreen = useWalletStore(s => s.setScreen);

  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Smartphone,
    Laptop,
    Headphones,
    Gamepad2,
    Watch,
    Sparkles,
    Bike,
    Car,
    Flame,
    Building2,
    Home,
    Plane,
  };

  const getTargetScreen = (catId: string): ScreenType => {
    if (['bikes', 'cars', 'supercars'].includes(catId)) return 'garage';
    if (['apartments', 'villas'].includes(catId)) return 'home';
    return 'shop';
  };

  return (
    <div className="absolute inset-0 z-10 pointer-events-none p-4 md:p-8 flex flex-col justify-between pt-24 pb-20 md:pb-8 overflow-y-auto">
      {/* Top Banner */}
      <div className="pointer-events-auto max-w-xl mx-auto w-full text-center">
        <div className="glass-panel p-4 rounded-3xl border border-white/90 shadow-glass">
          <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-600 font-bold block mb-0.5">
            Sectors & Taxonomy
          </span>
          <h2 className="text-base md:text-lg font-bold text-slate-900">
            Choose Your Realm to Expand
          </h2>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="pointer-events-auto max-w-5xl mx-auto w-full my-auto py-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {categoryMeta.map((cat) => {
            const Icon = iconMap[cat.icon] || Sparkles;
            const targetScreen = getTargetScreen(cat.id);

            return (
              <button
                key={cat.id}
                onClick={() => setScreen(targetScreen)}
                className="p-4 rounded-3xl glass-card border border-white/90 hover:border-indigo-300 flex flex-col items-start justify-between min-h-[115px] transition-all group text-left active:scale-95 shadow-glass"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600 group-hover:text-emerald-700 group-hover:bg-emerald-50 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-[10px] font-mono text-slate-500 font-medium">
                    {cat.count} Premium Objects
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
