import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Architecture3DProps {
  modelType: 'apartment' | 'villa';
  isLocked?: boolean;
  scale?: number;
}

export const Architecture3D: React.FC<Architecture3DProps> = ({
  modelType,
  isLocked = false,
  scale = 1,
}) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <group ref={groupRef} scale={[scale, scale, scale]}>
      {modelType === 'apartment' && (
        <group position={[0, 0, 0]}>
          {/* Base Podium / Holographic Floor Plate */}
          <mesh position={[0, -0.1, 0]}>
            <cylinderGeometry args={[2.2, 2.3, 0.15, 32]} />
            <meshStandardMaterial
              color="#0F172A"
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>

          {/* Lower Levels (floors 1-3) */}
          <mesh position={[0, 0.8, 0]}>
            <boxGeometry args={[1.8, 1.6, 1.8]} />
            <meshStandardMaterial
              color={isLocked ? '#334155' : '#1E293B'}
              metalness={0.5}
              roughness={0.3}
            />
          </mesh>

          {/* Cantilevered Glass Penthouse Sky Level */}
          <mesh position={[0.2, 2.0, 0.1]}>
            <boxGeometry args={[2.2, 0.8, 1.9]} />
            <meshStandardMaterial
              color={isLocked ? '#1E293B' : '#0369A1'}
              emissive={isLocked ? '#0F172A' : '#0284C7'}
              emissiveIntensity={isLocked ? 0.1 : 0.4}
              transparent
              opacity={0.85}
              roughness={0.1}
            />
          </mesh>

          {/* Sky Terrace & Infinity Pool */}
          <mesh position={[-0.5, 2.45, 0.4]}>
            <boxGeometry args={[0.9, 0.08, 0.7]} />
            <meshStandardMaterial
              color="#06B6D4"
              emissive="#0891B2"
              emissiveIntensity={isLocked ? 0.1 : 0.7}
            />
          </mesh>

          {/* Vertical Glass Curtain Spine */}
          <mesh position={[0, 1.6, 0.92]}>
            <planeGeometry args={[0.8, 2.8]} />
            <meshStandardMaterial
              color="#38BDF8"
              emissive="#0284C7"
              emissiveIntensity={0.25}
              transparent
              opacity={0.7}
            />
          </mesh>
        </group>
      )}

      {modelType === 'villa' && (
        <group position={[0, 0, 0]}>
          {/* Terraced Landscape Base */}
          <mesh position={[0, -0.1, 0]}>
            <boxGeometry args={[3.2, 0.2, 2.6]} />
            <meshStandardMaterial color="#0F172A" metalness={0.8} roughness={0.3} />
          </mesh>

          {/* Main Modern Living Pavilion */}
          <mesh position={[-0.4, 0.5, 0]}>
            <boxGeometry args={[1.8, 0.8, 1.6]} />
            <meshStandardMaterial
              color={isLocked ? '#334155' : '#E2E8F0'}
              roughness={0.4}
            />
          </mesh>

          {/* Upper Cantilevered Master Suite */}
          <mesh position={[0.4, 1.2, -0.2]}>
            <boxGeometry args={[1.7, 0.7, 1.5]} />
            <meshStandardMaterial
              color={isLocked ? '#1E293B' : '#0F172A'}
              metalness={0.7}
              roughness={0.2}
            />
          </mesh>

          {/* Floor-to-ceiling glass wall */}
          <mesh position={[-0.4, 0.5, 0.81]}>
            <planeGeometry args={[1.6, 0.7]} />
            <meshStandardMaterial
              color="#F59E0B"
              emissive="#D97706"
              emissiveIntensity={isLocked ? 0.1 : 0.5}
              transparent
              opacity={0.75}
            />
          </mesh>

          {/* Infinity Pool on Terrace */}
          <mesh position={[0.6, 0.05, 0.5]}>
            <boxGeometry args={[1.4, 0.1, 0.9]} />
            <meshStandardMaterial
              color="#06B6D4"
              emissive="#0891B2"
              emissiveIntensity={isLocked ? 0.1 : 0.8}
            />
          </mesh>
        </group>
      )}
    </group>
  );
};
