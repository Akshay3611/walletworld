import React from 'react';
import { 
  Home, 
  ShoppingBag, 
  Car, 
  Building2, 
  User, 
  Wallet, 
  Grid3X3 
} from 'lucide-react';
import { useWalletStore } from '../store/walletStore';
import type { ScreenType } from '../types';

interface NavItem {
  id: ScreenType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Home', icon: Home },
  { id: 'shop', label: 'Shop', icon: ShoppingBag },
  { id: 'garage', label: 'Garage', icon: Car },
  { id: 'home', label: 'Space', icon: Building2 },
  { id: 'avatar', label: 'Avatar', icon: User },
  { id: 'wallet', label: 'Wallet', icon: Wallet },
  { id: 'categories', label: 'Categories', icon: Grid3X3 },
];

export const Navigation: React.FC = () => {
  const activeScreen = useWalletStore(s => s.activeScreen);
  const setScreen = useWalletStore(s => s.setScreen);

  return (
    <>
      {/* Desktop Floating Left Navigation */}
      <nav 
        aria-label="Desktop Navigation"
        className="hidden md:flex fixed left-6 top-1/2 -translate-y-1/2 z-30 flex-col gap-2 p-2 rounded-2xl glass-panel border border-white/80 shadow-glass"
      >
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setScreen(item.id)}
              className={`group relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white shadow-glow-indigo scale-105'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
              }`}
              title={item.label}
            >
              <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />

              {/* Tooltip on hover */}
              <div className="absolute left-16 px-2.5 py-1 rounded-lg bg-slate-900 text-white text-xs font-medium font-mono uppercase tracking-wider opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 shadow-xl border border-white/10 whitespace-nowrap">
                {item.label}
              </div>

              {/* Active Dot Indicator */}
              {isActive && (
                <div className="absolute -left-1 w-1.5 h-4 bg-indigo-500 rounded-r-full" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Mobile Bottom Navigation Bar */}
      <nav 
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-4 left-4 right-4 z-30 flex items-center justify-around p-2 rounded-2xl glass-panel border border-white/80 shadow-glass"
      >
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setScreen(item.id)}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
                isActive
                  ? 'text-indigo-600 bg-indigo-50 border border-indigo-200'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[9px] font-mono mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
