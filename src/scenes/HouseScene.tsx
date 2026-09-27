import React, { useState } from 'react';
import { Html } from '@react-three/drei';
import { Architecture3D } from '../models/Architecture3D';
import { useWalletStore } from '../store/walletStore';
import { calculateAffordability, formatRupees } from '../utils/affordabilityService';
import { Building2, Lock, ArrowUpRight } from 'lucide-react';

export const HouseScene: React.FC = () => {
  const products = useWalletStore(s => s.products);
  const freeMoney = useWalletStore(s => s.wallet.free);
  const selectProduct = useWalletStore(s => s.selectProduct);
  const selectedProductId = useWalletStore(s => s.selectedProductId);

  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const realEstate = products.filter(p => ['apartments', 'villas'].includes(p.category));

  return (
    <group position={[0, 0, 0]}>
      {/* Sunlit Architectural Stage in Clean White */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[28, 28]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.15} metalness={0.1} />
      </mesh>

      {/* Cyan & Slate Blueprint Grid Lines */}
      <gridHelper args={[24, 24, '#0EA5E9', '#E2E8F0']} position={[0, 0.01, 0]} />

      <ambientLight intensity={0.8} color="#F8FAFC" />
      <directionalLight position={[6, 14, 6]} intensity={2.0} color="#FFFBEB" />
      <pointLight position={[0, 5, 2]} intensity={2.0} color="#BAE6FD" distance={16} />

      {/* Properties Display */}
      {realEstate.map((property, idx) => {
        const xOffset = idx === 0 ? -4.5 : 4.5;
        const isHovered = hoveredId === property.id;
        const isSelected = selectedProductId === property.id;

        const calc = calculateAffordability(property.price, freeMoney);

        return (
          <group
            key={property.id}
            position={[xOffset, 0, 0]}
            onClick={(e) => {
              e.stopPropagation();
              selectProduct(property.id);
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHoveredId(property.id);
            }}
            onPointerOut={() => setHoveredId(null)}
          >
            {/* Podium Halo Ring */}
            <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[3.2, 3.3, 48]} />
              <meshStandardMaterial
                color="#0EA5E9"
                emissive="#38BDF8"
                emissiveIntensity={isHovered ? 2.5 : 1.0}
              />
            </mesh>

            <spotLight
              position={[0, 8, 0]}
              intensity={isHovered ? 3.0 : 1.8}
              angle={0.6}
              penumbra={0.5}
              color="#BAE6FD"
            />

            {/* 3D Scale Architecture Model */}
            <group position={[0, 0.5, 0]}>
              <Architecture3D
                modelType={property.modelType as 'apartment' | 'villa'}
                isLocked={!calc.canAffordNow}
                scale={1.2}
              />
            </group>

            {/* Floating Info Tag */}
            <Html position={[0, 4.2, 0]} center distanceFactor={10} zIndexRange={[100, 0]}>
              <div 
                className={`transition-all duration-300 cursor-pointer pointer-events-auto ${
                  isHovered || isSelected ? 'scale-105' : 'scale-95'
                }`}
                style={{ width: '280px' }}
              >
                <div className="glass-panel p-4 rounded-3xl border border-white/80 hover:border-cyan-400 shadow-glass">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="flex items-center gap-1 text-[10px] font-mono text-cyan-600 uppercase font-bold tracking-wider">
                      <Building2 className="w-3 h-3" />
                      {property.category}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-rose-100 text-rose-600 border border-rose-200 font-bold">
                      <Lock className="w-2.5 h-2.5" />
                      LOCKED
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mb-1">{property.name}</h3>

                  <div className="text-base font-extrabold font-mono text-slate-900 mb-2">
                    {formatRupees(property.price, true)}
                  </div>

                  <p className="text-[11px] text-slate-500 line-clamp-2 mb-3">
                    {property.description}
                  </p>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-[11px] font-mono mb-3">
                    <span className="text-slate-500">Wealth Goal:</span>
                    <span className="text-amber-600 font-bold">Tier 1 Aspirational</span>
                  </div>

                  <button className="w-full py-2 text-xs font-bold rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white shadow-glow-cyan/20 flex items-center justify-center gap-1 transition-all">
                    <span>Explore Space</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
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
