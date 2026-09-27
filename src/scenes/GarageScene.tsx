import React, { useState } from 'react';
import { Html } from '@react-three/drei';
import { Vehicle3D } from '../models/Vehicle3D';
import { useWalletStore } from '../store/walletStore';
import { calculateAffordability, formatRupees } from '../utils/affordabilityService';
import { Lock, Sparkles, Calendar, ArrowRight } from 'lucide-react';

interface GarageSceneProps {
  vehicleFilter?: 'ALL' | 'BIKES' | 'CARS' | 'SUPERCARS';
}

export const GarageScene: React.FC<GarageSceneProps> = ({ vehicleFilter = 'ALL' }) => {
  const products = useWalletStore(s => s.products);
  const freeMoney = useWalletStore(s => s.wallet.free);
  const selectProduct = useWalletStore(s => s.selectProduct);
  const selectedProductId = useWalletStore(s => s.selectedProductId);

  const [hoveredVehicleId, setHoveredVehicleId] = useState<string | null>(null);

  // Filter vehicles
  const vehicles = products.filter(p => {
    if (['bikes', 'cars', 'supercars'].includes(p.category)) {
      if (vehicleFilter === 'ALL') return true;
      if (vehicleFilter === 'BIKES') return p.category === 'bikes';
      if (vehicleFilter === 'CARS') return p.category === 'cars';
      if (vehicleFilter === 'SUPERCARS') return p.category === 'supercars';
    }
    return false;
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Garage Bright White Reflective Floor */}
      <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[32, 26]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.12} metalness={0.2} />
      </mesh>

      {/* Sunlit Architectural Glass Pavilion Back Wall */}
      <mesh position={[0, 4, -8]}>
        <planeGeometry args={[32, 8]} />
        <meshStandardMaterial color="#F1F5F9" roughness={0.3} />
      </mesh>
      {/* Wall Horizon Sky Blue Accent Strip */}
      <mesh position={[0, 3.2, -7.95]}>
        <boxGeometry args={[28, 0.04, 0.05]} />
        <meshStandardMaterial color="#0EA5E9" emissive="#38BDF8" emissiveIntensity={1.5} />
      </mesh>

      {/* Overhead High-Bay Modern White Light Frames */}
      {[-5, 0, 5].map((x, i) => (
        <group key={i} position={[x, 5.5, 0]}>
          <mesh>
            <boxGeometry args={[2.5, 0.1, 8]} />
            <meshStandardMaterial
              color="#FFFFFF"
              emissive="#F8FAFC"
              emissiveIntensity={1.2}
            />
          </mesh>
        </group>
      ))}

      {/* Bright Cheerful Natural Daylight */}
      <ambientLight intensity={0.8} color="#F8FAFC" />
      <directionalLight position={[6, 12, 6]} intensity={2.0} color="#FFFBEB" />
      <pointLight position={[0, 5, -2]} intensity={2.0} color="#BAE6FD" distance={16} />

      {/* Vehicle Bays */}
      {vehicles.map((v, index) => {
        // Arrange side by side with ample spacing
        const xOffset = (index - (vehicles.length - 1) / 2) * 5.8;
        const isHovered = hoveredVehicleId === v.id;
        const isSelected = selectedProductId === v.id;

        const calc = calculateAffordability(v.price, freeMoney);
        const isLocked = !calc.canAffordNow;

        return (
          <group
            key={v.id}
            position={[xOffset, 0, 0]}
            onClick={(e) => {
              e.stopPropagation();
              selectProduct(v.id);
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHoveredVehicleId(v.id);
            }}
            onPointerOut={() => setHoveredVehicleId(null)}
          >
            {/* Turntable Floor Pad in Clean White Ceramic */}
            <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[2.4, 48]} />
              <meshStandardMaterial
                color="#F8FAFC"
                metalness={0.2}
                roughness={0.2}
              />
            </mesh>

            {/* Glowing Floor Boundary Ring */}
            <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[2.35, 2.45, 48]} />
              <meshStandardMaterial
                color={isLocked ? '#F43F5E' : '#10B981'}
                emissive={isLocked ? '#FB7185' : '#34D399'}
                emissiveIntensity={isHovered ? 2.5 : 1.2}
              />
            </mesh>

            {/* Spotlight */}
            <spotLight
              position={[0, 6, 0]}
              target-position={[0, 0, 0]}
              intensity={isHovered ? 3.5 : 1.8}
              angle={0.6}
              penumbra={0.5}
              color={isLocked ? '#FDA4AF' : '#A7F3D0'}
            />

            {/* 3D Vehicle Model */}
            <group position={[0, 0, 0]}>
              <Vehicle3D
                modelType={v.modelType as 'bike' | 'car' | 'supercar'}
                isLocked={isLocked}
                scale={v.category === 'bikes' ? 1.4 : 1.1}
                autoRotate={isHovered || isSelected}
              />
            </group>

            {/* Floating Light Glass Specs & Savings Projection Tag */}
            <Html position={[0, 3.2, 0]} center distanceFactor={10} zIndexRange={[100, 0]}>
              <div 
                className={`transition-all duration-300 cursor-pointer pointer-events-auto ${
                  isHovered || isSelected ? 'scale-105' : 'scale-95'
                }`}
                style={{ width: '270px' }}
              >
                <div className="glass-panel p-4 rounded-3xl border border-white/80 hover:border-cyan-400 shadow-glass">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-600 font-bold">
                      {v.brand}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-rose-100 text-rose-600 border border-rose-200 font-bold">
                      <Lock className="w-2.5 h-2.5" />
                      LOCKED
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mb-2">{v.name}</h3>

                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-base font-extrabold font-mono text-slate-900">
                      {formatRupees(v.price, true)}
                    </span>
                    <span className="text-xs font-mono text-amber-600 font-bold">
                      {Math.round(calc.progress * 100)}% Saved
                    </span>
                  </div>

                  {/* Progress Line */}
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-3">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
                      style={{ width: `${Math.max(4, Math.round(calc.progress * 100))}%` }}
                    />
                  </div>

                  {/* Savings Projection pill */}
                  <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 mb-3 text-[11px] font-mono space-y-1">
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="flex items-center gap-1 text-slate-500">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        Target:
                      </span>
                      <span className="text-slate-900 font-bold">₹14,300/mo</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="flex items-center gap-1 text-slate-500">
                        <Calendar className="w-3 h-3 text-cyan-600" />
                        Est. Unlock:
                      </span>
                      <span className="text-cyan-700 font-bold">~{calc.monthsToUnlock} Months</span>
                    </div>
                  </div>

                  <button className="w-full py-2 text-xs font-bold rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white shadow-glow-cyan/20 flex items-center justify-center gap-1.5 transition-all">
                    <span>Inspect Specs</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
