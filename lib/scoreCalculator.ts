import type { Subscription, AIAnalysis, ScoreBreakdown, SubscriptionScore } from '@/types';
import { FAMILY_PLANS } from './familyPlans';

export function calculateSubscriptionScore(data: {
  subscriptions: Subscription[];
  analysis: AIAnalysis;
}): SubscriptionScore {
  const { subscriptions, analysis } = data;

  if (subscriptions.length === 0) {
    return {
      score: 100,
      grade: 'A+',
      breakdown: [],
      insight: 'No subscriptions to audit — you\'re subscription-free!',
    };
  }

  let score = 100;
  const breakdown: ScoreBreakdown[] = [];

  // Deduction 1: Forgotten subscriptions (-8 points each, max -40)
  const forgottenCount = subscriptions.filter((s) => s.is_forgotten).length;
  const forgottenDeduction = Math.min(forgottenCount * 8, 40);
  score -= forgottenDeduction;
  breakdown.push({
    label: 'Forgotten subscriptions',
    deduction: forgottenDeduction,
    detail: forgottenCount > 0
      ? `${forgottenCount} subscription${forgottenCount > 1 ? 's' : ''} you likely don't use`
      : 'No forgotten subscriptions found',
  });

  // Deduction 2: Duplicate services (-10 per duplicate group, max -20)
  const duplicateGroups = analysis.duplicate_groups?.length || 0;
  const dupDeduction = Math.min(duplicateGroups * 10, 20);
  score -= dupDeduction;
  breakdown.push({
    label: 'Duplicate services',
    deduction: dupDeduction,
    detail: duplicateGroups > 0
      ? `${duplicateGroups} overlapping service group${duplicateGroups > 1 ? 's' : ''}`
      : 'No duplicate services detected',
  });

  // Deduction 3: No annual plans (-5 per monthly that has annual option, max -15)
  const noAnnualCount = subscriptions.filter((s) => {
    const key = s.service_name.toLowerCase();
    const hasFamilyPlan = FAMILY_PLANS[key] ||
      Object.keys(FAMILY_PLANS).some((name) => key.includes(name));
    return hasFamilyPlan && s.billing_cycle === 'monthly';
  }).length;
  const annualDeduction = Math.min(noAnnualCount * 5, 15);
  score -= annualDeduction;
  breakdown.push({
    label: 'Missing annual discounts',
    deduction: annualDeduction,
    detail: noAnnualCount > 0
      ? `${noAnnualCount} subscription${noAnnualCount > 1 ? 's' : ''} cheaper on annual plans`
      : 'All eligible subscriptions on optimal plans',
  });

  // Deduction 4: Price increases not addressed (-5 each, max -15)
  const priceIncreaseCount = subscriptions.filter((s) => s.price_increased).length;
  const priceDeduction = Math.min(priceIncreaseCount * 5, 15);
  score -= priceDeduction;
  breakdown.push({
    label: 'Unaddressed price increases',
    deduction: priceDeduction,
    detail: priceIncreaseCount > 0
      ? `${priceIncreaseCount} service${priceIncreaseCount > 1 ? 's' : ''} quietly raised prices`
      : 'No price increases detected',
  });

  // Deduction 5: High average subscription cost
  const avgPerSub = analysis.total_monthly_burn / subscriptions.length;
  const highCostDeduction = avgPerSub > 500 ? 10 : 0;
  score -= highCostDeduction;
  breakdown.push({
    label: 'High average subscription cost',
    deduction: highCostDeduction,
    detail: highCostDeduction > 0
      ? `₹${Math.round(avgPerSub).toLocaleString('en-IN')} average per subscription`
      : `₹${Math.round(avgPerSub).toLocaleString('en-IN')} average — within healthy range`,
  });

  score = Math.max(0, Math.min(100, score));

  const grade =
    score >= 90 ? 'A+' :
    score >= 80 ? 'A' :
    score >= 70 ? 'B' :
    score >= 60 ? 'C' :
    score >= 50 ? 'D' : 'F';

  const insight =
    score >= 80
      ? 'Your subscription stack is well optimized!'
      : score >= 60
        ? 'A few tweaks could save you significantly.'
        : 'Your subscriptions need a serious audit.';

  return { score, grade, breakdown, insight };
}
