import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { AvatarCustomization } from '../types';
import { useWorldStore } from '../store/worldStore';
import { useWalletStore } from '../store/walletStore';

interface CharacterAvatarProps {
  gear: AvatarCustomization;
  isStanding?: boolean;
  scale?: number;
  interactive?: boolean;
}

export const CharacterAvatar: React.FC<CharacterAvatarProps> = ({
  gear,
  isStanding = true,
  scale = 1,
  interactive = false,
}) => {
  const avatarGroup = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const torsoRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const inspectRoomObject = useWorldStore(s => s.inspectRoomObject);
  const selectProduct = useWalletStore(s => s.selectProduct);
  const unlockedRoomItems = useWorldStore(s => s.unlockedRoomItems);

  const hasSmartwatch = unlockedRoomItems.includes('prod-smartwatch') || gear.watch !== 'none';

  useFrame(({ clock, pointer }) => {
    const t = clock.getElapsedTime();

    // Natural idle breathing & subtle weight shift
    if (torsoRef.current) {
      torsoRef.current.position.y = 0.98 + Math.sin(t * 1.8) * 0.012;
      torsoRef.current.rotation.z = Math.sin(t * 0.9) * 0.008;
    }

    if (headRef.current) {
      if (interactive) {
        // Head smoothly tracks mouse pointer
        headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, pointer.x * 0.45, 0.08);
        headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, -pointer.y * 0.28, 0.08);
      } else {
        headRef.current.rotation.y = Math.sin(t * 0.7) * 0.08;
      }
    }

    // Arm natural subtle swaying
    if (leftArmRef.current && rightArmRef.current) {
      leftArmRef.current.rotation.x = Math.sin(t * 1.8) * 0.03;
      leftArmRef.current.rotation.z = -0.06 + Math.sin(t * 0.9) * 0.015;
      rightArmRef.current.rotation.x = -Math.sin(t * 1.8) * 0.03;
      rightArmRef.current.rotation.z = 0.06 - Math.sin(t * 0.9) * 0.015;
    }
  });

  // Dynamic colourful theme based on chosen jacket
  let jacketColor = '#FFFFFF';
  let jacketAccent = '#10B981';

  if (gear.jacket === 'cyber_neon') {
    jacketColor = '#E0F2FE';
    jacketAccent = '#0284C7';
  } else if (gear.jacket === 'luxury_trench') {
    jacketColor = '#FEF3C7';
    jacketAccent = '#D97706';
  } else if (gear.jacket === 'tactical_vest') {
    jacketColor = '#FFE4E6';
    jacketAccent = '#F43F5E';
  }

  const handleClick = (e: any) => {
    e.stopPropagation();
    // Focus camera on avatar
    inspectRoomObject('avatar', {
      position: [-0.4, 1.5, -1.5],
      target: [-0.4, 1.35, -2.8],
    });
  };

  return (
    <group
      ref={avatarGroup}
      scale={[scale, scale, scale]}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Interactive Selection / Hover Halo */}
      {hovered && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.45, 0.52, 32]} />
          <meshBasicMaterial color="#10B981" transparent opacity={0.8} />
        </mesh>
      )}

      {/* ==================== HEAD & STYLIZED HUMAN FEATURES ==================== */}
      <group ref={headRef} position={[0, 1.74, 0]}>
        {/* Natural Warm Human Skin Base */}
        <mesh position={[0, 0.02, 0]}>
          <capsuleGeometry args={[0.125, 0.15, 16, 24]} />
          <meshStandardMaterial color="#F5CBA7" roughness={0.45} />
        </mesh>

        {/* Sculpted Cheeks & Jaw Definition */}
        <mesh position={[0, -0.04, 0.05]}>
          <boxGeometry args={[0.16, 0.1, 0.14]} />
          <meshStandardMaterial color="#F5CBA7" roughness={0.45} />
        </mesh>

        {/* Stylized Modern Hair (Espresso Brunette with sculpted fringe) */}
        <group position={[0, 0.08, -0.01]}>
          {/* Main Hair Volume */}
          <mesh position={[0, 0.07, -0.01]}>
            <sphereGeometry args={[0.142, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
            <meshStandardMaterial color="#1E293B" roughness={0.7} />
          </mesh>
          {/* Front Swept Bangs / Fringe */}
          <mesh position={[0.02, 0.08, 0.1]} rotation={[0.25, 0.15, -0.1]}>
            <boxGeometry args={[0.14, 0.06, 0.05]} />
            <meshStandardMaterial color="#1E293B" roughness={0.7} />
          </mesh>
          <mesh position={[-0.05, 0.06, 0.11]} rotation={[0.2, -0.2, 0.1]}>
            <boxGeometry args={[0.1, 0.05, 0.04]} />
            <meshStandardMaterial color="#1E293B" roughness={0.7} />
          </mesh>
          {/* Sideburns */}
          <mesh position={[-0.128, -0.02, 0.02]}>
            <boxGeometry args={[0.02, 0.08, 0.04]} />
            <meshStandardMaterial color="#1E293B" roughness={0.7} />
          </mesh>
          <mesh position={[0.128, -0.02, 0.02]}>
            <boxGeometry args={[0.02, 0.08, 0.04]} />
            <meshStandardMaterial color="#1E293B" roughness={0.7} />
          </mesh>
        </group>

        {/* Stylized Eyes */}
        <group position={[0, 0.02, 0.118]}>
          {/* Left Eye */}
          <mesh position={[-0.045, 0, 0]}>
            <sphereGeometry args={[0.018, 16, 16]} />
            <meshStandardMaterial color="#0284C7" roughness={0.1} />
          </mesh>
          <mesh position={[-0.045, 0.005, 0.012]}>
            <sphereGeometry args={[0.006, 8, 8]} />
            <meshBasicMaterial color="#FFFFFF" />
          </mesh>
          {/* Right Eye */}
          <mesh position={[0.045, 0, 0]}>
            <sphereGeometry args={[0.018, 16, 16]} />
            <meshStandardMaterial color="#0284C7" roughness={0.1} />
          </mesh>
          <mesh position={[0.045, 0.005, 0.012]}>
            <sphereGeometry args={[0.006, 8, 8]} />
            <meshBasicMaterial color="#FFFFFF" />
          </mesh>
          {/* Eyebrows */}
          <mesh position={[-0.045, 0.03, 0.005]} rotation={[0, 0, 0.05]}>
            <boxGeometry args={[0.045, 0.008, 0.01]} />
            <meshStandardMaterial color="#0F172A" />
          </mesh>
          <mesh position={[0.045, 0.03, 0.005]} rotation={[0, 0, -0.05]}>
            <boxGeometry args={[0.045, 0.008, 0.01]} />
            <meshStandardMaterial color="#0F172A" />
          </mesh>
          {/* Subtle Confident Smile */}
          <mesh position={[0, -0.045, 0.005]}>
            <torusGeometry args={[0.02, 0.004, 8, 16, Math.PI * 0.7]} />
            <meshStandardMaterial color="#BE123C" roughness={0.5} />
          </mesh>
        </group>

        {/* High-Tech Contoured HUD Visor or Smart Specs (User Gear) */}
        {gear.accessory === 'hud_visor' && (
          <group position={[0, 0.025, 0.09]}>
            <mesh>
              <cylinderGeometry args={[0.138, 0.138, 0.055, 32, 1, false, -Math.PI * 0.42, Math.PI * 0.84]} />
              <meshStandardMaterial
                color="#06B6D4"
                emissive="#0891B2"
                emissiveIntensity={1.4}
                transparent
                opacity={0.8}
                roughness={0.05}
                metalness={0.9}
              />
            </mesh>
            {/* Luminous Reticle Line */}
            <mesh position={[0, 0, 0.138]}>
              <boxGeometry args={[0.09, 0.01, 0.01]} />
              <meshBasicMaterial color="#E0F2FE" />
            </mesh>
          </group>
        )}

        {gear.accessory === 'smart_specs' && (
          <group position={[0, 0.025, 0.125]}>
            <mesh>
              <boxGeometry args={[0.19, 0.035, 0.015]} />
              <meshStandardMaterial
                color="#F59E0B"
                emissive="#D97706"
                emissiveIntensity={1.0}
                metalness={0.9}
                roughness={0.1}
              />
            </mesh>
          </group>
        )}
      </group>

      {/* ==================== TORSO & DESIGNER STREETWEAR ==================== */}
      <group ref={torsoRef} position={[0, 0.98, 0]}>
        {/* Sculpted Neck Collar */}
        <mesh position={[0, 0.65, 0]}>
          <cylinderGeometry args={[0.09, 0.11, 0.12, 24]} />
          <meshStandardMaterial color="#F5CBA7" roughness={0.5} />
        </mesh>

        {/* Clean Modern Oversized Hoodie / Jacket */}
        <mesh position={[0, 0.34, 0]}>
          <cylinderGeometry args={[0.26, 0.21, 0.58, 24]} />
          <meshStandardMaterial
            color={jacketColor}
            metalness={0.1}
            roughness={0.35}
          />
        </mesh>

        {/* Clean Mint Piping Line */}
        <mesh position={[0, 0.34, 0.12]}>
          <planeGeometry args={[0.025, 0.52]} />
          <meshStandardMaterial
            color={jacketAccent}
            emissive={jacketAccent}
            emissiveIntensity={1.2}
          />
        </mesh>

        {/* Left Arm with Designer Streetwear Sleeve */}
        <group ref={leftArmRef} position={[-0.3, 0.52, 0]}>
          {/* Upper Arm */}
          <mesh position={[0, -0.18, 0]}>
            <capsuleGeometry args={[0.07, 0.24, 16, 16]} />
            <meshStandardMaterial color={jacketColor} roughness={0.4} />
          </mesh>
          {/* Forearm */}
          <mesh position={[0, -0.48, 0]}>
            <capsuleGeometry args={[0.065, 0.22, 16, 16]} />
            <meshStandardMaterial color={jacketColor} roughness={0.4} />
          </mesh>
          {/* Hand */}
          <mesh position={[0, -0.66, 0]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshStandardMaterial color="#F5CBA7" roughness={0.5} />
          </mesh>
        </group>

        {/* Right Arm with Wrist Watch */}
        <group ref={rightArmRef} position={[0.3, 0.52, 0]}>
          {/* Upper Arm */}
          <mesh position={[0, -0.18, 0]}>
            <capsuleGeometry args={[0.07, 0.24, 16, 16]} />
            <meshStandardMaterial color={jacketColor} roughness={0.4} />
          </mesh>
          {/* Forearm */}
          <mesh position={[0, -0.48, 0]}>
            <capsuleGeometry args={[0.065, 0.22, 16, 16]} />
            <meshStandardMaterial color={jacketColor} roughness={0.4} />
          </mesh>

          {/* Wrist Smartwatch (Visible when unlocked/equipped!) */}
          {hasSmartwatch && (
            <group
              position={[0, -0.58, 0.03]}
              onClick={(e) => {
                e.stopPropagation();
                selectProduct('prod-smartwatch');
              }}
            >
              {/* Titanium Body */}
              <mesh>
                <cylinderGeometry args={[0.048, 0.048, 0.028, 24]} />
                <meshStandardMaterial color="#0F172A" metalness={0.9} roughness={0.1} />
              </mesh>
              {/* Glowing Luminous Emerald Screen */}
              <mesh position={[0, 0, 0.016]}>
                <circleGeometry args={[0.038, 24]} />
                <meshStandardMaterial
                  color="#10B981"
                  emissive="#34D399"
                  emissiveIntensity={1.8}
                />
              </mesh>
            </group>
          )}

          {/* Hand */}
          <mesh position={[0, -0.66, 0]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshStandardMaterial color="#F5CBA7" roughness={0.5} />
          </mesh>
        </group>

        {/* Waist Band */}
        <mesh position={[0, 0.04, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.07, 24]} />
          <meshStandardMaterial color="#E2E8F0" roughness={0.6} />
        </mesh>
      </group>

      {/* ==================== LEGS & HIGH-TOP SNEAKERS ==================== */}
      {isStanding && (
        <group position={[0, 0, 0]}>
          {/* Left Leg */}
          <group position={[-0.13, 0, 0]}>
            <mesh position={[0, 0.64, 0]}>
              <capsuleGeometry args={[0.085, 0.32, 16, 16]} />
              <meshStandardMaterial color="#334155" roughness={0.7} />
            </mesh>
            <mesh position={[0, 0.26, 0]}>
              <capsuleGeometry args={[0.075, 0.3, 16, 16]} />
              <meshStandardMaterial color="#334155" roughness={0.7} />
            </mesh>
            {/* Sneaker Upper in Pure Crisp White */}
            <mesh position={[0, 0.07, 0.05]}>
              <boxGeometry args={[0.13, 0.11, 0.28]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.25} />
            </mesh>
            {/* Mint Luminous Sole */}
            <mesh position={[0, 0.018, 0.05]}>
              <boxGeometry args={[0.14, 0.035, 0.29]} />
              <meshStandardMaterial
                color="#10B981"
                emissive="#34D399"
                emissiveIntensity={1.2}
              />
            </mesh>
          </group>

          {/* Right Leg */}
          <group position={[0.13, 0, 0]}>
            <mesh position={[0, 0.64, 0]}>
              <capsuleGeometry args={[0.085, 0.32, 16, 16]} />
              <meshStandardMaterial color="#334155" roughness={0.7} />
            </mesh>
            <mesh position={[0, 0.26, 0]}>
              <capsuleGeometry args={[0.075, 0.3, 16, 16]} />
              <meshStandardMaterial color="#334155" roughness={0.7} />
            </mesh>
            {/* Sneaker Upper */}
            <mesh position={[0, 0.07, 0.05]}>
              <boxGeometry args={[0.13, 0.11, 0.28]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.25} />
            </mesh>
            {/* Mint Luminous Sole */}
            <mesh position={[0, 0.018, 0.05]}>
              <boxGeometry args={[0.14, 0.035, 0.29]} />
              <meshStandardMaterial
                color="#10B981"
                emissive="#34D399"
                emissiveIntensity={1.2}
              />
            </mesh>
          </group>
        </group>
      )}
    </group>
  );
};
