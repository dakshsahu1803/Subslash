import type { FamilyPlan } from '@/types';

export const FAMILY_PLANS: Record<string, FamilyPlan> = {
  netflix: {
    solo_price: 649,
    family_price: 999,
    max_members: 4,
    price_per_person: 250,
    saving_per_person: 399,
  },
  spotify: {
    solo_price: 119,
    family_price: 179,
    max_members: 6,
    price_per_person: 30,
    saving_per_person: 89,
  },
  'amazon prime': {
    solo_price: 1499,
    family_price: 1499,
    max_members: 2,
    price_per_person: 750,
    saving_per_person: 749,
  },
  'youtube premium': {
    solo_price: 149,
    family_price: 249,
    max_members: 5,
    price_per_person: 50,
    saving_per_person: 99,
  },
  'apple one': {
    solo_price: 195,
    family_price: 365,
    max_members: 6,
    price_per_person: 61,
    saving_per_person: 134,
  },
  'apple music': {
    solo_price: 99,
    family_price: 149,
    max_members: 6,
    price_per_person: 25,
    saving_per_person: 74,
  },
  'disney+ hotstar': {
    solo_price: 299,
    family_price: 499,
    max_members: 4,
    price_per_person: 125,
    saving_per_person: 174,
  },
  zee5: {
    solo_price: 299,
    family_price: 699,
    max_members: 5,
    price_per_person: 140,
    saving_per_person: 159,
  },
  'microsoft 365': {
    solo_price: 4899,
    family_price: 6199,
    max_members: 6,
    price_per_person: 1033,
    saving_per_person: 3866,
  },
  'duolingo plus': {
    solo_price: 549,
    family_price: 649,
    max_members: 6,
    price_per_person: 108,
    saving_per_person: 441,
  },
};

export function getFamilyPlan(serviceName: string): FamilyPlan | null {
  const key = serviceName.toLowerCase().trim();
  if (FAMILY_PLANS[key]) return FAMILY_PLANS[key];

  for (const [name, plan] of Object.entries(FAMILY_PLANS)) {
    if (key.includes(name) || name.includes(key)) return plan;
  }
  return null;
}
