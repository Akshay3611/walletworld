import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CharacterAvatar } from '../models/CharacterAvatar';
import { useWalletStore } from '../store/walletStore';

export const AvatarScene: React.FC = () => {
  const avatarGear = useWalletStore(s => s.avatarGear);
  const scannerRingsRef = useRef<THREE.Group>(null);
  const scanBeamRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (scannerRingsRef.current) {
      scannerRingsRef.current.rotation.y = t * 0.5;
    }
    if (scanBeamRef.current) {
      scanBeamRef.current.position.y = 1.0 + Math.sin(t * 2.0) * 0.9;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Bright Studio White Floor */}
      <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[22, 22]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.1} metalness={0.15} />
      </mesh>

      {/* Circular High-Tech Ceramic Scanner Podium */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[1.6, 1.8, 0.2, 36]} />
        <meshStandardMaterial color="#F8FAFC" metalness={0.2} roughness={0.2} />
      </mesh>

      {/* Rotating Concentric Rings in Cyan & Mint */}
      <group ref={scannerRingsRef} position={[0, 0.21, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.3, 1.45, 36]} />
          <meshStandardMaterial
            color="#0EA5E9"
            emissive="#38BDF8"
            emissiveIntensity={1.8}
          />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.9, 0.96, 36]} />
          <meshStandardMaterial
            color="#10B981"
            emissive="#34D399"
            emissiveIntensity={1.5}
          />
        </mesh>
      </group>

      {/* Vertical Holographic Scan Laser Ring */}
      <mesh ref={scanBeamRef} position={[0, 1.0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.05, 1.25, 32]} />
        <meshBasicMaterial color="#38BDF8" transparent opacity={0.2} />
      </mesh>

      {/* Bright Studio Lights */}
      <ambientLight intensity={0.8} color="#F8FAFC" />
      <spotLight
        position={[0, 6, 2]}
        target-position={[0, 1, 0]}
        intensity={3.0}
        angle={0.6}
        penumbra={0.4}
        color="#FFFFFF"
      />
      <spotLight
        position={[-3, 3, -2]}
        target-position={[0, 1, 0]}
        intensity={2.0}
        color="#38BDF8"
      />
      <pointLight position={[3, 2, 2]} intensity={1.5} color="#FBBF24" distance={8} />

      {/* Character Avatar */}
      <group position={[0, 0.2, 0]}>
        <CharacterAvatar
          gear={avatarGear}
          isStanding={true}
          interactive={true}
          scale={1.15}
        />
      </group>
    </group>
  );
};
