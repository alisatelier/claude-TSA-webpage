export type Tier = "Seeker" | "Keeper" | "Elder";

export const TIER_THRESHOLDS: { name: Tier; threshold: number }[] = [
  { name: "Seeker", threshold: 0 },
  { name: "Keeper", threshold: 500 },
  { name: "Elder", threshold: 1500 },
];

export function calculateTier(lifetimeCredits: number): Tier {
  let tier: Tier = "Seeker";
  for (const t of TIER_THRESHOLDS) {
    if (lifetimeCredits >= t.threshold) {
      tier = t.name;
    }
  }
  return tier;
}

export function getTierProgress(lifetimeCredits: number): {
  tier: Tier;
  nextTier: Tier | null;
  creditsToNext: number;
  progressPercent: number;
} {
  const tier = calculateTier(lifetimeCredits);
  const currentIndex = TIER_THRESHOLDS.findIndex((t) => t.name === tier);
  const nextTierInfo = TIER_THRESHOLDS[currentIndex + 1] || null;

  if (!nextTierInfo) {
    return { tier, nextTier: null, creditsToNext: 0, progressPercent: 100 };
  }

  const currentThreshold = TIER_THRESHOLDS[currentIndex].threshold;
  const nextThreshold = nextTierInfo.threshold;
  const creditsInRange = lifetimeCredits - currentThreshold;
  const rangeSize = nextThreshold - currentThreshold;
  const progressPercent = Math.min(100, Math.round((creditsInRange / rangeSize) * 100));

  return {
    tier,
    nextTier: nextTierInfo.name,
    creditsToNext: nextThreshold - lifetimeCredits,
    progressPercent,
  };
}
