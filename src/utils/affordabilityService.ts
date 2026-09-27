import type { AffordabilityCalculation, AffordabilityStatus } from '../types';

/**
 * Format number into Indian Rupee representation (e.g. ₹1,29,900 or ₹1.53 Cr)
 */
export function formatRupees(amount: number, compact = false): string {
  if (compact) {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2).replace(/\.00$/, '')} Cr`;
    }
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1).replace(/\.0$/, '')} L`;
    }
    if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1).replace(/\.0$/, '')}k`;
    }
  }

  // Indian Rupee standard grouping: 1,23,45,678
  const isNegative = amount < 0;
  const absAmount = Math.abs(Math.round(amount));
  const str = absAmount.toString();

  if (str.length <= 3) {
    return `${isNegative ? '-' : ''}₹${str}`;
  }

  const lastThree = str.substring(str.length - 3);
  const otherNumbers = str.substring(0, str.length - 3);
  const formattedFirstPart = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',');

  return `${isNegative ? '-' : ''}₹${formattedFirstPart},${lastThree}`;
}

/**
 * Affordability calculation engine:
 * Clean abstraction separating financial data from game state and UI
 */
export function calculateAffordability(
  productPrice: number,
  freeMoney: number,
  monthlySavingsVelocity = 14300
): AffordabilityCalculation {
  const canAffordNow = freeMoney >= productPrice;
  const rawProgress = productPrice > 0 ? freeMoney / productPrice : 1;
  const progress = Math.min(1, Math.max(0, rawProgress));
  const remaining = Math.max(0, productPrice - freeMoney);

  let status: AffordabilityStatus = 'LOCKED';
  if (canAffordNow) {
    status = 'AVAILABLE';
  } else if (progress >= 0.7) {
    status = 'PLANNED';
  } else {
    status = 'LOCKED';
  }

  const velocity = Math.max(1000, monthlySavingsVelocity);
  const monthsToUnlock = remaining > 0 ? Math.ceil(remaining / velocity) : 0;

  return {
    status,
    progress,
    remaining,
    monthlySavingsNeeded: velocity,
    monthsToUnlock,
    canAffordNow,
  };
}
