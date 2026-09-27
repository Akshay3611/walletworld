import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useWalletStore } from '../store/walletStore';
import { formatRupees } from '../utils/affordabilityService';
import { Html } from '@react-three/drei';

export const WalletScene: React.FC = () => {
  const wallet = useWalletStore(s => s.wallet);
  const ringGroupRef = useRef<THREE.Group>(null);
  const innerRingRef = useRef<THREE.Group>(null);

  const total = wallet.total || 1;
  const freePct = wallet.free / total;
  const plannedPct = wallet.planned / total;
  const lockedPct = wallet.locked / total;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ringGroupRef.current) {
      ringGroupRef.current.rotation.z = t * 0.2;
      ringGroupRef.current.position.y = 1.3 + Math.sin(t * 1.5) * 0.05;
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.z = -t * 0.3;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Bright floor grid */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[24, 24]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.2} metalness={0.1} />
      </mesh>
      <gridHelper args={[20, 20, '#0EA5E9', '#E2E8F0']} position={[0, 0.01, 0]} />

      <ambientLight intensity={0.8} color="#F8FAFC" />
      <pointLight position={[0, 5, 4]} intensity={2.2} color="#BAE6FD" distance={14} />

      {/* Floating 3D Segmented Holographic Financial Core */}
      <group ref={ringGroupRef} position={[0, 1.3, 0]}>
        {/* Outer Ring - Total Wallet Boundary in Bright Cyan */}
        <mesh>
          <torusGeometry args={[1.8, 0.04, 16, 64]} />
          <meshStandardMaterial
            color="#0EA5E9"
            emissive="#38BDF8"
            emissiveIntensity={1.5}
          />
        </mesh>

        {/* Free Money Segment (Mint Green Arc) */}
        <mesh rotation={[0, 0, 0]}>
          <torusGeometry args={[1.5, 0.08, 16, 48, Math.PI * 2 * freePct]} />
          <meshStandardMaterial
            color="#10B981"
            emissive="#34D399"
            emissiveIntensity={2.0}
          />
        </mesh>

        {/* Planned Money Segment (Warm Gold Arc) */}
        <mesh rotation={[0, 0, Math.PI * 2 * freePct]}>
          <torusGeometry args={[1.5, 0.08, 16, 48, Math.PI * 2 * plannedPct]} />
          <meshStandardMaterial
            color="#F59E0B"
            emissive="#FBBF24"
            emissiveIntensity={1.8}
          />
        </mesh>

        {/* Locked Money Segment (Coral Arc) */}
        <mesh rotation={[0, 0, Math.PI * 2 * (freePct + plannedPct)]}>
          <torusGeometry args={[1.5, 0.08, 16, 48, Math.PI * 2 * lockedPct]} />
          <meshStandardMaterial
            color="#F43F5E"
            emissive="#FB7185"
            emissiveIntensity={1.6}
          />
        </mesh>

        {/* Inner Counter-Rotating Gyroscope Ring */}
        <group ref={innerRingRef}>
          <mesh rotation={[Math.PI / 4, 0, 0]}>
            <torusGeometry args={[1.1, 0.025, 16, 48]} />
            <meshStandardMaterial
              color="#6366F1"
              emissive="#818CF8"
              emissiveIntensity={1.2}
            />
          </mesh>
        </group>

        {/* Central Holographic Sphere */}
        <mesh>
          <sphereGeometry args={[0.35, 24, 24]} />
          <meshStandardMaterial
            color="#0284C7"
            emissive="#0369A1"
            emissiveIntensity={0.6}
            wireframe
          />
        </mesh>

        {/* Center UI Data Tag */}
        <Html center distanceFactor={8}>
          <div className="text-center pointer-events-none select-none">
            <span className="text-[10px] font-mono tracking-widest text-cyan-600 font-bold uppercase block mb-0.5">
              Available World Power
            </span>
            <div className="text-3xl font-black font-mono tracking-tight text-slate-900 drop-shadow-[0_2px_10px_rgba(255,255,255,0.8)]">
              {formatRupees(wallet.free)}
            </div>
            <span className="text-[11px] font-mono text-emerald-700 font-bold bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300 inline-block mt-1 shadow-sm">
              Active Play Fuel
            </span>
          </div>
        </Html>
      </group>
    </group>
  );
};
