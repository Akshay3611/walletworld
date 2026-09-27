import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { CameraController } from '../components/CameraController';
import { HomeScene } from './HomeScene';
import { ShopScene } from './ShopScene';
import { GarageScene } from './GarageScene';
import { HouseScene } from './HouseScene';
import { AvatarScene } from './AvatarScene';
import { WalletScene } from './WalletScene';
import { CategoriesScene } from './CategoriesScene';
import { useWalletStore } from '../store/walletStore';

export const Main3DCanvas: React.FC = () => {
  const activeScreen = useWalletStore(s => s.activeScreen);

  return (
    <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-[#F1F5F9]">
      <Canvas
        camera={{ position: [0, 2.4, 4.8], fov: 48 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: false,
        }}
        dpr={[1, 1.5]} // Capped at 1.5 for integrated GPU performance
      >
        <color attach="background" args={['#F1F5F9']} />
        <fog attach="fog" args={['#E2E8F0', 16, 48]} />

        {/* Global Camera System with Lerp Transitions */}
        <CameraController />

        <Suspense fallback={null}>
          {activeScreen === 'dashboard' && <HomeScene />}
          {activeScreen === 'shop' && <ShopScene />}
          {activeScreen === 'garage' && <GarageScene />}
          {activeScreen === 'home' && <HouseScene />}
          {activeScreen === 'avatar' && <AvatarScene />}
          {activeScreen === 'wallet' && <WalletScene />}
          {activeScreen === 'categories' && <CategoriesScene />}
        </Suspense>
      </Canvas>
    </div>
  );
};
