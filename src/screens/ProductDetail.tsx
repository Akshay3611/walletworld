import React from 'react';
import { X, Lock, CheckCircle2, Calendar, Sparkles, ShoppingBag, ArrowRight } from 'lucide-react';
import { useWalletStore } from '../store/walletStore';
import { calculateAffordability, formatRupees } from '../utils/affordabilityService';
import { Canvas } from '@react-three/fiber';
import { Product3D } from '../models/Product3D';
import { Vehicle3D } from '../models/Vehicle3D';
import { Architecture3D } from '../models/Architecture3D';

export const ProductDetail: React.FC = () => {
  const selectedProductId = useWalletStore(s => s.selectedProductId);
  const products = useWalletStore(s => s.products);
  const freeMoney = useWalletStore(s => s.wallet.free);
  const selectProduct = useWalletStore(s => s.selectProduct);
  const buyProduct = useWalletStore(s => s.buyProduct);
  const addSimulatedFunds = useWalletStore(s => s.addSimulatedFunds);

  const product = products.find(p => p.id === selectedProductId);
  if (!product) return null;

  const calc = calculateAffordability(product.price, freeMoney);
  const isVehicle = ['bikes', 'cars', 'supercars'].includes(product.category);
  const isArchitecture = ['apartments', 'villas'].includes(product.category);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xl animate-in fade-in duration-300">
      <div 
        className="w-full max-w-4xl max-h-[92vh] glass-panel rounded-3xl border border-white/90 shadow-2xl overflow-hidden flex flex-col md:flex-row relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => selectProduct(null)}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 transition-all active:scale-95 shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LEFT: 3D Dedicated Inspection Stage in Clean White */}
        <div className="w-full md:w-1/2 h-72 md:h-auto min-h-[320px] bg-gradient-to-b from-white via-slate-50 to-slate-100 relative flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-200">
          {/* Subtle Stage lighting ring */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className={`w-56 h-56 rounded-full blur-3xl opacity-20 ${
              calc.canAffordNow ? 'bg-emerald-400' : 'bg-rose-400'
            }`} />
          </div>

          <Canvas camera={{ position: [0, 1.2, isVehicle ? 4.2 : 2.8], fov: 45 }}>
            <ambientLight intensity={0.8} color="#F8FAFC" />
            <directionalLight position={[4, 8, 4]} intensity={2.0} color="#FFFFFF" />
            <pointLight
              position={[-3, 2, 2]}
              intensity={2.0}
              color={calc.canAffordNow ? '#10B981' : '#F43F5E'}
            />

            <group position={[0, 0, 0]}>
              {isVehicle ? (
                <Vehicle3D
                  modelType={product.modelType as any}
                  scale={product.category === 'bikes' ? 1.4 : 1.0}
                  isLocked={!calc.canAffordNow}
                  autoRotate={true}
                />
              ) : isArchitecture ? (
                <Architecture3D
                  modelType={product.modelType as any}
                  scale={1.0}
                  isLocked={!calc.canAffordNow}
                />
              ) : (
                <Product3D
                  modelType={product.modelType}
                  scale={1.2}
                  isLocked={!calc.canAffordNow}
                  autoRotate={true}
                />
              )}
            </group>
          </Canvas>

          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-slate-500 font-bold pointer-events-none">
            <span>Interactive 3D Stage</span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              60 FPS Render
            </span>
          </div>
        </div>

        {/* RIGHT: Product Telemetry & Financial Engine */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            {/* Category & Status */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-mono uppercase tracking-widest text-indigo-600 font-bold">
                {product.brand} • {product.category}
              </span>
              {calc.canAffordNow ? (
                <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1 shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  AVAILABLE
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-rose-600" />
                  LOCKED
                </span>
              )}
            </div>

            {/* Product Name */}
            <h2 className="text-2xl font-black text-slate-900 mb-2">{product.name}</h2>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed font-medium">
              {product.description}
            </p>

            {/* Price & Progress Section */}
            <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200/80 mb-6">
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-xs font-mono text-slate-500 uppercase font-bold">
                  World Acquisition Value
                </span>
                <span className="text-2xl font-black font-mono text-slate-950">
                  {formatRupees(product.price)}
                </span>
              </div>

              {/* Progress toward unlock */}
              <div className="mb-2">
                <div className="flex justify-between text-xs font-mono mb-1.5 font-bold">
                  <span className="text-slate-500">
                    You have: {formatRupees(freeMoney)}
                  </span>
                  <span className={calc.canAffordNow ? 'text-emerald-700' : 'text-amber-700'}>
                    {Math.round(calc.progress * 100)}%
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      calc.canAffordNow ? 'bg-emerald-500' : 'bg-gradient-to-r from-amber-400 to-amber-500'
                    }`}
                    style={{ width: `${Math.round(calc.progress * 100)}%` }}
                  />
                </div>
              </div>

              {!calc.canAffordNow && (
                <p className="text-xs text-rose-600 font-mono mt-2 flex items-center gap-1.5 font-bold">
                  <span>Need:</span>
                  <span className="font-black text-slate-900">{formatRupees(calc.remaining)}</span>
                  <span>more to unlock into your world.</span>
                </p>
              )}
            </div>

            {/* Savings Velocity Projection */}
            {!calc.canAffordNow && (
              <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200 space-y-2 mb-6 text-xs font-mono">
                <div className="flex items-center justify-between text-slate-600 font-medium">
                  <span className="flex items-center gap-1 text-slate-500">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Savings Velocity:
                  </span>
                  <span className="text-slate-900 font-bold">₹14,300/month</span>
                </div>
                <div className="flex items-center justify-between text-slate-600 font-medium">
                  <span className="flex items-center gap-1 text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                    Estimated Unlock Time:
                  </span>
                  <span className="text-indigo-700 font-black">
                    ≈ {calc.monthsToUnlock} Months
                  </span>
                </div>
              </div>
            )}

            {/* Technical Specifications */}
            <div className="space-y-1.5 mb-6">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold mb-2">
                Hardware Specifications
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                {Object.entries(product.specs).map(([key, val]) => (
                  <div key={key} className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block text-[10px] font-bold">{key}</span>
                    <span className="text-slate-900 font-bold truncate block">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row gap-3">
            {calc.canAffordNow ? (
              <button
                onClick={() => buyProduct(product.id)}
                className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-glow-mint transition-all active:scale-98 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>BUY NOW • {formatRupees(product.price)}</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => addSimulatedFunds(calc.remaining)}
                  className="flex-1 py-3 px-4 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm"
                  title="Simulate injecting the required cash to test instant unlocking"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Simulate Full Funding</span>
                </button>
                <button
                  onClick={() => selectProduct(null)}
                  className="flex-1 py-3 px-4 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>Set Savings Goal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
