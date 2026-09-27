import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Vehicle3DProps {
  modelType: 'bike' | 'car' | 'supercar';
  isLocked?: boolean;
  scale?: number;
  autoRotate?: boolean;
}

export const Vehicle3D: React.FC<Vehicle3DProps> = ({
  modelType,
  isLocked = false,
  scale = 1,
  autoRotate = false,
}) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y += delta * 0.25;
    }
  });

  const carColor = isLocked ? '#334155' : modelType === 'supercar' ? '#090D16' : '#1E293B';
  const rimColor = isLocked ? '#64748B' : '#F59E0B';

  return (
    <group ref={groupRef} scale={[scale, scale, scale]}>
      {/* ==================== MOTORCYCLE: ROYAL ENFIELD CLASSIC 350 ==================== */}
      {modelType === 'bike' && (
        <group position={[0, 0.45, 0]}>
          {/* Heavy Steel Backbone Frame */}
          <mesh position={[0, 0.25, 0]}>
            <boxGeometry args={[0.18, 0.22, 1.2]} />
            <meshStandardMaterial color="#0A0E17" metalness={0.9} roughness={0.2} />
          </mesh>

          {/* Classic Teardrop Fuel Tank */}
          <mesh position={[0, 0.46, -0.15]}>
            <sphereGeometry args={[0.32, 24, 24]} />
            <meshStandardMaterial
              color={isLocked ? '#475569' : '#047857'}
              metalness={0.85}
              roughness={0.12}
            />
          </mesh>
          {/* Gold Pinstripe on Tank */}
          <mesh position={[0, 0.48, -0.15]}>
            <torusGeometry args={[0.31, 0.008, 16, 32]} />
            <meshStandardMaterial color="#F59E0B" metalness={0.9} roughness={0.2} />
          </mesh>

          {/* Detailed Engine Block with Cooling Fins */}
          <group position={[0, 0.1, -0.05]}>
            <mesh>
              <boxGeometry args={[0.34, 0.38, 0.42]} />
              <meshStandardMaterial color="#94A3B8" metalness={0.95} roughness={0.15} />
            </mesh>
            {/* Horizontal Cooling Fins */}
            {[-0.1, -0.04, 0.02, 0.08, 0.14].map((y, i) => (
              <mesh key={i} position={[0, y, 0]}>
                <boxGeometry args={[0.38, 0.015, 0.44]} />
                <meshStandardMaterial color="#CBD5E1" metalness={0.98} roughness={0.1} />
              </mesh>
            ))}
          </group>

          {/* Swept Chrome Exhaust System */}
          <group position={[0.19, -0.08, 0.35]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.045, 0.055, 1.05, 24]} />
              <meshStandardMaterial color="#F1F5F9" metalness={0.98} roughness={0.03} />
            </mesh>
            {/* Tapered Exhaust Tip */}
            <mesh position={[0, 0, 0.54]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.035, 0.045, 0.12, 24]} />
              <meshStandardMaterial color="#0A0E17" metalness={0.9} roughness={0.4} />
            </mesh>
          </group>

          {/* Vintage Leather Sprung Saddle */}
          <mesh position={[0, 0.39, 0.32]}>
            <boxGeometry args={[0.28, 0.09, 0.58]} />
            <meshStandardMaterial color="#78350F" roughness={0.75} />
          </mesh>

          {/* Wide Cruiser Handlebars & Bar-End Mirrors */}
          <group position={[0, 0.68, -0.7]}>
            {/* Handlebar tube */}
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.02, 0.02, 0.72, 16]} />
              <meshStandardMaterial color="#E2E8F0" metalness={0.98} roughness={0.05} />
            </mesh>
            {/* Left Grip */}
            <mesh position={[-0.34, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.028, 0.028, 0.12, 16]} />
              <meshStandardMaterial color="#0A0E17" roughness={0.8} />
            </mesh>
            {/* Right Grip */}
            <mesh position={[0.34, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.028, 0.028, 0.12, 16]} />
              <meshStandardMaterial color="#0A0E17" roughness={0.8} />
            </mesh>
            {/* Chrome Circular Mirrors */}
            <mesh position={[-0.38, 0.1, 0]}>
              <circleGeometry args={[0.045, 16]} />
              <meshStandardMaterial color="#CBD5E1" metalness={0.99} roughness={0.01} />
            </mesh>
            <mesh position={[0.38, 0.1, 0]}>
              <circleGeometry args={[0.045, 16]} />
              <meshStandardMaterial color="#CBD5E1" metalness={0.99} roughness={0.01} />
            </mesh>
          </group>

          {/* Front Wheel with Chrome Spokes & Disc Caliper */}
          <group position={[0, -0.08, -0.88]}>
            {/* Rubber Tire */}
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <torusGeometry args={[0.4, 0.095, 20, 36]} />
              <meshStandardMaterial color="#05070A" roughness={0.92} />
            </mesh>
            {/* Spokes Wheel */}
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.37, 0.37, 0.02, 24]} />
              <meshStandardMaterial color="#94A3B8" metalness={0.95} roughness={0.15} wireframe />
            </mesh>
            {/* 300mm Front Disc Brake */}
            <mesh position={[0.08, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <ringGeometry args={[0.15, 0.28, 24]} />
              <meshStandardMaterial color="#E2E8F0" metalness={0.95} roughness={0.1} />
            </mesh>
            {/* Gold Caliper */}
            <mesh position={[0.09, 0.18, 0.1]}>
              <boxGeometry args={[0.04, 0.08, 0.06]} />
              <meshStandardMaterial color="#F59E0B" metalness={0.8} />
            </mesh>
          </group>

          {/* Rear Wheel */}
          <group position={[0, -0.08, 0.88]}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <torusGeometry args={[0.4, 0.115, 20, 36]} />
              <meshStandardMaterial color="#05070A" roughness={0.92} />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.37, 0.37, 0.02, 24]} />
              <meshStandardMaterial color="#94A3B8" metalness={0.95} roughness={0.15} wireframe />
            </mesh>
          </group>

          {/* Vintage Round Headlamp with Warm Halogen Lens */}
          <group position={[0, 0.48, -0.95]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.13, 0.13, 0.1, 24]} />
              <meshStandardMaterial color="#0A0E17" metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0, -0.052]}>
              <circleGeometry args={[0.115, 24]} />
              <meshStandardMaterial
                color="#FEF08A"
                emissive="#FACC15"
                emissiveIntensity={isLocked ? 0.3 : 1.4}
                roughness={0.05}
              />
            </mesh>
          </group>

          {/* Rear Crimson Taillight */}
          <mesh position={[0, 0.28, 1.15]}>
            <boxGeometry args={[0.08, 0.06, 0.04]} />
            <meshStandardMaterial color="#EF4444" emissive="#DC2626" emissiveIntensity={1.8} />
          </mesh>
        </group>
      )}

      {/* ==================== SPORTS CAR: BMW M4 COMPETITION ==================== */}
      {modelType === 'car' && (
        <group position={[0, 0.45, 0]}>
          {/* Sculpted Lower Body Chassis */}
          <mesh position={[0, 0.12, 0]}>
            <boxGeometry args={[1.56, 0.44, 3.45]} />
            <meshStandardMaterial
              color={carColor}
              metalness={0.88}
              roughness={0.18}
            />
          </mesh>

          {/* Sleek Aerodynamic Greenhouse / Roofline */}
          <mesh position={[0, 0.52, -0.15]}>
            <boxGeometry args={[1.28, 0.46, 1.75]} />
            <meshStandardMaterial
              color="#020617"
              metalness={0.95}
              roughness={0.05}
            />
          </mesh>

          {/* Iconic Dual Kidney Grille */}
          <group position={[0, 0.08, -1.74]}>
            <mesh position={[-0.2, 0, 0]}>
              <boxGeometry args={[0.26, 0.24, 0.04]} />
              <meshStandardMaterial color="#000000" metalness={0.9} roughness={0.3} />
            </mesh>
            <mesh position={[0.2, 0, 0]}>
              <boxGeometry args={[0.26, 0.24, 0.04]} />
              <meshStandardMaterial color="#000000" metalness={0.9} roughness={0.3} />
            </mesh>
          </group>

          {/* Aggressive Laser Headlights */}
          {[-0.54, 0.54].map((x, i) => (
            <mesh key={i} position={[x, 0.2, -1.72]}>
              <boxGeometry args={[0.28, 0.08, 0.04]} />
              <meshStandardMaterial
                color="#38BDF8"
                emissive="#0284C7"
                emissiveIntensity={isLocked ? 0.3 : 1.5}
              />
            </mesh>
          ))}

          {/* Full Width L-Shape Rear Taillights */}
          <mesh position={[0, 0.25, 1.73]}>
            <boxGeometry args={[1.36, 0.07, 0.04]} />
            <meshStandardMaterial
              color="#EF4444"
              emissive="#DC2626"
              emissiveIntensity={isLocked ? 0.3 : 1.6}
            />
          </mesh>

          {/* Quad Chrome Exhaust Tips */}
          {[-0.32, -0.22, 0.22, 0.32].map((x, i) => (
            <mesh key={i} position={[x, -0.05, 1.74]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.035, 0.035, 0.08, 16]} />
              <meshStandardMaterial color="#F1F5F9" metalness={0.98} roughness={0.05} />
            </mesh>
          ))}

          {/* 4 Sport Wheels with M Alloy Rims and Brake Calipers */}
          {[
            [-0.8, -0.1, -1.05],
            [0.8, -0.1, -1.05],
            [-0.8, -0.1, 1.05],
            [0.8, -0.1, 1.05],
          ].map((pos, idx) => (
            <group key={idx} position={pos as [number, number, number]}>
              <mesh rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.35, 0.35, 0.24, 24]} />
                <meshStandardMaterial color="#05070A" roughness={0.9} />
              </mesh>
              {/* Alloy Rim Face */}
              <mesh position={[pos[0] > 0 ? 0.12 : -0.12, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.25, 0.25, 0.02, 16]} />
                <meshStandardMaterial color={rimColor} metalness={0.95} roughness={0.15} />
              </mesh>
              {/* Red Brake Caliper */}
              <mesh position={[pos[0] > 0 ? 0.09 : -0.09, 0.15, 0]}>
                <boxGeometry args={[0.04, 0.1, 0.06]} />
                <meshStandardMaterial color="#EF4444" metalness={0.8} />
              </mesh>
            </group>
          ))}
        </group>
      )}

      {/* ==================== SUPERCARS: APEX SPECTRE EV HYPERCAR ==================== */}
      {modelType === 'supercar' && (
        <group position={[0, 0.38, 0]}>
          {/* Ultra-Low Carbon Monocoque Body */}
          <mesh position={[0, 0.09, 0]}>
            <boxGeometry args={[1.75, 0.34, 3.85]} />
            <meshStandardMaterial
              color="#080C14"
              metalness={0.95}
              roughness={0.1}
            />
          </mesh>

          {/* Fighter-Jet Glass Canopy */}
          <mesh position={[0, 0.38, -0.2]}>
            <boxGeometry args={[1.18, 0.32, 1.55]} />
            <meshStandardMaterial
              color="#020617"
              metalness={0.99}
              roughness={0.02}
            />
          </mesh>

          {/* Front Carbon Splitter */}
          <mesh position={[0, -0.05, -1.95]}>
            <boxGeometry args={[1.65, 0.03, 0.25]} />
            <meshStandardMaterial color="#0A0E17" metalness={0.7} roughness={0.3} />
          </mesh>

          {/* Carbon Fiber GT Wing */}
          <group position={[0, 0.52, 1.7]}>
            <mesh>
              <boxGeometry args={[1.85, 0.04, 0.42]} />
              <meshStandardMaterial color="#1E293B" metalness={0.7} roughness={0.3} />
            </mesh>
            {/* Wing Struts */}
            <mesh position={[-0.55, -0.18, 0]}>
              <boxGeometry args={[0.04, 0.36, 0.16]} />
              <meshStandardMaterial color="#0F172A" />
            </mesh>
            <mesh position={[0.55, -0.18, 0]}>
              <boxGeometry args={[0.04, 0.36, 0.16]} />
              <meshStandardMaterial color="#0F172A" />
            </mesh>
          </group>

          {/* Cyan Underglow Neon Strip */}
          {!isLocked && (
            <mesh position={[0, -0.12, 0]}>
              <planeGeometry args={[1.6, 3.6]} />
              <meshBasicMaterial color="#06B6D4" transparent opacity={0.45} />
            </mesh>
          )}

          {/* High-Performance Wheels with Cyan Center Lock */}
          {[
            [-0.9, -0.05, -1.2],
            [0.9, -0.05, -1.2],
            [-0.92, -0.05, 1.18],
            [0.92, -0.05, 1.18],
          ].map((pos, idx) => (
            <group key={idx} position={pos as [number, number, number]}>
              <mesh rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.37, 0.37, 0.28, 24]} />
                <meshStandardMaterial color="#05070A" roughness={0.9} />
              </mesh>
              <mesh position={[pos[0] > 0 ? 0.14 : -0.14, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <ringGeometry args={[0.12, 0.3, 16]} />
                <meshStandardMaterial color="#06B6D4" metalness={0.95} roughness={0.1} />
              </mesh>
            </group>
          ))}
        </group>
      )}
    </group>
  );
};
