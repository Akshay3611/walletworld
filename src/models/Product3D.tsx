import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Product3DProps {
  modelType: string;
  isLocked?: boolean;
  isHovered?: boolean;
  scale?: number;
  autoRotate?: boolean;
}

export const Product3D: React.FC<Product3DProps> = ({
  modelType,
  isLocked = false,
  isHovered = false,
  scale = 1,
  autoRotate = true,
}) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y += delta * (isHovered ? 0.8 : 0.4);
    }
  });

  const lockedColor = isLocked ? '#64748B' : undefined;
  const lockedRoughness = isLocked ? 0.7 : 0.2;

  return (
    <group ref={groupRef} scale={[scale, scale, scale]}>
      {modelType === 'phone' && (
        <group position={[0, 0, 0]}>
          {/* Phone Body - Titanium frame */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.76, 1.55, 0.08]} />
            <meshStandardMaterial
              color={lockedColor || '#1E293B'}
              metalness={0.85}
              roughness={lockedRoughness}
            />
          </mesh>

          {/* Screen */}
          <mesh position={[0, 0, 0.042]}>
            <planeGeometry args={[0.71, 1.48]} />
            <meshStandardMaterial
              color={isLocked ? '#0F172A' : '#0284C7'}
              emissive={isLocked ? '#1E1B4B' : '#0369A1'}
              emissiveIntensity={isLocked ? 0.2 : 0.6}
              roughness={0.1}
            />
          </mesh>

          {/* Camera Bump */}
          <mesh position={[-0.2, 0.5, -0.048]}>
            <boxGeometry args={[0.3, 0.32, 0.02]} />
            <meshStandardMaterial color="#0F172A" metalness={0.9} roughness={0.3} />
          </mesh>

          {/* 3 Camera Lenses */}
          {[
            [-0.26, 0.56, -0.06],
            [-0.26, 0.44, -0.06],
            [-0.14, 0.50, -0.06],
          ].map((pos, idx) => (
            <mesh key={idx} position={pos as [number, number, number]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.045, 0.045, 0.015, 16]} />
              <meshStandardMaterial color="#020617" metalness={0.95} roughness={0.05} />
            </mesh>
          ))}
        </group>
      )}

      {modelType === 'headphones' && (
        <group position={[0, 0, 0]}>
          {/* Headband Arch */}
          <mesh position={[0, 0.25, 0]} rotation={[0, 0, 0]}>
            <torusGeometry args={[0.55, 0.04, 16, 32, Math.PI]} />
            <meshStandardMaterial
              color={lockedColor || '#1E293B'}
              metalness={0.6}
              roughness={0.3}
            />
          </mesh>

          {/* Left Ear Cup */}
          <group position={[-0.55, -0.1, 0]}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.22, 0.22, 0.12, 32]} />
              <meshStandardMaterial
                color={lockedColor || '#0F172A'}
                metalness={0.8}
                roughness={lockedRoughness}
              />
            </mesh>
            {/* Cushion */}
            <mesh position={[0.07, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <torusGeometry args={[0.16, 0.05, 16, 32]} />
              <meshStandardMaterial color="#020617" roughness={0.9} />
            </mesh>
          </group>

          {/* Right Ear Cup */}
          <group position={[0.55, -0.1, 0]}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.22, 0.22, 0.12, 32]} />
              <meshStandardMaterial
                color={lockedColor || '#0F172A'}
                metalness={0.8}
                roughness={lockedRoughness}
              />
            </mesh>
            {/* Cushion */}
            <mesh position={[-0.07, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <torusGeometry args={[0.16, 0.05, 16, 32]} />
              <meshStandardMaterial color="#020617" roughness={0.9} />
            </mesh>
          </group>

          {/* Glowing Ring Accent */}
          {!isLocked && (
            <mesh position={[0.56, -0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
              <ringGeometry args={[0.18, 0.2, 32]} />
              <meshBasicMaterial color="#10B981" />
            </mesh>
          )}
        </group>
      )}

      {modelType === 'laptop' && (
        <group position={[0, -0.2, 0]}>
          {/* Base Chassis */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1.4, 0.04, 0.95]} />
            <meshStandardMaterial
              color={lockedColor || '#334155'}
              metalness={0.85}
              roughness={0.25}
            />
          </mesh>

          {/* Keyboard Deck */}
          <mesh position={[0, 0.022, -0.05]}>
            <planeGeometry args={[1.2, 0.5]} />
            <meshStandardMaterial color="#0F172A" roughness={0.8} />
          </mesh>

          {/* Trackpad */}
          <mesh position={[0, 0.022, 0.28]}>
            <planeGeometry args={[0.42, 0.26]} />
            <meshStandardMaterial color="#475569" metalness={0.5} roughness={0.2} />
          </mesh>

          {/* Screen Display (tilted open at 115 degrees) */}
          <group position={[0, 0.02, -0.47]} rotation={[-Math.PI * 0.35, 0, 0]}>
            <mesh position={[0, 0.45, 0]}>
              <boxGeometry args={[1.4, 0.9, 0.025]} />
              <meshStandardMaterial
                color={lockedColor || '#1E293B'}
                metalness={0.85}
                roughness={0.25}
              />
            </mesh>
            {/* Screen Glass */}
            <mesh position={[0, 0.45, 0.015]}>
              <planeGeometry args={[1.32, 0.82]} />
              <meshStandardMaterial
                color={isLocked ? '#090D16' : '#1E1B4B'}
                emissive={isLocked ? '#0F172A' : '#4338CA'}
                emissiveIntensity={isLocked ? 0.2 : 0.7}
              />
            </mesh>
          </group>
        </group>
      )}

      {modelType === 'watch' && (
        <group position={[0, 0, 0]}>
          {/* Watch Case */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.42, 0.42, 0.12, 32]} />
            <meshStandardMaterial
              color={lockedColor || '#0F172A'}
              metalness={0.9}
              roughness={0.15}
            />
          </mesh>

          {/* Bezel Ring */}
          <mesh position={[0, 0, 0.065]} rotation={[0, 0, 0]}>
            <ringGeometry args={[0.34, 0.42, 32]} />
            <meshStandardMaterial
              color={isLocked ? '#64748B' : '#10B981'}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>

          {/* Screen Dial */}
          <mesh position={[0, 0, 0.063]}>
            <circleGeometry args={[0.34, 32]} />
            <meshStandardMaterial
              color={isLocked ? '#0F172A' : '#022C22'}
              emissive={isLocked ? '#1E293B' : '#059669'}
              emissiveIntensity={isLocked ? 0.2 : 0.8}
            />
          </mesh>

          {/* Cyber Strap Top and Bottom */}
          <mesh position={[0, 0.55, 0]}>
            <boxGeometry args={[0.3, 0.4, 0.05]} />
            <meshStandardMaterial color="#1E293B" roughness={0.7} />
          </mesh>
          <mesh position={[0, -0.55, 0]}>
            <boxGeometry args={[0.3, 0.4, 0.05]} />
            <meshStandardMaterial color="#1E293B" roughness={0.7} />
          </mesh>
        </group>
      )}

      {modelType === 'console' && (
        <group position={[0, 0, 0]}>
          {/* Main Dark Core */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.3, 1.3, 0.7]} />
            <meshStandardMaterial color="#020617" roughness={0.8} />
          </mesh>

          {/* White Outer Curved Shell Left */}
          <mesh position={[-0.18, 0, 0]} rotation={[0, 0, -0.05]}>
            <boxGeometry args={[0.04, 1.42, 0.76]} />
            <meshStandardMaterial
              color={lockedColor || '#F8FAFC'}
              roughness={0.3}
              metalness={0.1}
            />
          </mesh>

          {/* White Outer Curved Shell Right */}
          <mesh position={[0.18, 0, 0]} rotation={[0, 0, 0.05]}>
            <boxGeometry args={[0.04, 1.42, 0.76]} />
            <meshStandardMaterial
              color={lockedColor || '#F8FAFC'}
              roughness={0.3}
              metalness={0.1}
            />
          </mesh>

          {/* LED Blue Fin Glow */}
          <mesh position={[-0.14, 0.3, 0.36]}>
            <boxGeometry args={[0.02, 0.7, 0.02]} />
            <meshStandardMaterial
              color="#38BDF8"
              emissive="#0284C7"
              emissiveIntensity={isLocked ? 0.2 : 1.2}
            />
          </mesh>
        </group>
      )}

      {modelType === 'luxury_watch' && (
        <group position={[0, 0, 0]}>
          {/* Gold Case */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.46, 0.46, 0.14, 32]} />
            <meshStandardMaterial
              color={lockedColor || '#F59E0B'}
              metalness={0.95}
              roughness={0.1}
            />
          </mesh>
          {/* Gold Dial Face */}
          <mesh position={[0, 0, 0.075]}>
            <circleGeometry args={[0.38, 32]} />
            <meshStandardMaterial color="#1E293B" metalness={0.9} roughness={0.1} />
          </mesh>
          {/* Gold Bracelet */}
          <mesh position={[0, 0.58, 0]}>
            <boxGeometry args={[0.32, 0.45, 0.08]} />
            <meshStandardMaterial
              color={lockedColor || '#D97706'}
              metalness={0.95}
              roughness={0.15}
            />
          </mesh>
          <mesh position={[0, -0.58, 0]}>
            <boxGeometry args={[0.32, 0.45, 0.08]} />
            <meshStandardMaterial
              color={lockedColor || '#D97706'}
              metalness={0.95}
              roughness={0.15}
            />
          </mesh>
        </group>
      )}

      {modelType === 'camera' && (
        <group position={[0, 0, 0]}>
          {/* Camera Body */}
          <mesh>
            <boxGeometry args={[1.1, 0.75, 0.45]} />
            <meshStandardMaterial
              color={lockedColor || '#1E293B'}
              metalness={0.7}
              roughness={0.3}
            />
          </mesh>
          {/* Top Plate */}
          <mesh position={[0, 0.39, 0]}>
            <boxGeometry args={[1.08, 0.08, 0.43]} />
            <meshStandardMaterial color="#64748B" metalness={0.9} roughness={0.1} />
          </mesh>
          {/* Prime Lens Cylinder */}
          <mesh position={[0.15, 0, 0.32]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.26, 0.28, 0.38, 32]} />
            <meshStandardMaterial
              color={lockedColor || '#0F172A'}
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
          {/* Front Glass Element */}
          <mesh position={[0.15, 0, 0.52]}>
            <circleGeometry args={[0.22, 32]} />
            <meshStandardMaterial
              color="#0284C7"
              emissive="#0369A1"
              emissiveIntensity={0.3}
              roughness={0.05}
            />
          </mesh>
        </group>
      )}

      {modelType === 'sneaker' && (
        <group position={[0, -0.1, 0]} rotation={[0, Math.PI * 0.2, 0]}>
          {/* Sole */}
          <mesh position={[0, -0.15, 0]}>
            <boxGeometry args={[0.55, 0.12, 1.4]} />
            <meshStandardMaterial
              color={isLocked ? '#334155' : '#06B6D4'}
              emissive={isLocked ? '#000000' : '#0891B2'}
              emissiveIntensity={isLocked ? 0 : 0.6}
            />
          </mesh>
          {/* Upper Body */}
          <mesh position={[0, 0.05, -0.1]}>
            <boxGeometry args={[0.48, 0.35, 1.0]} />
            <meshStandardMaterial
              color={lockedColor || '#E2E8F0'}
              roughness={0.4}
              metalness={0.2}
            />
          </mesh>
          {/* High Top Ankle Collar */}
          <mesh position={[0, 0.25, -0.35]}>
            <boxGeometry args={[0.44, 0.4, 0.45]} />
            <meshStandardMaterial color="#1E293B" roughness={0.6} />
          </mesh>
        </group>
      )}
    </group>
  );
};
