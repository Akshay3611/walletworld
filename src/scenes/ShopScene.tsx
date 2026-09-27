import React, { useState } from 'react';
import { Html } from '@react-three/drei';
import { Product3D } from '../models/Product3D';
import { useWalletStore } from '../store/walletStore';
import { calculateAffordability, formatRupees } from '../utils/affordabilityService';
import { Lock, CheckCircle2, ChevronRight } from 'lucide-react';

export const ShopScene: React.FC = () => {
  const products = useWalletStore(s => s.products);
  const freeMoney = useWalletStore(s => s.wallet.free);
  const selectProduct = useWalletStore(s => s.selectProduct);
  const selectedProductId = useWalletStore(s => s.selectedProductId);

  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Shop items that are gadgets/wearables (filter out cars/villas which belong to garage/home)
  const shopProducts = products.filter(p => 
    ['phones', 'laptops', 'audio', 'gaming', 'watches', 'fashion'].includes(p.category)
  );

  // Arrange pedestals in a sleek curved showroom arc
  const radius = 6.2;
  const totalItems = shopProducts.length;

  return (
    <group position={[0, 0, 0]}>
      {/* Showroom Reflective Luminous White Floor */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[28, 28]} />
        <meshStandardMaterial
          color="#FFFFFF"
          roughness={0.15}
          metalness={0.2}
        />
      </mesh>

      {/* Vibrant Holographic Concentric Floor Rings */}
      {[
        { r: 2, col: '#8B5CF6' },
        { r: 4, col: '#0EA5E9' },
        { r: 6, col: '#10B981' },
        { r: 8, col: '#F59E0B' },
      ].map((ring, i) => (
        <mesh key={i} position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[ring.r - 0.03, ring.r + 0.03, 64]} />
          <meshBasicMaterial color={ring.col} transparent opacity={0.6} />
        </mesh>
      ))}

      {/* Bright Showroom Lighting */}
      <ambientLight intensity={0.75} color="#F8FAFC" />
      <directionalLight position={[0, 12, 6]} intensity={1.8} color="#FFFFFF" />
      <pointLight position={[0, 5, 0]} intensity={2.0} color="#BAE6FD" distance={15} />

      {/* Product Pedestals in Arc */}
      {shopProducts.map((product, index) => {
        // Arrange in a wide gentle arc
        const angle = ((index - (totalItems - 1) / 2) / totalItems) * Math.PI * 0.75;
        const x = Math.sin(angle) * radius;
        const z = -Math.cos(angle) * radius + 4.5;
        const isSelected = selectedProductId === product.id;
        const isHovered = hoveredId === product.id;

        const calc = calculateAffordability(product.price, freeMoney);
        const isLocked = !calc.canAffordNow;

        return (
          <group
            key={product.id}
            position={[x, 0, z]}
            rotation={[0, -angle, 0]}
            onClick={(e) => {
              e.stopPropagation();
              selectProduct(product.id);
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHoveredId(product.id);
            }}
            onPointerOut={() => setHoveredId(null)}
          >
            {/* Cylindrical Pure White Pedestal Base */}
            <mesh position={[0, 0.45, 0]}>
              <cylinderGeometry args={[0.75, 0.85, 0.9, 32]} />
              <meshStandardMaterial
                color="#FFFFFF"
                metalness={0.2}
                roughness={0.2}
              />
            </mesh>

            {/* Glowing Accent Ring on Pedestal Rim */}
            <mesh position={[0, 0.91, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.65, 0.75, 32]} />
              <meshStandardMaterial
                color={isLocked ? '#F43F5E' : '#10B981'}
                emissive={isLocked ? '#FB7185' : '#34D399'}
                emissiveIntensity={isHovered ? 2.5 : 1.2}
              />
            </mesh>

            {/* Under-pedestal soft ground glow pool */}
            <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[1.1, 32]} />
              <meshBasicMaterial
                color={isLocked ? '#FECDD3' : '#A7F3D0'}
                transparent
                opacity={isHovered ? 0.6 : 0.25}
              />
            </mesh>

            {/* Locked Protective Frosted Glass Containment Cylinder */}
            {isLocked && (
              <mesh position={[0, 1.6, 0]}>
                <cylinderGeometry args={[0.7, 0.7, 1.4, 24, 1, true]} />
                <meshStandardMaterial
                  color="#FDA4AF"
                  emissive="#F43F5E"
                  emissiveIntensity={0.2}
                  transparent
                  opacity={isHovered ? 0.35 : 0.18}
                  roughness={0.1}
                  metalness={0.2}
                />
              </mesh>
            )}

            {/* Spot light focused on pedestal */}
            <pointLight
              position={[0, 2.5, 0]}
              intensity={isHovered ? 3.0 : 1.6}
              color={isLocked ? '#FDA4AF' : '#6EE7B7'}
              distance={3.5}
            />

            {/* 3D Physical Product Model */}
            <group position={[0, 1.4, 0]}>
              <Product3D
                modelType={product.modelType}
                isLocked={isLocked}
                isHovered={isHovered}
                scale={1.0}
              />
            </group>

            {/* Floating Light & Colourful Glass UI Label */}
            <Html
              position={[0, 2.55, 0]}
              center
              distanceFactor={8}
              zIndexRange={[100, 0]}
            >
              <div 
                className={`transition-all duration-300 cursor-pointer pointer-events-auto transform ${
                  isHovered || isSelected ? 'scale-110 -translate-y-2' : 'scale-95'
                }`}
                style={{ width: '220px' }}
              >
                <div className={`p-3.5 rounded-2xl glass-panel border ${
                  isLocked 
                    ? 'border-rose-300 hover:border-rose-400 shadow-glow-coral/30' 
                    : 'border-emerald-300 hover:border-emerald-400 shadow-glow-mint/30'
                }`}>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 font-semibold">
                      {product.brand}
                    </span>
                    {isLocked ? (
                      <span className="flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-100 text-rose-600 border border-rose-200 font-bold">
                        <Lock className="w-2.5 h-2.5" />
                        LOCKED
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        AVAILABLE
                      </span>
                    )}
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 truncate mb-1">
                    {product.name}
                  </h4>

                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-sm font-extrabold font-mono text-slate-900">
                      {formatRupees(product.price)}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 font-bold">
                      {Math.round(calc.progress * 100)}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isLocked ? 'bg-amber-400' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.round(calc.progress * 100)}%` }}
                    />
                  </div>

                  <button className={`w-full py-1.5 text-[10px] font-bold rounded-xl flex items-center justify-center gap-1 transition-all ${
                    isLocked 
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' 
                      : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-glow-mint/30'
                  }`}>
                    {isLocked ? 'Inspect & Save' : 'Instant Buy'}
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
};
