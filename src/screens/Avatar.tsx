import React, { useState } from 'react';
import { useWalletStore } from '../store/walletStore';
import { formatRupees } from '../utils/affordabilityService';
import { 
  ShieldCheck, 
  Flame, 
  Package, 
  Shirt, 
  Check
} from 'lucide-react';
import type { AvatarCustomization } from '../types';

export const Avatar: React.FC = () => {
  const user = useWalletStore(s => s.user);
  const avatarGear = useWalletStore(s => s.avatarGear);
  const updateAvatarGear = useWalletStore(s => s.updateAvatarGear);
  const inventory = useWalletStore(s => s.inventory);

  const [activeTab, setActiveTab] = useState<'gear' | 'inventory'>('gear');

  const jackets: { id: AvatarCustomization['jacket']; label: string; desc: string }[] = [
    { id: 'stealth_bomber', label: 'Pure White Bomber', desc: 'Crisp white with emerald green neon piping' },
    { id: 'cyber_neon', label: 'Electric Blue Jacket', desc: 'Marina cyan with azure luminescence' },
    { id: 'luxury_trench', label: 'Camel Gold Trench', desc: 'Warm sand with solar amber trim' },
    { id: 'tactical_vest', label: 'Sunset Coral Vest', desc: 'Vibrant coral with pastel rose accents' },
  ];

  const accessories: { id: AvatarCustomization['accessory']; label: string }[] = [
    { id: 'hud_visor', label: 'Cyan Optical HUD' },
    { id: 'smart_specs', label: 'Gold Smart Specs' },
    { id: 'none', label: 'No Visor' },
  ];

  const watches: { id: AvatarCustomization['watch']; label: string }[] = [
    { id: 'digital_cyber', label: 'Cyan Digital Watch' },
    { id: 'chronograph_gold', label: 'Solid Gold Chrono' },
    { id: 'none', label: 'No Wristwear' },
  ];

  return (
    <div className="absolute inset-0 z-10 pointer-events-none p-4 md:p-8 flex flex-col justify-between pt-24 pb-20 md:pb-8">
      {/* Top Left: Player Level & Net Worth Progression Badge */}
      <div className="pointer-events-auto max-w-sm">
        <div className="glass-panel p-5 rounded-3xl border border-white/90 shadow-glass">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono tracking-wider uppercase text-emerald-700 font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              PLAYER LEVEL {user.level}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1 font-bold">
              <Flame className="w-3 h-3 text-amber-500" />
              {user.savingsStreakWeeks} WEEKS STREAK
            </span>
          </div>

          <h2 className="text-xl font-bold text-slate-900 mb-1">{user.title}</h2>

          <div className="grid grid-cols-2 gap-2 my-3 text-xs font-mono">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-slate-500 block text-[10px] font-bold">Net Worth</span>
              <span className="text-slate-950 font-black text-sm">
                {formatRupees(user.netWorth, true)}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100">
              <span className="text-emerald-700 block text-[10px] font-bold">Unlocked Assets</span>
              <span className="text-emerald-800 font-black text-sm">
                {inventory.length} Items
              </span>
            </div>
          </div>

          {/* Level Progress Bar */}
          <div>
            <div className="flex justify-between text-[11px] font-mono text-slate-500 mb-1 font-bold">
              <span>Next Level: Master Builder</span>
              <span className="text-indigo-600">76%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-indigo-600 rounded-full w-[76%]" />
            </div>
          </div>
        </div>
      </div>

      {/* Right / Bottom: Customization Deck & Personal Inventory */}
      <div className="pointer-events-auto max-w-md w-full self-end">
        <div className="glass-panel p-5 rounded-3xl border border-white/90 shadow-glass">
          {/* Tabs */}
          <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl mb-4">
            <button
              onClick={() => setActiveTab('gear')}
              className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'gear'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Shirt className="w-3.5 h-3.5" />
              <span>Avatar Gear</span>
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'inventory'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Inventory ({inventory.length})</span>
            </button>
          </div>

          {/* Tab 1: Gear Customizer */}
          {activeTab === 'gear' && (
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
              {/* Jacket */}
              <div>
                <span className="text-[11px] font-mono uppercase text-slate-500 block mb-2 font-bold">
                  Upper Outerwear
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {jackets.map((j) => (
                    <button
                      key={j.id}
                      onClick={() => updateAvatarGear({ jacket: j.id })}
                      className={`p-2.5 rounded-2xl text-left border transition-all text-xs font-mono ${
                        avatarGear.jacket === j.id
                          ? 'bg-indigo-50 border-indigo-400 text-indigo-900 shadow-sm'
                          : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="font-bold">{j.label}</div>
                      <div className="text-[9px] text-slate-500 truncate mt-0.5">{j.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Visor / Specs */}
              <div>
                <span className="text-[11px] font-mono uppercase text-slate-500 block mb-2 font-bold">
                  Optical HUD
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {accessories.map((acc) => (
                    <button
                      key={acc.id}
                      onClick={() => updateAvatarGear({ accessory: acc.id })}
                      className={`p-2 rounded-xl text-center border transition-all text-xs font-mono font-bold ${
                        avatarGear.accessory === acc.id
                          ? 'bg-cyan-50 border-cyan-400 text-cyan-800'
                          : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      {acc.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Wrist Chronograph */}
              <div>
                <span className="text-[11px] font-mono uppercase text-slate-500 block mb-2 font-bold">
                  Wrist Hardware
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {watches.map((w) => (
                    <button
                      key={w.id}
                      onClick={() => updateAvatarGear({ watch: w.id })}
                      className={`p-2 rounded-xl text-center border transition-all text-xs font-mono font-bold ${
                        avatarGear.watch === w.id
                          ? 'bg-amber-50 border-amber-400 text-amber-800'
                          : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      {w.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: User Inventory */}
          {activeTab === 'inventory' && (
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {inventory.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl bg-white border border-slate-200 flex items-center justify-between gap-3 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-600">
                      <Check className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{item.name}</h4>
                      <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">
                        {item.brand} • {item.category}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs font-mono font-black text-emerald-700">
                    {formatRupees(item.price)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
