import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { AvatarCustomization } from '../types';

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

  useFrame(({ clock, pointer }) => {
    const t = clock.getElapsedTime();

    // Natural idle breathing & breathing posture
    if (torsoRef.current) {
      torsoRef.current.position.y = 0.98 + Math.sin(t * 1.6) * 0.015;
      torsoRef.current.rotation.z = Math.sin(t * 0.8) * 0.01; // subtle weight shift
    }

    if (headRef.current) {
      if (interactive) {
        // Head smoothly tracks mouse pointer
        headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, pointer.x * 0.5, 0.08);
        headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, -pointer.y * 0.35, 0.08);
      } else {
        headRef.current.rotation.y = Math.sin(t * 0.7) * 0.1;
      }
    }

    // Arm natural subtle swaying
    if (leftArmRef.current && rightArmRef.current) {
      leftArmRef.current.rotation.x = Math.sin(t * 1.6) * 0.04;
      leftArmRef.current.rotation.z = -0.05 + Math.sin(t * 0.8) * 0.02;
      rightArmRef.current.rotation.x = -Math.sin(t * 1.6) * 0.04;
      rightArmRef.current.rotation.z = 0.05 - Math.sin(t * 0.8) * 0.02;
    }
  });

  // Dynamic colourful theme based on chosen jacket
  let jacketColor = '#FFFFFF';
  let jacketAccent = '#10B981';
  let metallicFinish = 0.2;
  let roughnessVal = 0.3;

  if (gear.jacket === 'cyber_neon') {
    jacketColor = '#0284C7';
    jacketAccent = '#38BDF8';
    metallicFinish = 0.4;
    roughnessVal = 0.2;
  } else if (gear.jacket === 'luxury_trench') {
    jacketColor = '#E0A96D';
    jacketAccent = '#F59E0B';
    metallicFinish = 0.1;
    roughnessVal = 0.5;
  } else if (gear.jacket === 'tactical_vest') {
    jacketColor = '#F43F5E';
    jacketAccent = '#FDA4AF';
    metallicFinish = 0.3;
    roughnessVal = 0.3;
  }

  return (
    <group ref={avatarGroup} scale={[scale, scale, scale]}>
      {/* ==================== HEAD & VISOR ==================== */}
      <group ref={headRef} position={[0, 1.74, 0]}>
        {/* Contoured Head Base */}
        <mesh position={[0, 0.02, 0]}>
          <capsuleGeometry args={[0.13, 0.16, 16, 24]} />
          <meshStandardMaterial color="#E2E8F0" roughness={0.4} metalness={0.2} />
        </mesh>

        {/* Cyber Hair / Sleek Styled Undercut Cap */}
        <mesh position={[0, 0.13, -0.02]} rotation={[0.1, 0, 0]}>
          <sphereGeometry args={[0.145, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
          <meshStandardMaterial color="#0B0F17" roughness={0.8} />
        </mesh>

        {/* High-Tech Contoured HUD Visor */}
        {gear.accessory === 'hud_visor' && (
          <group position={[0, 0.03, 0.1]}>
            <mesh>
              <cylinderGeometry args={[0.142, 0.142, 0.07, 32, 1, false, -Math.PI * 0.45, Math.PI * 0.9]} />
              <meshStandardMaterial
                color="#06B6D4"
                emissive="#0891B2"
                emissiveIntensity={1.8}
                transparent
                opacity={0.88}
                roughness={0.05}
                metalness={0.9}
              />
            </mesh>
            {/* Luminous Reticle Line */}
            <mesh position={[0, 0, 0.14]}>
              <boxGeometry args={[0.12, 0.015, 0.01]} />
              <meshBasicMaterial color="#E0F2FE" />
            </mesh>
          </group>
        )}

        {gear.accessory === 'smart_specs' && (
          <group position={[0, 0.03, 0.13]}>
            <mesh>
              <boxGeometry args={[0.22, 0.04, 0.02]} />
              <meshStandardMaterial
                color="#F59E0B"
                emissive="#D97706"
                emissiveIntensity={1.2}
                metalness={0.9}
                roughness={0.1}
              />
            </mesh>
          </group>
        )}

        {/* Sleek Cyber Earpiece on Left */}
        <mesh position={[-0.145, 0.02, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.02, 16]} />
          <meshStandardMaterial color="#0284C7" emissive="#0369A1" emissiveIntensity={1.0} />
        </mesh>
      </group>

      {/* ==================== TORSO & JACKET ==================== */}
      <group ref={torsoRef} position={[0, 0.98, 0]}>
        {/* Sculpted Neck Collar */}
        <mesh position={[0, 0.65, 0]}>
          <cylinderGeometry args={[0.11, 0.14, 0.14, 24]} />
          <meshStandardMaterial color="#0A0E17" roughness={0.6} />
        </mesh>

        {/* Main Jacket Torso */}
        <mesh position={[0, 0.34, 0]}>
          <cylinderGeometry args={[0.26, 0.22, 0.58, 24]} />
          <meshStandardMaterial
            color={jacketColor}
            metalness={metallicFinish}
            roughness={roughnessVal}
          />
        </mesh>

        {/* Chest Armor Plate / High-Tech Trim */}
        <mesh position={[0, 0.42, 0.12]}>
          <boxGeometry args={[0.32, 0.26, 0.06]} />
          <meshStandardMaterial color="#080C14" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Glowing Luminescent Seam Piping */}
        <mesh position={[0, 0.34, 0.14]}>
          <planeGeometry args={[0.03, 0.5]} />
          <meshStandardMaterial
            color={jacketAccent}
            emissive={jacketAccent}
            emissiveIntensity={1.8}
          />
        </mesh>

        {/* Left Shoulder Pauldron / Pad */}
        <mesh position={[-0.28, 0.56, 0]} rotation={[0, 0, 0.2]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#0B0F19" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Right Shoulder Pauldron */}
        <mesh position={[0.28, 0.56, 0]} rotation={[0, 0, -0.2]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#0B0F19" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Left Arm with Cybernetic Sleeve */}
        <group ref={leftArmRef} position={[-0.32, 0.52, 0]}>
          {/* Upper Arm */}
          <mesh position={[0, -0.18, 0]}>
            <capsuleGeometry args={[0.07, 0.24, 16, 16]} />
            <meshStandardMaterial color={jacketColor} roughness={0.5} />
          </mesh>
          {/* Elbow Joint Disc */}
          <mesh position={[0, -0.34, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.05, 0.05, 0.08, 16]} />
            <meshStandardMaterial color="#334155" metalness={0.9} />
          </mesh>
          {/* Forearm */}
          <mesh position={[0, -0.5, 0]}>
            <capsuleGeometry args={[0.065, 0.22, 16, 16]} />
            <meshStandardMaterial color="#090D15" roughness={0.6} />
          </mesh>
          {/* Hand Glove */}
          <mesh position={[0, -0.68, 0]}>
            <boxGeometry args={[0.08, 0.11, 0.08]} />
            <meshStandardMaterial color="#1E293B" roughness={0.5} />
          </mesh>
        </group>

        {/* Right Arm with Cybernetic Sleeve & Smartwatch */}
        <group ref={rightArmRef} position={[0.32, 0.52, 0]}>
          {/* Upper Arm */}
          <mesh position={[0, -0.18, 0]}>
            <capsuleGeometry args={[0.07, 0.24, 16, 16]} />
            <meshStandardMaterial color={jacketColor} roughness={0.5} />
          </mesh>
          {/* Elbow Joint Disc */}
          <mesh position={[0, -0.34, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.05, 0.05, 0.08, 16]} />
            <meshStandardMaterial color="#334155" metalness={0.9} />
          </mesh>
          {/* Forearm */}
          <mesh position={[0, -0.5, 0]}>
            <capsuleGeometry args={[0.065, 0.22, 16, 16]} />
            <meshStandardMaterial color="#090D15" roughness={0.6} />
          </mesh>
          {/* Wrist Smartwatch */}
          {gear.watch !== 'none' && (
            <group position={[0, -0.58, 0.04]}>
              <mesh>
                <cylinderGeometry args={[0.045, 0.045, 0.03, 24]} />
                <meshStandardMaterial
                  color={gear.watch === 'chronograph_gold' ? '#F59E0B' : '#06B6D4'}
                  emissive={gear.watch === 'chronograph_gold' ? '#D97706' : '#0891B2'}
                  emissiveIntensity={1.2}
                  metalness={0.9}
                />
              </mesh>
            </group>
          )}
          {/* Hand Glove */}
          <mesh position={[0, -0.68, 0]}>
            <boxGeometry args={[0.08, 0.11, 0.08]} />
            <meshStandardMaterial color="#1E293B" roughness={0.5} />
          </mesh>
        </group>

        {/* Tactical Techwear Utility Belt */}
        <mesh position={[0, 0.04, 0]}>
          <cylinderGeometry args={[0.23, 0.23, 0.08, 24]} />
          <meshStandardMaterial color="#05070A" roughness={0.8} />
        </mesh>
        {/* Belt Buckle */}
        <mesh position={[0, 0.04, 0.22]}>
          <boxGeometry args={[0.08, 0.06, 0.03]} />
          <meshStandardMaterial color="#64748B" metalness={0.95} />
        </mesh>
      </group>

      {/* ==================== LEGS & HIGH-TOP SNEAKERS ==================== */}
      {isStanding ? (
        <group position={[0, 0, 0]}>
          {/* Left Leg */}
          <group position={[-0.14, 0, 0]}>
            {/* Thigh */}
            <mesh position={[0, 0.65, 0]}>
              <capsuleGeometry args={[0.09, 0.32, 16, 16]} />
              <meshStandardMaterial color="#334155" roughness={0.7} />
            </mesh>
            {/* Knee Armor Guard */}
            <mesh position={[0, 0.46, 0.08]}>
              <boxGeometry args={[0.14, 0.1, 0.04]} />
              <meshStandardMaterial color="#64748B" metalness={0.5} />
            </mesh>
            {/* Calf */}
            <mesh position={[0, 0.26, 0]}>
              <capsuleGeometry args={[0.08, 0.3, 16, 16]} />
              <meshStandardMaterial color="#334155" roughness={0.7} />
            </mesh>
            {/* Sneaker Upper */}
            <mesh position={[0, 0.07, 0.05]}>
              <boxGeometry args={[0.15, 0.12, 0.3]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
            </mesh>
            {/* Sneaker Neon Sole */}
            <mesh position={[0, 0.02, 0.05]}>
              <boxGeometry args={[0.16, 0.04, 0.32]} />
              <meshStandardMaterial
                color="#06B6D4"
                emissive="#0891B2"
                emissiveIntensity={1.2}
              />
            </mesh>
          </group>

          {/* Right Leg */}
          <group position={[0.14, 0, 0]}>
            {/* Thigh */}
            <mesh position={[0, 0.65, 0]}>
              <capsuleGeometry args={[0.09, 0.32, 16, 16]} />
              <meshStandardMaterial color="#334155" roughness={0.7} />
            </mesh>
            {/* Knee Armor Guard */}
            <mesh position={[0, 0.46, 0.08]}>
              <boxGeometry args={[0.14, 0.1, 0.04]} />
              <meshStandardMaterial color="#64748B" metalness={0.5} />
            </mesh>
            {/* Calf */}
            <mesh position={[0, 0.26, 0]}>
              <capsuleGeometry args={[0.08, 0.3, 16, 16]} />
              <meshStandardMaterial color="#334155" roughness={0.7} />
            </mesh>
            {/* Sneaker Upper */}
            <mesh position={[0, 0.07, 0.05]}>
              <boxGeometry args={[0.15, 0.12, 0.3]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
            </mesh>
            {/* Sneaker Neon Sole */}
            <mesh position={[0, 0.02, 0.05]}>
              <boxGeometry args={[0.16, 0.04, 0.32]} />
              <meshStandardMaterial
                color="#06B6D4"
                emissive="#0891B2"
                emissiveIntensity={1.2}
              />
            </mesh>
          </group>
        </group>
      ) : (
        /* Sitting Posture for Desk Chair */
        <group position={[0, 0.4, 0]}>
          <mesh position={[-0.14, 0.2, 0.25]} rotation={[Math.PI / 2, 0, 0]}>
            <capsuleGeometry args={[0.09, 0.38, 16, 16]} />
            <meshStandardMaterial color="#0A0E17" />
          </mesh>
          <mesh position={[0.14, 0.2, 0.25]} rotation={[Math.PI / 2, 0, 0]}>
            <capsuleGeometry args={[0.09, 0.38, 16, 16]} />
            <meshStandardMaterial color="#0A0E17" />
          </mesh>
          <mesh position={[-0.14, -0.1, 0.48]}>
            <capsuleGeometry args={[0.08, 0.36, 16, 16]} />
            <meshStandardMaterial color="#0A0E17" />
          </mesh>
          <mesh position={[0.14, -0.1, 0.48]}>
            <capsuleGeometry args={[0.08, 0.36, 16, 16]} />
            <meshStandardMaterial color="#0A0E17" />
          </mesh>
        </group>
      )}
    </group>
  );
};
