import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshReflectorMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { CharacterAvatar } from '../models/CharacterAvatar';
import { useWalletStore } from '../store/walletStore';

export const HomeScene: React.FC = () => {
  const avatarGear = useWalletStore(s => s.avatarGear);
  const cityGroup = useRef<THREE.Group>(null);
  const trafficGroup = useRef<THREE.Group>(null);
  const sunBeamsRef = useRef<THREE.Group>(null);

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
      ctx.fillText('₹38,420.00', 30, 95);

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

  // 52 modern colourful skyscrapers (white, sky blue, terracotta coral, emerald accents)
  const buildings = useMemo(() => {
    const list = [];
    const count = 52;
    const towerColors = [
      '#FFFFFF', // Modern white architecture
      '#E0F2FE', // Ice blue glass
      '#EDE9FE', // Lavender high-rise
      '#FEF3C7', // Warm sandstone
      '#FFE4E6', // Coral quartz
      '#DCFCE7', // Eco mint tower
    ];
    const trimColors = ['#0EA5E9', '#10B981', '#F59E0B', '#EC4899', '#6366F1'];

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 55;
      const z = -10 - Math.random() * 28;
      const width = 1.4 + Math.random() * 2.8;
      const depth = 1.4 + Math.random() * 2.8;
      const height = 8 + Math.random() * 18;
      const bodyColor = towerColors[i % towerColors.length];
      const trimColor = trimColors[i % trimColors.length];
      const hasAntenna = Math.random() > 0.4;
      list.push({ x, z, width, depth, height, bodyColor, trimColor, hasAntenna });
    }
    return list;
  }, []);

  // Sky Aerial vehicle traffic trails (bright cyan and sunset coral)
  const trafficCars = useMemo(() => {
    return Array.from({ length: 16 }, (_, i) => ({
      y: 2.0 + (i % 5) * 1.5,
      z: -12 - (i * 1.8),
      speed: 1.8 + Math.random() * 2.5,
      color: i % 2 === 0 ? '#0EA5E9' : '#F43F5E',
      offset: Math.random() * 50 - 25,
    }));
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Traffic motion
    if (trafficGroup.current) {
      trafficGroup.current.children.forEach((child, index) => {
        const car = trafficCars[index];
        if (car) {
          child.position.x = ((car.offset + t * car.speed) % 60) - 30;
        }
      });
    }

    if (sunBeamsRef.current) {
      sunBeamsRef.current.rotation.y = Math.sin(t * 0.1) * 0.03;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* ===================== BRIGHT SKY BACKDROP ===================== */}
      {/* Sunlit Sky Dome Plane */}
      <mesh position={[0, 10, -32]}>
        <planeGeometry args={[80, 50]} />
        <meshBasicMaterial color="#E0F2FE" />
      </mesh>

      {/* Sun Disk in the Sky */}
      <mesh position={[12, 18, -30]}>
        <circleGeometry args={[4.5, 32]} />
        <meshBasicMaterial color="#FEF08A" />
      </mesh>

      {/* Stylized Fluffy Sunlit Clouds */}
      {[
        [-14, 14, -26, 3.8],
        [-6, 17, -27, 4.5],
        [6, 13, -25, 3.2],
        [18, 15, -28, 5.0],
      ].map((pos, idx) => (
        <mesh key={idx} position={[pos[0], pos[1], pos[2]]}>
          <capsuleGeometry args={[pos[3] * 0.45, pos[3], 16, 16]} />
          <meshBasicMaterial color="#FFFFFF" transparent opacity={0.88} />
        </mesh>
      ))}

      {/* ===================== LUXURY SUNLIT PENTHOUSE ARCHITECTURE ===================== */}

      {/* Polished White Marble / Terrazzo Reflective Floor */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[16, 14]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={512}
          mirror={0.65}
          mixBlur={1}
          mixStrength={25}
          roughness={0.2}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#F8FAFC"
          metalness={0.2}
        />
      </mesh>

      {/* Crisp White Ceiling with Recessed Light Channels */}
      <mesh position={[0, 4.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[16, 14]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.9} />
      </mesh>

      {/* Left Wall - Architectural Gallery Surface */}
      <mesh position={[-6.2, 2.1, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[14, 4.2]} />
        <meshStandardMaterial color="#F8FAFC" roughness={0.7} />
      </mesh>

      {/* Right Wall with Natural Scandinavian Bleached Oak Slats */}
      <group position={[6.1, 2.1, -1.8]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh>
          <planeGeometry args={[8, 4.2]} />
          <meshStandardMaterial color="#F1F5F9" roughness={0.8} />
        </mesh>
        {/* Vertical Decorative Slat Strips with Warm Backlight */}
        {Array.from({ length: 18 }).map((_, i) => (
          <mesh key={i} position={[-3.6 + i * 0.42, 0, 0.02]}>
            <boxGeometry args={[0.18, 4.1, 0.03]} />
            <meshStandardMaterial color="#E2D9CC" roughness={0.4} />
          </mesh>
        ))}
        {/* Soft Warm LED Cove Line */}
        <mesh position={[0, 2.05, 0.04]}>
          <boxGeometry args={[7.6, 0.03, 0.02]} />
          <meshStandardMaterial color="#F59E0B" emissive="#FBBF24" emissiveIntensity={1.5} />
        </mesh>
      </group>

      {/* Panoramic Floor-to-Ceiling Window Frame in Clean Titanium White */}
      <mesh position={[0, 0.5, -5.2]}>
        <boxGeometry args={[14, 1.0, 0.25]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
      </mesh>
      <mesh position={[-5.4, 2.3, -5.2]}>
        <boxGeometry args={[1.8, 3.8, 0.25]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
      </mesh>
      <mesh position={[5.4, 2.3, -5.2]}>
        <boxGeometry args={[1.8, 3.8, 0.25]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
      </mesh>
      <mesh position={[0, 3.95, -5.2]}>
        <boxGeometry args={[14, 0.6, 0.25]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
      </mesh>

      {/* Crystal Clear Window Glass Sheet */}
      <mesh position={[0, 2.4, -5.15]}>
        <planeGeometry args={[9.2, 3.1]} />
        <meshStandardMaterial
          color="#BAE6FD"
          transparent
          opacity={0.12}
          roughness={0.05}
          metalness={0.8}
        />
      </mesh>

      {/* Window Sill Mint/Teal Accent Line */}
      <mesh position={[0, 1.01, -5.08]}>
        <boxGeometry args={[9.2, 0.02, 0.04]} />
        <meshStandardMaterial color="#10B981" emissive="#34D399" emissiveIntensity={1.2} />
      </mesh>

      {/* ===================== COLOURFUL SOLAR CITY SKYLINE ===================== */}
      <group ref={cityGroup}>
        {buildings.map((b, i) => (
          <group key={i} position={[b.x, b.height / 2 - 4.5, b.z]}>
            {/* Tower Body */}
            <mesh>
              <boxGeometry args={[b.width, b.height, b.depth]} />
              <meshStandardMaterial color={b.bodyColor} roughness={0.3} metalness={0.1} />
            </mesh>

            {/* Colourful Sunlit Window Bands */}
            <mesh position={[0, 0, b.depth / 2 + 0.02]}>
              <planeGeometry args={[b.width * 0.9, b.height * 0.85]} />
              <meshStandardMaterial
                color={b.trimColor}
                transparent
                opacity={0.35}
                wireframe
              />
            </mesh>

            {/* Rooftop Garden / Solar Accent Plate */}
            <mesh position={[0, b.height / 2 + 0.05, 0]}>
              <boxGeometry args={[b.width * 0.9, 0.1, b.depth * 0.9]} />
              <meshStandardMaterial color={b.trimColor} roughness={0.4} />
            </mesh>

            {/* Rooftop Antenna Spire */}
            {b.hasAntenna && (
              <mesh position={[0, b.height / 2 + 0.8, 0]}>
                <cylinderGeometry args={[0.02, 0.04, 1.6, 8]} />
                <meshStandardMaterial color="#94A3B8" metalness={0.9} />
              </mesh>
            )}
          </group>
        ))}
      </group>

      {/* Sky Aerial Traffic Lines */}
      <group ref={trafficGroup}>
        {trafficCars.map((car, idx) => (
          <mesh key={idx} position={[car.offset, car.y, car.z]}>
            <boxGeometry args={[1.2, 0.06, 0.06]} />
            <meshStandardMaterial color={car.color} emissive={car.color} emissiveIntensity={1.8} />
          </mesh>
        ))}
      </group>

      {/* ===================== MODERN LIGHT FURNITURE & TECH ===================== */}

      {/* Minimalist Bleached Birch & White Executive Desk */}
      <group position={[-2.6, 0, -2.5]}>
        {/* Clean White Top */}
        <mesh position={[0, 1.05, 0]}>
          <boxGeometry args={[2.5, 0.06, 1.15]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.2} metalness={0.1} />
        </mesh>
        {/* Birch Wood Sled Legs */}
        <mesh position={[-1.15, 0.52, 0]}>
          <boxGeometry args={[0.06, 1.0, 1.05]} />
          <meshStandardMaterial color="#D7C4B7" roughness={0.5} />
        </mesh>
        <mesh position={[1.15, 0.52, 0]}>
          <boxGeometry args={[0.06, 1.0, 1.05]} />
          <meshStandardMaterial color="#D7C4B7" roughness={0.5} />
        </mesh>

        {/* Ultra-Wide Curved Silver Studio Display */}
        <group position={[0, 1.48, -0.22]}>
          {/* Silver Aluminium Stand */}
          <mesh position={[0, -0.25, 0]}>
            <cylinderGeometry args={[0.035, 0.035, 0.4, 16]} />
            <meshStandardMaterial color="#E2E8F0" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[0, -0.42, 0.05]}>
            <boxGeometry args={[0.45, 0.02, 0.3]} />
            <meshStandardMaterial color="#E2E8F0" metalness={0.9} roughness={0.1} />
          </mesh>
          {/* Monitor Outer Chassis in Pure White/Silver */}
          <mesh>
            <boxGeometry args={[1.9, 0.72, 0.06]} />
            <meshStandardMaterial color="#F8FAFC" metalness={0.6} roughness={0.2} />
          </mesh>
          {/* Luminous Light Financial Display */}
          <mesh position={[0, 0, 0.032]}>
            <planeGeometry args={[1.84, 0.66]} />
            {monitorTexture ? (
              <meshBasicMaterial map={monitorTexture} />
            ) : (
              <meshStandardMaterial color="#FFFFFF" />
            )}
          </mesh>
        </group>

        {/* Silver MacBook on Desk */}
        <group position={[-0.8, 1.08, 0.18]} rotation={[0, 0.35, 0]}>
          <mesh position={[0, 0.01, 0]}>
            <boxGeometry args={[0.42, 0.015, 0.3]} />
            <meshStandardMaterial color="#E2E8F0" metalness={0.9} roughness={0.15} />
          </mesh>
          <group position={[0, 0.02, -0.15]} rotation={[-0.45, 0, 0]}>
            <mesh position={[0, 0.13, 0]}>
              <boxGeometry args={[0.42, 0.27, 0.012]} />
              <meshStandardMaterial color="#F8FAFC" metalness={0.9} />
            </mesh>
            <mesh position={[0, 0.13, 0.007]}>
              <planeGeometry args={[0.4, 0.25]} />
              <meshStandardMaterial color="#6366F1" emissive="#818CF8" emissiveIntensity={0.6} />
            </mesh>
          </group>
        </group>

        {/* White Mechanical Keyboard & Magic Mouse */}
        <mesh position={[0.1, 1.082, 0.15]}>
          <boxGeometry args={[0.55, 0.012, 0.18]} />
          <meshStandardMaterial color="#F1F5F9" roughness={0.4} />
        </mesh>
        <mesh position={[0.48, 1.082, 0.15]}>
          <boxGeometry args={[0.07, 0.015, 0.11]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
        </mesh>
      </group>

      {/* Light Grey Minimalist Designer Office Chair */}
      <group position={[-2.6, 0, -1.4]} rotation={[0, 0.25, 0]}>
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

      {/* Modern Low Platform Bed with Pure Linen Duvet & Pastel Coral Pillows */}
      <group position={[3.2, 0, -2.4]}>
        {/* Blonde Wood Bed Base */}
        <mesh position={[0, 0.25, 0]}>
          <boxGeometry args={[2.8, 0.5, 3.4]} />
          <meshStandardMaterial color="#E7DFD5" roughness={0.6} />
        </mesh>

        {/* Sunrise Warm Underglow */}
        <mesh position={[0, 0.03, 0]}>
          <boxGeometry args={[2.9, 0.02, 3.5]} />
          <meshStandardMaterial color="#F59E0B" emissive="#FBBF24" emissiveIntensity={1.8} />
        </mesh>

        {/* Crisp White Linen Mattress & Duvet */}
        <mesh position={[0, 0.58, 0.1]}>
          <boxGeometry args={[2.6, 0.22, 3.1]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.9} />
        </mesh>

        {/* Pastel Coral & Mint Luxury Pillows */}
        <mesh position={[-0.65, 0.74, -1.1]}>
          <boxGeometry args={[0.9, 0.12, 0.6]} />
          <meshStandardMaterial color="#FDA4AF" roughness={0.9} />
        </mesh>
        <mesh position={[0.65, 0.74, -1.1]}>
          <boxGeometry args={[0.9, 0.12, 0.6]} />
          <meshStandardMaterial color="#A7F3D0" roughness={0.9} />
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
          {/* Ceramic Plant Pot with Lush Green Plant */}
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

      {/* Stylish Character Avatar in Clean White & Mint Streetwear */}
      <group position={[-0.4, 0, -2.8]} rotation={[0, -0.35, 0]}>
        <CharacterAvatar gear={avatarGear} isStanding={true} interactive={true} scale={1.05} />
      </group>

      {/* ===================== BRIGHT CHEERFUL CINEMATIC LIGHTING ===================== */}
      {/* Soft Sky Ambient Light */}
      <ambientLight intensity={0.75} color="#F1F5F9" />

      {/* Bright Golden Sunlight Streaming through Window */}
      <directionalLight
        position={[8, 14, -10]}
        intensity={2.2}
        color="#FFFBEB"
        castShadow
      />

      {/* Window Sky Blue Fill Light */}
      <directionalLight
        position={[-6, 10, -8]}
        intensity={1.0}
        color="#BAE6FD"
      />

      {/* Warm Interior Sun Fill */}
      <pointLight position={[-1, 3.2, 0]} intensity={1.2} color="#FFF7ED" distance={10} />

      {/* Subtle Mint Glow from Window Sill */}
      <pointLight position={[0, 1.2, -4.8]} intensity={1.4} color="#34D399" distance={4} />

      {/* Bed Sunrise Warm Glow */}
      <pointLight position={[3.2, 0.8, -2.4]} intensity={1.5} color="#FBBF24" distance={5} />
    </group>
  );
};
