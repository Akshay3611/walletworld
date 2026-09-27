import { create } from 'zustand';
import type { Product } from '../types';

export interface WorldObjectFocus {
  position: [number, number, number];
  target: [number, number, number];
}

interface WorldState {
  worldLevel: number;
  builderTitle: string;
  unlockedRoomItems: string[]; // List of product IDs owned and rendered in the apartment
  inspectedRoomObjectId: string | null;
  cameraFocus: WorldObjectFocus | null;
  isCelebratingUnlock: boolean;
  celebratingProduct: Product | null;
  cameraFreeOrbit: boolean;

  // Actions
  inspectRoomObject: (productId: string | null, focus?: WorldObjectFocus) => void;
  unlockRoomItem: (product: Product) => void;
  clearCelebration: () => void;
  setCameraFreeOrbit: (free: boolean) => void;
}

export const useWorldStore = create<WorldState>((set) => ({
  worldLevel: 12,
  builderTitle: 'Level 12 Builder',
  unlockedRoomItems: ['prod-starter-earpiece'],
  inspectedRoomObjectId: null,
  cameraFocus: null,
  isCelebratingUnlock: false,
  celebratingProduct: null,
  cameraFreeOrbit: true,

  inspectRoomObject: (productId, focus) => {
    set({
      inspectedRoomObjectId: productId,
      cameraFocus: focus || null,
      cameraFreeOrbit: productId === null,
    });
  },

  unlockRoomItem: (product) => {
    set((state) => ({
      unlockedRoomItems: Array.from(new Set([...state.unlockedRoomItems, product.id])),
      isCelebratingUnlock: true,
      celebratingProduct: product,
      worldLevel: state.worldLevel + 1,
    }));
  },

  clearCelebration: () => {
    set({ isCelebratingUnlock: false, celebratingProduct: null });
  },

  setCameraFreeOrbit: (free) => {
    set({ cameraFreeOrbit: free });
  },
}));
