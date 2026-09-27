import React from 'react';
import { Main3DCanvas } from '../scenes/Main3DCanvas';
import { WalletHUD } from '../components/WalletHUD';
import { Navigation } from '../components/Navigation';
import { Dashboard } from '../screens/Dashboard';
import { Shop } from '../screens/Shop';
import { Garage } from '../screens/Garage';
import { Home } from '../screens/Home';
import { Avatar } from '../screens/Avatar';
import { Wallet } from '../screens/Wallet';
import { Categories } from '../screens/Categories';
import { ProductDetail } from '../screens/ProductDetail';
import { PurchaseSuccess } from '../screens/PurchaseSuccess';
import { useWalletStore } from '../store/walletStore';

export const App: React.FC = () => {
  const activeScreen = useWalletStore(s => s.activeScreen);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#080A0E] text-[#F8FAFC]">
      {/* 3D WebGL Game Engine Layer */}
      <Main3DCanvas />

      {/* Floating HUD Header */}
      <WalletHUD />

      {/* Primary Navigation System */}
      <Navigation />

      {/* Active Screen UI Overlay */}
      <main className="relative z-10 w-full h-full pointer-events-none">
        {activeScreen === 'dashboard' && <Dashboard />}
        {activeScreen === 'shop' && <Shop />}
        {activeScreen === 'garage' && <Garage />}
        {activeScreen === 'home' && <Home />}
        {activeScreen === 'avatar' && <Avatar />}
        {activeScreen === 'wallet' && <Wallet />}
        {activeScreen === 'categories' && <Categories />}
      </main>

      {/* Interactive Modals */}
      <ProductDetail />
      <PurchaseSuccess />
    </div>
  );
};
