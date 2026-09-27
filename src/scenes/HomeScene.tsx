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

  const cityGroup = useRef<THREE.Group>(null);
  const trafficGroup = useRef<THREE.Group>(null);
  const laptopGroup = useRef<THREE.Group>(null);
  const watchGroup = useRef<THREE.Group>(null);
  const headphonesGroup = useRef<THREE.Group>(null);
  const celebrationParticlesRef = useRef<THREE.Group>(null);

  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Dynamic light & colourful financial UI texture for the curved monitor
  const [monitorTexture, setMonitorTexture] = useState<THREE.CanvasTexture | null>(null);

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

  // 52 modern colourful skyscrapers (white, sky blue, terracotta coral, emerald accents)
  const buildings = useMemo(() => {
    const list = [];
    const count = 52;
    const towerColors = [
      '#FFFFFF',
      '#E0F2FE',
      '#EDE9FE',
      '#FEF3C7',
      '#FFE4E6',
      '#DCFCE7',
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
      z: -12 - i * 1.8,
      speed: 1.8 + Math.random() * 2.5,
      color: i % 2 === 0 ? '#0EA5E9' : '#F43F5E',
      offset: Math.random() * 50 - 25,
    }));
  }, []);

  useFrame(({ clock }, delta) => {
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

    // Gentle slow rotation when an item is inspected
    if (selectedProductId === 'prod-smartwatch' && watchGroup.current) {
      watchGroup.current.rotation.y += delta * 0.8;
    }
    if (selectedProductId === 'prod-macbookpro' && laptopGroup.current) {
      laptopGroup.current.rotation.y = 0.35 + Math.sin(t * 1.2) * 0.08;
    }
    if (selectedProductId === 'prod-sony-wh1000xm6' && headphonesGroup.current) {
      headphonesGroup.current.rotation.y += delta * 0.7;
    }

    // Celebration particles ascend
    if (celebrationParticlesRef.current && isCelebratingUnlock) {
      celebrationParticlesRef.current.children.forEach((p, idx) => {
        p.position.y += delta * 0.6;
        if (p.position.y > 2.5) {
          p.position.y = 1.1;
        }
        p.rotation.y += delta * (idx % 2 === 0 ? 1 : -1);
      });
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* ===================== BRIGHT SKY BACKDROP ===================== */}
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
            <mesh>
              <boxGeometry args={[b.width, b.height, b.depth]} />
              <meshStandardMaterial color={b.bodyColor} roughness={0.3} metalness={0.1} />
            </mesh>
            <mesh position={[0, 0, b.depth / 2 + 0.02]}>
              <planeGeometry args={[b.width * 0.9, b.height * 0.85]} />
              <meshStandardMaterial
                color={b.trimColor}
                transparent
                opacity={0.35}
                wireframe
              />
            </mesh>
            <mesh position={[0, b.height / 2 + 0.05, 0]}>
              <boxGeometry args={[b.width * 0.9, 0.1, b.depth * 0.9]} />
              <meshStandardMaterial color={b.trimColor} roughness={0.4} />
            </mesh>
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

      {/* ===================== EXECUTIVE DESK & WORKSTATION ===================== */}
      <group position={[-2.6, 0, -2.5]}>
        {/* Clean White Top */}
        <mesh position={[0, 1.05, 0]}>
          <boxGeometry args={[2.7, 0.06, 1.25]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.2} metalness={0.1} />
        </mesh>
        {/* Birch Wood Sled Legs */}
        <mesh position={[-1.25, 0.52, 0]}>
          <boxGeometry args={[0.06, 1.0, 1.15]} />
          <meshStandardMaterial color="#D7C4B7" roughness={0.5} />
        </mesh>
        <mesh position={[1.25, 0.52, 0]}>
          <boxGeometry args={[0.06, 1.0, 1.15]} />
          <meshStandardMaterial color="#D7C4B7" roughness={0.5} />
        </mesh>

        {/* Ultra-Wide Curved Silver Studio Display */}
        <group position={[0, 1.48, -0.25]}>
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

        {/* ================= INTERACTIVE ITEM 1: MACBOOK PRO 16" M4 MAX ================= */}
        <group
          ref={laptopGroup}
          position={[-0.75, 1.08, 0.15]}
          rotation={[0, 0.35, 0]}
          onClick={(e) => {
            e.stopPropagation();
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
            {/* Luminous Retina Screen */}
            <mesh position={[0, 0.14, 0.007]}>
              <planeGeometry args={[0.42, 0.26]} />
              <meshStandardMaterial
                color="#6366F1"
                emissive="#818CF8"
                emissiveIntensity={selectedProductId === 'prod-macbookpro' ? 1.2 : 0.6}
              />
            </mesh>
          </group>

          {/* Hover / Selection Ring */}
          {(hoveredItem === 'laptop' || selectedProductId === 'prod-macbookpro') && (
            <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.26, 0.3, 32]} />
              <meshBasicMaterial
                color={isMacbookOwned ? '#10B981' : '#F43F5E'}
                transparent
                opacity={0.85}
              />
            </mesh>
          )}

          {/* Floating Contextual Pill Tag */}
          <Html position={[0, 0.38, 0]} center distanceFactor={7}>
            <div
              onClick={() => selectProduct('prod-macbookpro')}
              className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold shadow-lg border flex items-center gap-1.5 transition-transform duration-200 cursor-pointer pointer-events-auto whitespace-nowrap select-none ${
                selectedProductId === 'prod-macbookpro'
                  ? 'scale-110 bg-slate-900 text-white border-indigo-400 ring-2 ring-indigo-400/50'
                  : hoveredItem === 'laptop'
                  ? 'scale-105 bg-white text-slate-900 border-indigo-300 shadow-xl'
                  : 'bg-white/90 text-slate-700 border-slate-200 hover:scale-105'
              }`}
            >
              <span>💻</span>
              <span>MacBook Pro 16"</span>
              <span className={`px-1.5 py-0.2 rounded-md ${
                isMacbookOwned
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-rose-100 text-rose-800'
              }`}>
                {isMacbookOwned ? 'OWNED' : `${Math.round(macbookCalc.progress * 100)}%`}
              </span>
            </div>
          </Html>
        </group>

        {/* ================= INTERACTIVE ITEM 2: APEX CYBER HORIZON SMARTWATCH ================= */}
        <group
          ref={watchGroup}
          position={[0.85, 1.08, 0.15]}
          onClick={(e) => {
            e.stopPropagation();
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
          {/* Modern Magnetic Angled Charging Stand */}
          <mesh position={[0, 0.04, 0]}>
            <cylinderGeometry args={[0.08, 0.09, 0.08, 24]} />
            <meshStandardMaterial color="#E2E8F0" roughness={0.3} metalness={0.8} />
          </mesh>
          <mesh position={[0, 0.09, 0]} rotation={[0.4, 0, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.04, 24]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.2} metalness={0.5} />
          </mesh>

          {/* Smartwatch Case (Titanium with Emerald Screen) */}
          <group position={[0, 0.12, 0.02]} rotation={[0.4, 0, 0]}>
            {/* Outer Bezel */}
            <mesh>
              <cylinderGeometry args={[0.065, 0.065, 0.02, 32]} />
              <meshStandardMaterial
                color={selectedProductId === 'prod-smartwatch' ? '#FFFFFF' : '#0F172A'}
                metalness={0.9}
                roughness={0.15}
              />
            </mesh>
            {/* Emerald Holographic Always-On Dial */}
            <mesh position={[0, 0.011, 0]}>
              <circleGeometry args={[0.054, 32]} />
              <meshStandardMaterial
                color="#10B981"
                emissive="#34D399"
                emissiveIntensity={isSmartwatchOwned ? 2.2 : 1.5}
              />
            </mesh>
            {/* Silicone Strap Ends */}
            <mesh position={[0, 0, 0.07]}>
              <boxGeometry args={[0.045, 0.015, 0.05]} />
              <meshStandardMaterial color="#1E293B" roughness={0.8} />
            </mesh>
            <mesh position={[0, 0, -0.07]}>
              <boxGeometry args={[0.045, 0.015, 0.05]} />
              <meshStandardMaterial color="#1E293B" roughness={0.8} />
            </mesh>
          </group>

          {/* Pulsing Mint Beacon Ring for Affordable Item */}
          <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.13, 0.16, 32]} />
            <meshStandardMaterial
              color="#10B981"
              emissive="#34D399"
              emissiveIntensity={1.8}
            />
          </mesh>

          {/* Floating Contextual Pill Tag */}
          <Html position={[0, 0.32, 0]} center distanceFactor={7}>
            <div
              onClick={() => selectProduct('prod-smartwatch')}
              className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold shadow-lg border flex items-center gap-1.5 transition-transform duration-200 cursor-pointer pointer-events-auto whitespace-nowrap select-none ${
                selectedProductId === 'prod-smartwatch'
                  ? 'scale-110 bg-emerald-600 text-white border-emerald-300 ring-2 ring-emerald-400/50'
                  : hoveredItem === 'watch'
                  ? 'scale-105 bg-emerald-50 text-emerald-900 border-emerald-400 shadow-xl'
                  : 'bg-white/95 text-emerald-800 border-emerald-300 hover:scale-105'
              }`}
            >
              <span>⚡</span>
              <span>Cyber Horizon</span>
              <span className="px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800 font-extrabold">
                {isSmartwatchOwned ? 'OWNED' : smartwatchCalc.canAffordNow ? 'AVAILABLE • ₹12,990' : `${Math.round(smartwatchCalc.progress * 100)}%`}
              </span>
            </div>
          </Html>
        </group>

        {/* ================= INTERACTIVE ITEM 3: SONY WH-1000XM6 HEADPHONES ================= */}
        <group
          ref={headphonesGroup}
          position={[-1.15, 1.08, -0.05]}
          onClick={(e) => {
            e.stopPropagation();
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
          {/* Curved Scandinavian Wooden Headphone Stand */}
          <mesh position={[0, 0.14, 0]}>
            <cylinderGeometry args={[0.04, 0.05, 0.28, 16]} />
            <meshStandardMaterial color="#D7C4B7" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.28, 0]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshStandardMaterial color="#D7C4B7" roughness={0.6} />
          </mesh>

          {/* Headphones Resting on Stand */}
          <group position={[0, 0.24, 0]}>
            {/* Headband */}
            <mesh position={[0, 0.04, 0]}>
              <torusGeometry args={[0.1, 0.012, 16, 24, Math.PI]} />
              <meshStandardMaterial color="#1E293B" roughness={0.4} metalness={0.6} />
            </mesh>
            {/* Ear Cups */}
            <mesh position={[-0.1, -0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.04, 0.04, 0.03, 16]} />
              <meshStandardMaterial color="#0F172A" metalness={0.8} />
            </mesh>
            <mesh position={[0.1, -0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.04, 0.04, 0.03, 16]} />
              <meshStandardMaterial color="#0F172A" metalness={0.8} />
            </mesh>
          </group>

          {/* Floating Contextual Pill Tag */}
          <Html position={[0, 0.38, 0]} center distanceFactor={7}>
            <div
              onClick={() => selectProduct('prod-sony-wh1000xm6')}
              className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold shadow-lg border flex items-center gap-1.5 transition-transform duration-200 cursor-pointer pointer-events-auto whitespace-nowrap select-none ${
                selectedProductId === 'prod-sony-wh1000xm6'
                  ? 'scale-110 bg-indigo-600 text-white border-indigo-300 ring-2 ring-indigo-400/50'
                  : hoveredItem === 'headphones'
                  ? 'scale-105 bg-white text-indigo-900 border-indigo-300 shadow-xl'
                  : 'bg-white/90 text-slate-700 border-slate-200 hover:scale-105'
              }`}
            >
              <span>🎧</span>
              <span>Sony XM6</span>
              <span className="px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-800">
                {isHeadphonesOwned ? 'OWNED' : `${Math.round(headphonesCalc.progress * 100)}%`}
              </span>
            </div>
          </Html>
        </group>

        {/* White Mechanical Keyboard & Magic Mouse */}
        <mesh position={[0.05, 1.082, 0.22]}>
          <boxGeometry args={[0.55, 0.012, 0.18]} />
          <meshStandardMaterial color="#F1F5F9" roughness={0.4} />
        </mesh>
        <mesh position={[0.42, 1.082, 0.22]}>
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

      {/* Modern Low Platform Bed with Pure Linen Duvet & Pastel Coral Pillows */}
      <group position={[3.2, 0, -2.4]}>
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
        {/* Pastel Pillows */}
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

      {/* ===================== STYLIZED HUMAN AVATAR ===================== */}
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

      {/* ===================== FOCUSED PRODUCT SPOTLIGHTS ===================== */}
      {selectedProductId === 'prod-smartwatch' && (
        <spotLight
          position={[-1.75, 2.5, -2.15]}
          target-position={[-1.75, 1.15, -2.15]}
          intensity={3.5}
          color="#34D399"
          distance={4}
          angle={0.6}
          penumbra={0.5}
        />
      )}
      {selectedProductId === 'prod-macbookpro' && (
        <spotLight
          position={[-3.35, 2.6, -2.35]}
          target-position={[-3.35, 1.1, -2.35]}
          intensity={3.5}
          color="#818CF8"
          distance={4}
          angle={0.6}
          penumbra={0.5}
        />
      )}
      {selectedProductId === 'prod-sony-wh1000xm6' && (
        <spotLight
          position={[-3.75, 2.5, -2.55]}
          target-position={[-3.75, 1.2, -2.55]}
          intensity={3.5}
          color="#F59E0B"
          distance={4}
          angle={0.6}
          penumbra={0.5}
        />
      )}

      {/* ===================== BRIGHT CHEERFUL CINEMATIC LIGHTING ===================== */}
      <ambientLight intensity={0.75} color="#F1F5F9" />

      {/* Golden Sunlight Streaming through Window */}
      <directionalLight
        position={[8, 14, -10]}
        intensity={2.2}
        color="#FFFBEB"
        castShadow
      />

      {/* Sky Blue Fill */}
      <directionalLight position={[-6, 10, -8]} intensity={1.0} color="#BAE6FD" />

      {/* Warm Interior Sun Fill */}
      <pointLight position={[-1, 3.2, 0]} intensity={1.2} color="#FFF7ED" distance={10} />

      {/* Subtle Mint Window Sill Glow */}
      <pointLight position={[0, 1.2, -4.8]} intensity={1.4} color="#34D399" distance={4} />

      {/* Bed Sunrise Warm Glow */}
      <pointLight position={[3.2, 0.8, -2.4]} intensity={1.5} color="#FBBF24" distance={5} />
    </group>
  );
};
