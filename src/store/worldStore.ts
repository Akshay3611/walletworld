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
  previousCameraPosition: [number, number, number] | null;
  previousCameraTarget: [number, number, number] | null;
  isCelebratingUnlock: boolean;
  celebratingProduct: Product | null;
  cameraFreeOrbit: boolean;
  hasInteracted: boolean;

  // Actions
  inspectRoomObject: (productId: string | null, focus?: WorldObjectFocus) => void;
  unlockRoomItem: (product: Product) => void;
  clearCelebration: () => void;
  setCameraFreeOrbit: (free: boolean) => void;
  setHasInteracted: (interacted: boolean) => void;
  saveCurrentCamera: (pos: [number, number, number], target: [number, number, number]) => void;
}

export const useWorldStore = create<WorldState>((set) => ({
  worldLevel: 12,
  builderTitle: 'Level 12 Builder',
  unlockedRoomItems: ['prod-starter-earpiece'],
  inspectedRoomObjectId: null,
  cameraFocus: null,
  previousCameraPosition: null,
  previousCameraTarget: null,
  isCelebratingUnlock: false,
  celebratingProduct: null,
  cameraFreeOrbit: true,
  hasInteracted: false,

  inspectRoomObject: (productId, focus) => {
    set({
      inspectedRoomObjectId: productId,
      cameraFocus: focus || null,
      cameraFreeOrbit: productId === null,
      hasInteracted: true,
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

  setHasInteracted: (interacted) => {
    set({ hasInteracted: interacted });
  },

  saveCurrentCamera: (pos, target) => {
    set({
      previousCameraPosition: pos,
      previousCameraTarget: target,
    });
  },
}));
