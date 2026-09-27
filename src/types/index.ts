export type ScreenType = 
  | 'dashboard' 
  | 'shop' 
  | 'garage' 
  | 'home' 
  | 'avatar' 
  | 'wallet' 
  | 'categories';

export type ProductCategory = 
  | 'phones' 
  | 'laptops' 
  | 'audio' 
  | 'gaming' 
  | 'watches' 
  | 'fashion' 
  | 'bikes' 
  | 'cars' 
  | 'supercars' 
  | 'apartments' 
  | 'villas' 
  | 'travel';

export type AffordabilityStatus = 'AVAILABLE' | 'PLANNED' | 'LOCKED';

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  price: number; // in INR (₹)
  description: string;
  specs: { [key: string]: string };
  imagePlaceholder?: string;
  modelType: 
    | 'phone' 
    | 'laptop' 
    | 'headphones' 
    | 'watch' 
    | 'console' 
    | 'camera' 
    | 'luxury_watch' 
    | 'sneaker' 
    | 'bike' 
    | 'car' 
    | 'supercar' 
    | 'apartment' 
    | 'villa';
  featured?: boolean;
}

export interface AffordabilityCalculation {
  status: AffordabilityStatus;
  progress: number; // 0 to 1
  remaining: number;
  monthlySavingsNeeded: number;
  monthsToUnlock: number;
  canAffordNow: boolean;
}

export interface UpcomingDeduction {
  id: string;
  name: string;
  category: string;
  amount: number;
  dueDate: string;
  isAutoDebit: boolean;
  priority: 'high' | 'medium' | 'low';
}

export interface AvatarCustomization {
  jacket: 'stealth_bomber' | 'cyber_neon' | 'luxury_trench' | 'tactical_vest';
  shirtColor: string;
  pants: 'techwear_cargo' | 'formal_slate' | 'denim_raw';
  shoes: 'air_cyber' | 'runner_zero' | 'formal_oxford';
  accessory: 'hud_visor' | 'smart_specs' | 'holo_earpiece' | 'none';
  watch: 'chronograph_gold' | 'digital_cyber' | 'none';
}

export interface UserProfile {
  name: string;
  title: string;
  level: number;
  netWorth: number;
  savingsStreakWeeks: number;
  monthlyIncome: number;
  monthlySavingsVelocity: number;
}
