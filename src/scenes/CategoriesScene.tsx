import React, { useState } from 'react';
import { Html } from '@react-three/drei';
import { Product3D } from '../models/Product3D';
import { Vehicle3D } from '../models/Vehicle3D';
import { Architecture3D } from '../models/Architecture3D';
import { useWalletStore } from '../store/walletStore';
import { ArrowRight } from 'lucide-react';

export const CategoriesScene: React.FC = () => {
  const setScreen = useWalletStore(s => s.setScreen);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // 6 Primary 3D category hubs in a circular orbital display
  const primaryCategories = [
    { id: 'phones', name: 'Smart Devices', screen: 'shop', modelType: 'phone', kind: 'product', color: '#0EA5E9' },
    { id: 'audio', name: 'Acoustics & Sound', screen: 'shop', modelType: 'headphones', kind: 'product', color: '#10B981' },
    { id: 'gaming', name: 'Gaming Rig & Tech', screen: 'shop', modelType: 'console', kind: 'product', color: '#8B5CF6' },
    { id: 'bikes', name: 'Superbikes', screen: 'garage', modelType: 'bike', kind: 'vehicle', color: '#F59E0B' },
    { id: 'cars', name: 'Exotic Vehicles', screen: 'garage', modelType: 'supercar', kind: 'vehicle', color: '#F43F5E' },
    { id: 'apartments', name: 'Architecture & Land', screen: 'home', modelType: 'apartment', kind: 'architecture', color: '#6366F1' },
  ];

  const radius = 5.2;

  return (
    <group position={[0, 0, 0]}>
      {/* Showroom floor */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[26, 26]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.15} metalness={0.1} />
      </mesh>

      <ambientLight intensity={0.8} color="#F8FAFC" />
      <pointLight position={[0, 6, 0]} intensity={2.2} color="#BAE6FD" distance={16} />

      {/* Orbit ring on floor */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius - 0.03, radius + 0.03, 64]} />
        <meshBasicMaterial color="#E2E8F0" />
      </mesh>

      {/* Category Pods */}
      {primaryCategories.map((cat, i) => {
        const angle = (i / primaryCategories.length) * Math.PI * 2;
        const x = Math.sin(angle) * radius;
        const z = -Math.cos(angle) * radius * 0.65;
        const isHovered = hoveredIndex === i;

        return (
          <group
            key={cat.id}
            position={[x, 0, z]}
            onClick={() => setScreen(cat.screen as any)}
            onPointerOver={() => setHoveredIndex(i)}
            onPointerOut={() => setHoveredIndex(null)}
          >
            {/* White Base platform */}
            <mesh position={[0, 0.1, 0]}>
              <cylinderGeometry args={[0.9, 1.0, 0.2, 24]} />
              <meshStandardMaterial
                color="#F8FAFC"
                metalness={0.2}
                roughness={0.2}
              />
            </mesh>
            <mesh position={[0, 0.21, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.82, 0.9, 24]} />
              <meshStandardMaterial
                color={cat.color}
                emissive={cat.color}
                emissiveIntensity={isHovered ? 2.5 : 1.2}
              />
            </mesh>

            {/* 3D Mini Model Representation */}
            <group position={[0, 0.8, 0]}>
              {cat.kind === 'product' && (
                <Product3D
                  modelType={cat.modelType}
                  scale={0.7}
                  isHovered={isHovered}
                  autoRotate={true}
                />
              )}
              {cat.kind === 'vehicle' && (
                <Vehicle3D
                  modelType={cat.modelType as any}
                  scale={0.5}
                  autoRotate={true}
                />
              )}
              {cat.kind === 'architecture' && (
                <Architecture3D
                  modelType={cat.modelType as any}
                  scale={0.5}
                />
              )}
            </group>

            {/* Floating Label */}
            <Html position={[0, 1.85, 0]} center distanceFactor={8}>
              <div 
                className={`transition-all duration-300 cursor-pointer pointer-events-auto select-none ${
                  isHovered ? 'scale-110 -translate-y-1' : 'scale-95'
                }`}
                style={{ width: '180px' }}
              >
                <div className="glass-panel p-3 rounded-2xl border border-white/80 hover:border-indigo-400 text-center shadow-glass">
                  <span className="text-xs font-bold text-slate-900 block mb-0.5">
                    {cat.name}
                  </span>
                  <span className="text-[10px] font-mono text-indigo-600 font-bold flex items-center justify-center gap-1">
                    Enter Sector
                    <ArrowRight className="w-2.5 h-2.5" />
                  </span>
                </div>
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
};
