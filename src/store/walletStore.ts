import { create } from 'zustand';
import type { 
  ScreenType, 
  Product, 
  UpcomingDeduction, 
  UserProfile, 
  AvatarCustomization 
} from '../types';
import { 
  initialProducts, 
  initialUserProfile, 
  initialWalletData, 
  upcomingDeductions 
} from '../data/mockData';
import { calculateAffordability } from '../utils/affordabilityService';
import { sound } from '../utils/audioService';

interface WalletState {
  user: UserProfile;
  wallet: {
    total: number;
    free: number;
    planned: number;
    locked: number;
  };
  activeScreen: ScreenType;
  selectedProductId: string | null;
  products: Product[];
  inventory: Product[];
  deductions: UpcomingDeduction[];
  avatarGear: AvatarCustomization;
  soundEnabled: boolean;
  purchaseCelebrationItem: Product | null;
  isInspecting: boolean;

  // Actions
  setScreen: (screen: ScreenType) => void;
  selectProduct: (id: string | null) => void;
  buyProduct: (productId: string) => boolean;
  addSimulatedFunds: (amount: number) => void;
  toggleSound: () => void;
  updateAvatarGear: (gear: Partial<AvatarCustomization>) => void;
  closePurchaseCelebration: () => void;
  resetSimulation: () => void;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  user: { ...initialUserProfile },
  wallet: { ...initialWalletData },
  activeScreen: 'dashboard',
  selectedProductId: null,
  products: [...initialProducts],
  inventory: [
    // Pre-unlocked starter item
    {
      id: 'prod-starter-earpiece',
      name: 'Cyber Earpiece Neo',
      brand: 'Apex Wear',
      category: 'audio',
      price: 4999,
      description: 'Ultralight bone-conduction titanium audio link.',
      specs: { 'Battery': '18h', 'Link': 'Ultra-wideband' },
      modelType: 'headphones',
    }
  ],
  deductions: [...upcomingDeductions],
  avatarGear: {
    jacket: 'stealth_bomber',
    shirtColor: '#10B981',
    pants: 'techwear_cargo',
    shoes: 'air_cyber',
    accessory: 'hud_visor',
    watch: 'digital_cyber',
  },
  soundEnabled: true,
  purchaseCelebrationItem: null,
  isInspecting: false,

  setScreen: (screen: ScreenType) => {
    sound.playWhoosh();
    set({ 
      activeScreen: screen,
      selectedProductId: null,
      isInspecting: false,
    });
  },

  selectProduct: (id: string | null) => {
    if (id) {
      sound.playClick();
      set({ selectedProductId: id, isInspecting: true });
    } else {
      set({ selectedProductId: null, isInspecting: false });
    }
  },

  buyProduct: (productId: string): boolean => {
    const { products, wallet, inventory } = get();
    const product = products.find(p => p.id === productId);
    if (!product) return false;

    const calc = calculateAffordability(product.price, wallet.free);
    if (!calc.canAffordNow) {
      sound.playLock();
      return false;
    }

    // Process purchase: deduct from free and total wallet
    const newFree = wallet.free - product.price;
    const newTotal = wallet.total - product.price;

    sound.playUnlock();

    set({
      wallet: {
        ...wallet,
        free: newFree,
        total: newTotal,
      },
      inventory: [...inventory, product],
      purchaseCelebrationItem: product,
      isInspecting: false,
    });

    return true;
  },

  addSimulatedFunds: (amount: number) => {
    sound.playCoin();
    set(state => ({
      wallet: {
        ...state.wallet,
        free: state.wallet.free + amount,
        total: state.wallet.total + amount,
      },
      user: {
        ...state.user,
        netWorth: state.user.netWorth + amount,
      }
    }));
  },

  toggleSound: () => {
    const next = !get().soundEnabled;
    sound.enabled = next;
    set({ soundEnabled: next });
    if (next) sound.playClick();
  },

  updateAvatarGear: (gear: Partial<AvatarCustomization>) => {
    sound.playClick();
    set(state => ({
      avatarGear: {
        ...state.avatarGear,
        ...gear,
      }
    }));
  },

  closePurchaseCelebration: () => {
    sound.playClick();
    set({ purchaseCelebrationItem: null });
  },

  resetSimulation: () => {
    sound.playClick();
    set({
      wallet: { ...initialWalletData },
      user: { ...initialUserProfile },
      selectedProductId: null,
      isInspecting: false,
    });
  }
}));
