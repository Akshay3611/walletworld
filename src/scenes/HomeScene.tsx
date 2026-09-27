import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshReflectorMaterial, Html } from '@react-three/drei';
import * as THREE from 'three';
import { CharacterAvatar } from '../models/CharacterAvatar';
import { useWalletStore } from '../store/walletStore';
import { useWorldStore } from '../store/worldStore';
import { calculateAffordability } from '../utils/affordabilityService';

export const HomeScene: React.FC = () => {
  const avatarGear = useWalletStore((s) => s.avatarGear);
  const selectedProductId = useWalletStore((s) => s.selectedProductId);
  const selectProduct = useWalletStore((s) => s.selectProduct);
  const freeMoney = useWalletStore((s) => s.wallet.free);
  const products = useWalletStore((s) => s.products);

  const unlockedRoomItems = useWorldStore((s) => s.unlockedRoomItems);
  const isCelebratingUnlock = useWorldStore((s) => s.isCelebratingUnlock);
  const setHasInteracted = useWorldStore((s) => s.setHasInteracted);

  const cityGroup = useRef<THREE.Group>(null);
  const trafficGroup = useRef<THREE.Group>(null);
  const celebrationParticlesRef = useRef<THREE.Group>(null);

  // In-room interactive object groups
  const macbookGroupRef = useRef<THREE.Group>(null);
  const watchGroupRef = useRef<THREE.Group>(null);
  const headphonesGroupRef = useRef<THREE.Group>(null);

  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Products
  const macbook = products.find((p) => p.id === 'prod-macbookpro');
  const smartwatch = products.find((p) => p.id === 'prod-smartwatch');
  const headphones = products.find((p) => p.id === 'prod-sony-wh1000xm6');

  const macbookCalc = calculateAffordability(macbook?.price || 189900, freeMoney);
  const smartwatchCalc = calculateAffordability(smartwatch?.price || 12990, freeMoney);
  const headphonesCalc = calculateAffordability(headphones?.price || 29990, freeMoney);

  const isSmartwatchOwned = unlockedRoomItems.includes('prod-smartwatch');
  const isHeadphonesOwned = unlockedRoomItems.includes('prod-sony-wh1000xm6');
  const isMacbookOwned = unlockedRoomItems.includes('prod-macbookpro');

  // Dynamic light & colourful financial UI texture for the curved monitor
  const [monitorTexture, setMonitorTexture] = useState<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 384;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Crisp white & light glass background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, 1024, 384);

      // Soft colorful pastel grid
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.08)';
      ctx.lineWidth = 1;
      for (let x = 0; x < 1024; x += 35) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 384);
        ctx.stroke();
      }
      for (let y = 0; y < 384; y += 35) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(1024, y);
        ctx.stroke();
      }

      // Title & Telemetry Header
      ctx.fillStyle = '#6366F1';
      ctx.font = 'bold 22px Inter, sans-serif';
      ctx.fillText('FINANCIAL WORLD // LIVE LIQUIDITY ENGINE', 30, 42);

      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 38px Inter, sans-serif';
      ctx.fillText(`₹${(38420).toLocaleString('en-IN')}.00`, 30, 95);

      ctx.fillStyle = '#10B981';
      ctx.font = '600 16px Inter, sans-serif';
      ctx.fillText('▲ +14.2% ALLOCATED ASSETS | LEVEL 12 BUILDER', 30, 125);

      // Financial Candlestick Chart (Emerald & Coral bars)
      const barWidth = 14;
      const spacing = 22;
      const startX = 30;
      const baseY = 320;
      const heights = [70, 95, 55, 120, 105, 150, 135, 170, 190, 160, 205, 230, 220, 250, 270];

      heights.forEach((h, i) => {
        const x = startX + i * spacing;
        const isUp = i === 0 || h >= heights[i - 1];
        ctx.fillStyle = isUp ? '#10B981' : '#F43F5E';

        // Candle wick
        ctx.fillRect(x + barWidth / 2 - 1, baseY - h - 15, 2, h + 30);
        // Candle body
        ctx.fillRect(x, baseY - h, barWidth, h * 0.7);
      });

      // Vibrant Indigo Wave Line Chart
      ctx.strokeStyle = '#6366F1';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(startX, baseY - heights[0] * 0.85);
      heights.forEach((h, i) => {
        ctx.lineTo(startX + i * spacing + barWidth / 2, baseY - h * 0.85);
      });
      ctx.stroke();

      // Right Side Stats Card in Crisp Frosted White
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(440, 30, 550, 320);
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.2)';
      ctx.lineWidth = 2;
      ctx.strokeRect(440, 30, 550, 320);

      ctx.fillStyle = '#1E293B';
      ctx.font = 'bold 18px Inter, sans-serif';
      ctx.fillText('WORLD ASSET DISTRIBUTION', 465, 68);

      // Segment bars with vibrant colourful tokens
      const items = [
        { label: 'FREE CAPITAL', val: '₹14,200 (37%)', col: '#10B981', w: 180 },
        { label: 'PLANNED ACCUMULATION', val: '₹9,800 (26%)', col: '#F59E0B', w: 125 },
        { label: 'LOCKED DEDUCTIONS', val: '₹14,420 (37%)', col: '#F43F5E', w: 180 },
      ];

      items.forEach((it, idx) => {
        const y = 115 + idx * 70;
        ctx.fillStyle = '#64748B';
        ctx.font = '600 13px Inter, sans-serif';
        ctx.fillText(it.label, 465, y);
        ctx.fillStyle = it.col;
        ctx.font = 'bold 16px Inter, sans-serif';
        ctx.fillText(it.val, 790, y);

        // Bar bg
        ctx.fillStyle = '#E2E8F0';
        ctx.fillRect(465, y + 10, 500, 10);
        // Bar fill
        ctx.fillStyle = it.col;
        ctx.fillRect(465, y + 10, it.w * 2.75, 10);
      });

      const tex = new THREE.CanvasTexture(canvas);
      tex.needsUpdate = true;
      setMonitorTexture(tex);
    }
  }, []);

  // Multi-layered stylized city skyline (distant atmospheric silhouettes + midground high-rises)
  const skylineTowers = useMemo(() => {
    const list = [];
    const count = 48;
    const bodyColors = ['#FFFFFF', '#E0F2FE', '#EDE9FE', '#FEF3C7', '#DCFCE7'];
    const trimColors = ['#0EA5E9', '#10B981', '#F59E0B', '#6366F1'];

    for (let i = 0; i < count; i++) {
      const isDistant = i < 18;
      const x = (Math.random() - 0.5) * 60;
      const z = isDistant ? -22 - Math.random() * 12 : -12 - Math.random() * 8;
      const width = isDistant ? 2.5 + Math.random() * 3.5 : 1.8 + Math.random() * 2.6;
      const depth = width;
      const height = isDistant ? 14 + Math.random() * 16 : 8 + Math.random() * 14;
      const bodyColor = isDistant ? '#CBD5E1' : bodyColors[i % bodyColors.length];
      const trimColor = trimColors[i % trimColors.length];
      const opacity = isDistant ? 0.65 : 0.95;
      list.push({ x, z, width, depth, height, bodyColor, trimColor, opacity, isDistant });
    }
    return list;
  }, []);

  // Aerial traffic lights
  const trafficTrails = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      y: 2.5 + (i % 4) * 1.6,
      z: -14 - i * 1.5,
      speed: 1.6 + Math.random() * 2.0,
      color: i % 2 === 0 ? '#38BDF8' : '#F43F5E',
      offset: Math.random() * 40 - 20,
    }));
  }, []);

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();

    // Subtle aerial traffic motion
    if (trafficGroup.current) {
      trafficGroup.current.children.forEach((child, index) => {
        const car = trafficTrails[index];
        if (car) {
          child.position.x = ((car.offset + t * car.speed) % 55) - 27.5;
        }
      });
    }

    // 1. MACBOOK PRO INTERACTIVE ANIMATION (Hover bobbing & Inspection showcase)
    if (macbookGroupRef.current) {
      const isSelected = selectedProductId === 'prod-macbookpro';
      const isHovered = hoveredItem === 'laptop';

      // Subtle scale transition
      const targetScale = isSelected ? 1.04 : isHovered ? 1.05 : 1.0;
      macbookGroupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 8);

      // Subtle vertical bob on hover
      if (isHovered && !isSelected) {
        macbookGroupRef.current.position.y = 1.08 + Math.sin(t * 3.5) * 0.012;
      } else {
        macbookGroupRef.current.position.y = 1.08;
      }

      // Smooth slow rotation when selected
      if (isSelected) {
        macbookGroupRef.current.rotation.y = 0.35 + Math.sin(t * 1.2) * 0.06;
      } else {
        macbookGroupRef.current.rotation.y = 0.35;
      }
    }

    // 2. SMARTWATCH INTERACTIVE ANIMATION
    if (watchGroupRef.current) {
      const isSelected = selectedProductId === 'prod-smartwatch';
      const isHovered = hoveredItem === 'watch';

      const targetScale = isSelected ? 1.05 : isHovered ? 1.08 : 1.0;
      watchGroupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 8);

      if (isHovered && !isSelected) {
        watchGroupRef.current.position.y = 1.08 + Math.sin(t * 4.0) * 0.015;
      } else {
        watchGroupRef.current.position.y = 1.08;
      }

      // Turn-table showcase rotation when inspected
      if (isSelected) {
        watchGroupRef.current.rotation.y += delta * 0.8;
      }
    }

    // 3. HEADPHONES INTERACTIVE ANIMATION
    if (headphonesGroupRef.current) {
      const isSelected = selectedProductId === 'prod-sony-wh1000xm6';
      const isHovered = hoveredItem === 'headphones';

      const targetScale = isSelected ? 1.05 : isHovered ? 1.08 : 1.0;
      headphonesGroupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 8);

      if (isHovered && !isSelected) {
        headphonesGroupRef.current.position.y = 1.08 + Math.sin(t * 3.8) * 0.012;
      } else {
        headphonesGroupRef.current.position.y = 1.08;
      }

      if (isSelected) {
        headphonesGroupRef.current.rotation.y += delta * 0.7;
      }
    }

    // Celebration particles ascend
    if (celebrationParticlesRef.current && isCelebratingUnlock) {
      celebrationParticlesRef.current.children.forEach((p, idx) => {
        p.position.y += delta * 0.65;
        if (p.position.y > 2.6) {
          p.position.y = 1.1;
        }
        p.rotation.y += delta * (idx % 2 === 0 ? 1.2 : -1.2);
      });
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* ===================== BRIGHT ATMOSPHERIC SKY & HORIZON ===================== */}
      {/* Soft Gradient Sky Dome Plane */}
      <mesh position={[0, 11, -30]}>
        <planeGeometry args={[84, 52]} />
        <meshBasicMaterial color="#E0F2FE" />
      </mesh>

      {/* Sunlit Golden Horizon Glow */}
      <mesh position={[0, 4, -29.8]}>
        <planeGeometry args={[84, 18]} />
        <meshBasicMaterial color="#FEF3C7" transparent opacity={0.45} />
      </mesh>

      {/* Sun Disk */}
      <mesh position={[14, 18, -29.5]}>
        <circleGeometry args={[4.2, 32]} />
        <meshBasicMaterial color="#FEF08A" />
      </mesh>

      {/* Soft Sunlit Clouds */}
      {[
        [-16, 15, -25, 4.0],
        [-6, 17, -26, 4.8],
        [7, 14, -24, 3.4],
        [19, 16, -27, 5.2],
      ].map((pos, idx) => (
        <mesh key={idx} position={[pos[0], pos[1], pos[2]]}>
          <capsuleGeometry args={[pos[3] * 0.45, pos[3], 16, 16]} />
          <meshBasicMaterial color="#FFFFFF" transparent opacity={0.88} />
        </mesh>
      ))}

      {/* Layered City Skyline */}
      <group ref={cityGroup}>
        {skylineTowers.map((t, idx) => (
          <group key={idx} position={[t.x, t.height / 2 - 4.2, t.z]}>
            <mesh>
              <boxGeometry args={[t.width, t.height, t.depth]} />
              <meshStandardMaterial
                color={t.bodyColor}
                roughness={0.45}
                metalness={0.1}
                transparent={t.isDistant}
                opacity={t.opacity}
              />
            </mesh>
            {/* Window trim for midground towers */}
            {!t.isDistant && (
              <mesh position={[0, 0, t.depth / 2 + 0.02]}>
                <planeGeometry args={[t.width * 0.88, t.height * 0.85]} />
                <meshStandardMaterial
                  color={t.trimColor}
                  transparent
                  opacity={0.25}
                  wireframe
                />
              </mesh>
            )}
          </group>
        ))}
      </group>

      {/* Distant aerial traffic trails */}
      <group ref={trafficGroup}>
        {trafficTrails.map((car, idx) => (
          <mesh key={idx} position={[car.offset, car.y, car.z]}>
            <boxGeometry args={[1.1, 0.05, 0.05]} />
            <meshStandardMaterial color={car.color} emissive={car.color} emissiveIntensity={1.8} />
          </mesh>
        ))}
      </group>

      {/* ===================== ARCHITECTURE & FLOOR ===================== */}
      {/* Light Warm-Gray Polished Terrazzo Floor with Soft Subtle Reflection */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[16, 14]} />
        <MeshReflectorMaterial
          blur={[180, 60]}
          resolution={512}
          mirror={0.22} // Subtle, grounded, NOT mirror-like
          mixBlur={1}
          mixStrength={3.5}
          roughness={0.42}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#E8E4DF" // Light warm-gray polished stone
          metalness={0.08}
        />
      </mesh>

      {/* Subtle Architectural Floor Tile Inset Lines */}
      {[-3.5, 0, 3.5].map((xPos, idx) => (
        <mesh key={idx} position={[xPos, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.02, 14]} />
          <meshStandardMaterial color="#D1D5DB" roughness={0.9} />
        </mesh>
      ))}

      {/* Crisp Ceiling with Inset Light Channels */}
      <mesh position={[0, 4.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[16, 14]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.95} />
      </mesh>

      {/* Gallery Left Wall in Clean Off-White */}
      <mesh position={[-6.2, 2.1, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[14, 4.2]} />
        <meshStandardMaterial color="#F8FAFC" roughness={0.75} />
      </mesh>

      {/* Right Wall with Natural Scandinavian Bleached Oak Slats & LED Cove */}
      <group position={[6.1, 2.1, -1.8]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh>
          <planeGeometry args={[8, 4.2]} />
          <meshStandardMaterial color="#F1F5F9" roughness={0.8} />
        </mesh>
        {Array.from({ length: 18 }).map((_, i) => (
          <mesh key={i} position={[-3.6 + i * 0.42, 0, 0.02]}>
            <boxGeometry args={[0.18, 4.1, 0.03]} />
            <meshStandardMaterial color="#E2D9CC" roughness={0.45} />
          </mesh>
        ))}
        {/* Soft Golden LED Cove Light Strip */}
        <mesh position={[0, 2.05, 0.04]}>
          <boxGeometry args={[7.6, 0.03, 0.02]} />
          <meshStandardMaterial color="#F59E0B" emissive="#FBBF24" emissiveIntensity={1.4} />
        </mesh>
      </group>

      {/* Floor-to-Ceiling Panoramic Window Frame in Clean Architectural Bevels */}
      <mesh position={[0, 0.45, -5.2]}>
        <boxGeometry args={[14, 0.9, 0.28]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.25} />
      </mesh>
      <mesh position={[-5.4, 2.3, -5.2]}>
        <boxGeometry args={[1.8, 3.8, 0.28]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.25} />
      </mesh>
      <mesh position={[5.4, 2.3, -5.2]}>
        <boxGeometry args={[1.8, 3.8, 0.28]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.25} />
      </mesh>
      <mesh position={[0, 3.95, -5.2]}>
        <boxGeometry args={[14, 0.6, 0.28]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.25} />
      </mesh>

      {/* Crystal Clear Glass Pane */}
      <mesh position={[0, 2.4, -5.15]}>
        <planeGeometry args={[9.2, 3.1]} />
        <meshStandardMaterial
          color="#BAE6FD"
          transparent
          opacity={0.12}
          roughness={0.04}
          metalness={0.8}
        />
      </mesh>

      {/* Window Sill Teal Accent Line */}
      <mesh position={[0, 0.91, -5.08]}>
        <boxGeometry args={[9.2, 0.02, 0.04]} />
        <meshStandardMaterial color="#10B981" emissive="#34D399" emissiveIntensity={1.2} />
      </mesh>

      {/* ===================== EXECUTIVE DESK & WORKSTATION ===================== */}
      <group position={[-2.6, 0, -2.5]}>
        {/* Birch Wood Top */}
        <mesh position={[0, 1.05, 0]}>
          <boxGeometry args={[2.7, 0.06, 1.25]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.25} metalness={0.05} />
        </mesh>
        {/* Desk Sled Legs */}
        <mesh position={[-1.25, 0.52, 0]}>
          <boxGeometry args={[0.06, 1.0, 1.15]} />
          <meshStandardMaterial color="#D7C4B7" roughness={0.5} />
        </mesh>
        <mesh position={[1.25, 0.52, 0]}>
          <boxGeometry args={[0.06, 1.0, 1.15]} />
          <meshStandardMaterial color="#D7C4B7" roughness={0.5} />
        </mesh>

        {/* Charcoal Felt Desk Mat */}
        <mesh position={[0, 1.081, 0.08]}>
          <boxGeometry args={[1.5, 0.005, 0.65]} />
          <meshStandardMaterial color="#334155" roughness={0.9} />
        </mesh>

        {/* Ultra-Wide Curved Silver Studio Display */}
        <group position={[0, 1.48, -0.25]}>
          <mesh position={[0, -0.25, 0]}>
            <cylinderGeometry args={[0.035, 0.035, 0.4, 16]} />
            <meshStandardMaterial color="#E2E8F0" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[0, -0.42, 0.05]}>
            <boxGeometry args={[0.45, 0.02, 0.3]} />
            <meshStandardMaterial color="#E2E8F0" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh>
            <boxGeometry args={[1.9, 0.72, 0.06]} />
            <meshStandardMaterial color="#F8FAFC" metalness={0.6} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0, 0.032]}>
            <planeGeometry args={[1.84, 0.66]} />
            {monitorTexture ? (
              <meshBasicMaterial map={monitorTexture} />
            ) : (
              <meshStandardMaterial color="#FFFFFF" />
            )}
          </mesh>
        </group>

        {/* Nordic Minimalist Desk Lamp with Warm Glow */}
        <group position={[1.1, 1.08, -0.3]}>
          <mesh position={[0, 0.01, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.02, 24]} />
            <meshStandardMaterial color="#F59E0B" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[-0.04, 0.22, 0]} rotation={[0, 0, -0.25]}>
            <cylinderGeometry args={[0.012, 0.012, 0.42, 16]} />
            <meshStandardMaterial color="#F59E0B" metalness={0.8} />
          </mesh>
          <mesh position={[-0.12, 0.38, 0.05]} rotation={[0.4, 0, -0.2]}>
            <coneGeometry args={[0.08, 0.12, 24]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
          </mesh>
          {/* Cozy warm lamp light pool */}
          <pointLight position={[-0.14, 0.32, 0.05]} intensity={1.2} distance={2.4} color="#FEF08A" />
        </group>

        {/* Stack of 2 Hardcover Design Books on Desk Corner */}
        <group position={[1.05, 1.08, 0.3]} rotation={[0, -0.15, 0]}>
          <mesh position={[0, 0.018, 0]}>
            <boxGeometry args={[0.26, 0.032, 0.35]} />
            <meshStandardMaterial color="#475569" roughness={0.6} />
          </mesh>
          <mesh position={[0.01, 0.045, 0]} rotation={[0, 0.08, 0]}>
            <boxGeometry args={[0.24, 0.025, 0.32]} />
            <meshStandardMaterial color="#10B981" roughness={0.5} />
          </mesh>
        </group>

        {/* Minimalist Ceramic Vase with Green Plant */}
        <group position={[-1.15, 1.08, 0.38]}>
          <mesh position={[0, 0.08, 0]}>
            <cylinderGeometry args={[0.05, 0.07, 0.16, 24]} />
            <meshStandardMaterial color="#F8FAFC" roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.2, 0]}>
            <sphereGeometry args={[0.09, 16, 16]} />
            <meshStandardMaterial color="#10B981" roughness={0.7} />
          </mesh>
        </group>

        {/* ================= INTERACTIVE 3D OBJECT 1: MACBOOK PRO 16" ================= */}
        <group
          ref={macbookGroupRef}
          position={[-0.75, 1.08, 0.15]}
          rotation={[0, 0.35, 0]}
          onClick={(e) => {
            e.stopPropagation();
            setHasInteracted(true);
            selectProduct('prod-macbookpro');
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHoveredItem('laptop');
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            setHoveredItem(null);
            document.body.style.cursor = 'auto';
          }}
        >
          {/* Base Chassis */}
          <mesh position={[0, 0.01, 0]}>
            <boxGeometry args={[0.44, 0.016, 0.32]} />
            <meshStandardMaterial
              color={selectedProductId === 'prod-macbookpro' ? '#FFFFFF' : '#E2E8F0'}
              metalness={0.9}
              roughness={0.15}
            />
          </mesh>

          {/* Screen Display open at 115 degrees */}
          <group position={[0, 0.02, -0.16]} rotation={[-0.45, 0, 0]}>
            <mesh position={[0, 0.14, 0]}>
              <boxGeometry args={[0.44, 0.28, 0.012]} />
              <meshStandardMaterial color="#F8FAFC" metalness={0.9} />
            </mesh>
            <mesh position={[0, 0.14, 0.007]}>
              <planeGeometry args={[0.42, 0.26]} />
              <meshStandardMaterial
                color="#6366F1"
                emissive="#818CF8"
                emissiveIntensity={selectedProductId === 'prod-macbookpro' ? 1.2 : 0.6}
              />
            </mesh>
          </group>

          {/* Hover Rim Glow Base Halo */}
          {hoveredItem === 'laptop' && selectedProductId !== 'prod-macbookpro' && (
            <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.26, 0.3, 32]} />
              <meshBasicMaterial color="#6366F1" transparent opacity={0.8} />
            </mesh>
          )}

          {/* Anchored 3D Label: Attached with vertical stalk, hides when inspected */}
          {selectedProductId !== 'prod-macbookpro' && (
            <group position={[0, 0.34, 0]}>
              <Html center distanceFactor={7.5} zIndexRange={[10, 0]}>
                <div
                  onClick={() => {
                    setHasInteracted(true);
                    selectProduct('prod-macbookpro');
                  }}
                  className={`flex flex-col items-center select-none pointer-events-auto cursor-pointer transition-all duration-200 ${
                    hoveredItem === 'laptop' ? 'scale-105' : 'scale-100 opacity-90'
                  }`}
                >
                  {/* Badge */}
                  <div className="px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md shadow-glass border border-slate-200 text-slate-800 text-[10px] font-mono font-bold flex items-center gap-1.5 whitespace-nowrap">
                    <span>💻</span>
                    <span>MacBook Pro 16"</span>
                    <span className="px-1.5 py-0.2 rounded-md bg-rose-100 text-rose-800 font-extrabold">
                      {isMacbookOwned ? 'OWNED' : `${Math.round(macbookCalc.progress * 100)}%`}
                    </span>
                  </div>
                  {/* Micro connecting hairline */}
                  <div className="w-[1.5px] h-3 bg-indigo-500/60 mt-0.5" />
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-sm" />
                </div>
              </Html>
            </group>
          )}
        </group>

        {/* ================= INTERACTIVE 3D OBJECT 2: SMARTWATCH ON DOCK ================= */}
        <group
          ref={watchGroupRef}
          position={[0.75, 1.08, 0.15]}
          onClick={(e) => {
            e.stopPropagation();
            setHasInteracted(true);
            selectProduct('prod-smartwatch');
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHoveredItem('watch');
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            setHoveredItem(null);
            document.body.style.cursor = 'auto';
          }}
        >
          {/* Angled Charging Dock */}
          <mesh position={[0, 0.04, 0]}>
            <cylinderGeometry args={[0.08, 0.09, 0.08, 24]} />
            <meshStandardMaterial color="#E2E8F0" roughness={0.3} metalness={0.8} />
          </mesh>
          <mesh position={[0, 0.09, 0]} rotation={[0.4, 0, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.04, 24]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.2} metalness={0.5} />
          </mesh>

          {/* Smartwatch Unit */}
          <group position={[0, 0.12, 0.02]} rotation={[0.4, 0, 0]}>
            <mesh>
              <cylinderGeometry args={[0.065, 0.065, 0.02, 32]} />
              <meshStandardMaterial
                color={selectedProductId === 'prod-smartwatch' ? '#FFFFFF' : '#0F172A'}
                metalness={0.9}
                roughness={0.15}
              />
            </mesh>
            {/* Luminous Dial */}
            <mesh position={[0, 0.011, 0]}>
              <circleGeometry args={[0.054, 32]} />
              <meshStandardMaterial
                color="#10B981"
                emissive="#34D399"
                emissiveIntensity={isSmartwatchOwned ? 2.2 : 1.6}
              />
            </mesh>
            {/* Silicone Strap */}
            <mesh position={[0, 0, 0.07]}>
              <boxGeometry args={[0.045, 0.015, 0.05]} />
              <meshStandardMaterial color="#1E293B" roughness={0.8} />
            </mesh>
            <mesh position={[0, 0, -0.07]}>
              <boxGeometry args={[0.045, 0.015, 0.05]} />
              <meshStandardMaterial color="#1E293B" roughness={0.8} />
            </mesh>
          </group>

          {/* Mint Glow Beacon Ring for Available Item */}
          <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.12, 0.15, 32]} />
            <meshStandardMaterial
              color="#10B981"
              emissive="#34D399"
              emissiveIntensity={isSmartwatchOwned ? 1.0 : 1.8}
            />
          </mesh>

          {/* Anchored 3D Label: Attached with vertical stalk, hides when inspected */}
          {selectedProductId !== 'prod-smartwatch' && (
            <group position={[0, 0.32, 0]}>
              <Html center distanceFactor={7.5} zIndexRange={[10, 0]}>
                <div
                  onClick={() => {
                    setHasInteracted(true);
                    selectProduct('prod-smartwatch');
                  }}
                  className={`flex flex-col items-center select-none pointer-events-auto cursor-pointer transition-all duration-200 ${
                    hoveredItem === 'watch' ? 'scale-105' : 'scale-100 opacity-90'
                  }`}
                >
                  <div className="px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md shadow-glass border border-emerald-300 text-emerald-900 text-[10px] font-mono font-bold flex items-center gap-1.5 whitespace-nowrap">
                    <span>⚡</span>
                    <span>Cyber Horizon</span>
                    <span className="px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800 font-extrabold">
                      {isSmartwatchOwned ? 'OWNED' : smartwatchCalc.canAffordNow ? 'AVAILABLE • ₹12,990' : `${Math.round(smartwatchCalc.progress * 100)}%`}
                    </span>
                  </div>
                  <div className="w-[1.5px] h-3 bg-emerald-500/60 mt-0.5" />
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm" />
                </div>
              </Html>
            </group>
          )}
        </group>

        {/* ================= INTERACTIVE 3D OBJECT 3: SONY XM6 HEADPHONES ================= */}
        <group
          ref={headphonesGroupRef}
          position={[-1.15, 1.08, -0.05]}
          onClick={(e) => {
            e.stopPropagation();
            setHasInteracted(true);
            selectProduct('prod-sony-wh1000xm6');
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHoveredItem('headphones');
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            setHoveredItem(null);
            document.body.style.cursor = 'auto';
          }}
        >
          {/* Headphone Stand */}
          <mesh position={[0, 0.14, 0]}>
            <cylinderGeometry args={[0.04, 0.05, 0.28, 16]} />
            <meshStandardMaterial color="#D7C4B7" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.28, 0]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshStandardMaterial color="#D7C4B7" roughness={0.6} />
          </mesh>

          {/* Headphone Unit */}
          <group position={[0, 0.24, 0]}>
            <mesh position={[0, 0.04, 0]}>
              <torusGeometry args={[0.1, 0.012, 16, 24, Math.PI]} />
              <meshStandardMaterial color="#1E293B" roughness={0.4} metalness={0.6} />
            </mesh>
            <mesh position={[-0.1, -0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.04, 0.04, 0.03, 16]} />
              <meshStandardMaterial color="#0F172A" metalness={0.8} />
            </mesh>
            <mesh position={[0.1, -0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.04, 0.04, 0.03, 16]} />
              <meshStandardMaterial color="#0F172A" metalness={0.8} />
            </mesh>
          </group>

          {/* Anchored 3D Label: Attached with vertical stalk, hides when inspected */}
          {selectedProductId !== 'prod-sony-wh1000xm6' && (
            <group position={[0, 0.38, 0]}>
              <Html center distanceFactor={7.5} zIndexRange={[10, 0]}>
                <div
                  onClick={() => {
                    setHasInteracted(true);
                    selectProduct('prod-sony-wh1000xm6');
                  }}
                  className={`flex flex-col items-center select-none pointer-events-auto cursor-pointer transition-all duration-200 ${
                    hoveredItem === 'headphones' ? 'scale-105' : 'scale-100 opacity-90'
                  }`}
                >
                  <div className="px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md shadow-glass border border-slate-200 text-slate-800 text-[10px] font-mono font-bold flex items-center gap-1.5 whitespace-nowrap">
                    <span>🎧</span>
                    <span>Sony XM6</span>
                    <span className="px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-800 font-extrabold">
                      {isHeadphonesOwned ? 'OWNED' : `${Math.round(headphonesCalc.progress * 100)}%`}
                    </span>
                  </div>
                  <div className="w-[1.5px] h-3 bg-amber-500/60 mt-0.5" />
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-sm" />
                </div>
              </Html>
            </group>
          )}
        </group>

        {/* White Mechanical Keyboard & Magic Mouse on Felt Mat */}
        <mesh position={[0.02, 1.085, 0.18]}>
          <boxGeometry args={[0.55, 0.012, 0.18]} />
          <meshStandardMaterial color="#F1F5F9" roughness={0.4} />
        </mesh>
        <mesh position={[0.42, 1.085, 0.18]}>
          <boxGeometry args={[0.07, 0.015, 0.11]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
        </mesh>
      </group>

      {/* Light Grey Minimalist Designer Office Chair */}
      <group position={[-2.6, 0, -1.35]} rotation={[0, 0.25, 0]}>
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.35, 0.35, 0.04, 16]} />
          <meshStandardMaterial color="#E2E8F0" metalness={0.9} />
        </mesh>
        <mesh position={[0, 0.32, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.4, 16]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.95} />
        </mesh>
        <mesh position={[0, 0.55, 0]}>
          <boxGeometry args={[0.65, 0.1, 0.6]} />
          <meshStandardMaterial color="#F8FAFC" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.95, -0.28]} rotation={[-0.1, 0, 0]}>
          <boxGeometry args={[0.58, 0.75, 0.06]} />
          <meshStandardMaterial color="#E2E8F0" roughness={0.6} />
        </mesh>
      </group>

      {/* Modern Low Platform Bed with Pure Linen Duvet & Warm LED Underglow */}
      <group position={[3.2, 0, -2.4]}>
        <mesh position={[0, 0.25, 0]}>
          <boxGeometry args={[2.8, 0.5, 3.4]} />
          <meshStandardMaterial color="#E7DFD5" roughness={0.6} />
        </mesh>
        {/* Soft Golden Sunrise Underglow */}
        <mesh position={[0, 0.03, 0]}>
          <boxGeometry args={[2.9, 0.02, 3.5]} />
          <meshStandardMaterial color="#F59E0B" emissive="#FBBF24" emissiveIntensity={1.5} />
        </mesh>
        {/* Crisp Off-White Linen Mattress */}
        <mesh position={[0, 0.58, 0.1]}>
          <boxGeometry args={[2.6, 0.22, 3.1]} />
          <meshStandardMaterial color="#FAF9F6" roughness={0.9} />
        </mesh>
        {/* Sage Mint Throw Blanket at Foot of Bed */}
        <mesh position={[0, 0.68, 1.05]}>
          <boxGeometry args={[2.55, 0.05, 0.95]} />
          <meshStandardMaterial color="#A7F3D0" roughness={0.95} />
        </mesh>
        {/* Pastel Pillows */}
        <mesh position={[-0.65, 0.74, -1.1]}>
          <boxGeometry args={[0.9, 0.12, 0.6]} />
          <meshStandardMaterial color="#FDA4AF" roughness={0.9} />
        </mesh>
        <mesh position={[0.65, 0.74, -1.1]}>
          <boxGeometry args={[0.9, 0.12, 0.6]} />
          <meshStandardMaterial color="#E2E8F0" roughness={0.9} />
        </mesh>
        {/* Blonde Wood Headboard */}
        <mesh position={[0, 0.95, -1.6]}>
          <boxGeometry args={[3.0, 1.3, 0.18]} />
          <meshStandardMaterial color="#E7DFD5" roughness={0.6} />
        </mesh>
        {/* Bedside Floating Table */}
        <group position={[1.8, 0.45, -1.2]}>
          <mesh>
            <boxGeometry args={[0.6, 0.4, 0.55]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
          </mesh>
          <group position={[0, 0.25, 0]}>
            <mesh>
              <cylinderGeometry args={[0.1, 0.08, 0.16, 16]} />
              <meshStandardMaterial color="#F8FAFC" roughness={0.2} />
            </mesh>
            <mesh position={[0, 0.12, 0]}>
              <sphereGeometry args={[0.14, 16, 16]} />
              <meshStandardMaterial color="#10B981" roughness={0.8} />
            </mesh>
          </group>
        </group>
      </group>

      {/* ===================== STYLIZED HUMAN GAME AVATAR ===================== */}
      <group position={[-0.4, 0, -2.8]} rotation={[0, -0.3, 0]}>
        <CharacterAvatar gear={avatarGear} isStanding={true} interactive={true} scale={1.05} />
      </group>

      {/* ===================== CELEBRATION PARTICLES ===================== */}
      {isCelebratingUnlock && (
        <group ref={celebrationParticlesRef} position={[-1.75, 1.2, -2.15]}>
          {Array.from({ length: 16 }).map((_, idx) => (
            <mesh
              key={idx}
              position={[
                (Math.random() - 0.5) * 0.6,
                Math.random() * 0.8,
                (Math.random() - 0.5) * 0.6,
              ]}
            >
              <sphereGeometry args={[0.025, 8, 8]} />
              <meshBasicMaterial
                color={idx % 2 === 0 ? '#10B981' : '#F59E0B'}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* ===================== PRODUCT SPOTLIGHTS ON INSPECTION ===================== */}
      {selectedProductId === 'prod-smartwatch' && (
        <spotLight
          position={[-1.4, 2.5, -1.75]}
          target-position={[-1.75, 1.15, -2.15]}
          intensity={3.2}
          color="#34D399"
          distance={4}
          angle={0.5}
          penumbra={0.6}
        />
      )}
      {selectedProductId === 'prod-macbookpro' && (
        <spotLight
          position={[-2.35, 2.5, -1.8]}
          target-position={[-2.8, 1.15, -2.35]}
          intensity={3.2}
          color="#818CF8"
          distance={4}
          angle={0.5}
          penumbra={0.6}
        />
      )}
      {selectedProductId === 'prod-sony-wh1000xm6' && (
        <spotLight
          position={[-3.0, 2.5, -1.9]}
          target-position={[-3.45, 1.25, -2.45]}
          intensity={3.2}
          color="#F59E0B"
          distance={4}
          angle={0.5}
          penumbra={0.6}
        />
      )}

      {/* ===================== LAYERED CINEMATIC LIGHTING ===================== */}
      {/* 1. Global Soft Daylight Ambient */}
      <ambientLight intensity={0.7} color="#F8FAFC" />

      {/* 2. Main Sunlight Directional Light streaming through Window */}
      <directionalLight
        position={[8, 14, -10]}
        intensity={2.0}
        color="#FFFBEB"
        castShadow
      />

      {/* 3. Sky Blue Daylight Fill from Window */}
      <directionalLight position={[-6, 10, -8]} intensity={0.8} color="#BAE6FD" />

      {/* 4. Warm Room Interior Accent Fill */}
      <pointLight position={[-1, 3.2, 0]} intensity={1.1} color="#FFF7ED" distance={10} />

      {/* 5. Window Sill Subtle Glow */}
      <pointLight position={[0, 1.0, -4.8]} intensity={1.2} color="#34D399" distance={4} />

      {/* 6. Bed Golden Underglow */}
      <pointLight position={[3.2, 0.7, -2.4]} intensity={1.2} color="#FBBF24" distance={5} />
    </group>
  );
};
