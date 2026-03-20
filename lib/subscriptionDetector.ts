import type { ParsedTransaction, Subscription, SubscriptionCategory } from '@/types';

interface KnownService {
  category: SubscriptionCategory;
  logo_url: string;
  cancel_url: string;
}

const KNOWN_SUBSCRIPTIONS: Record<string, KnownService> = {
  'netflix': { category: 'entertainment', logo_url: '/logos/netflix.svg', cancel_url: 'https://www.netflix.com/cancelplan' },
  'spotify': { category: 'entertainment', logo_url: '/logos/spotify.svg', cancel_url: 'https://www.spotify.com/account/cancel' },
  'youtube premium': { category: 'entertainment', logo_url: '/logos/youtube.svg', cancel_url: 'https://www.youtube.com/paid_memberships' },
  'youtube': { category: 'entertainment', logo_url: '/logos/youtube.svg', cancel_url: 'https://www.youtube.com/paid_memberships' },
  'google one': { category: 'productivity', logo_url: '/logos/google.svg', cancel_url: 'https://one.google.com' },
  'amazon prime': { category: 'entertainment', logo_url: '/logos/amazon.svg', cancel_url: 'https://www.amazon.in/manageprime' },
  'amazon': { category: 'entertainment', logo_url: '/logos/amazon.svg', cancel_url: 'https://www.amazon.in/manageprime' },
  'hotstar': { category: 'entertainment', logo_url: '/logos/hotstar.svg', cancel_url: 'https://www.hotstar.com/account/subscription' },
  'disney': { category: 'entertainment', logo_url: '/logos/hotstar.svg', cancel_url: 'https://www.hotstar.com/account/subscription' },
  'jiocinema': { category: 'entertainment', logo_url: '/logos/jio.svg', cancel_url: 'https://www.jiocinema.com' },
  'notion': { category: 'productivity', logo_url: '/logos/notion.svg', cancel_url: 'https://www.notion.so/pricing' },
  'chatgpt': { category: 'productivity', logo_url: '/logos/openai.svg', cancel_url: 'https://chat.openai.com/settings/subscription' },
  'openai': { category: 'productivity', logo_url: '/logos/openai.svg', cancel_url: 'https://chat.openai.com/settings/subscription' },
  'github': { category: 'productivity', logo_url: '/logos/github.svg', cancel_url: 'https://github.com/settings/billing' },
  'copilot': { category: 'productivity', logo_url: '/logos/github.svg', cancel_url: 'https://github.com/settings/billing' },
  'figma': { category: 'productivity', logo_url: '/logos/figma.svg', cancel_url: 'https://www.figma.com/pricing' },
  'adobe': { category: 'productivity', logo_url: '/logos/adobe.svg', cancel_url: 'https://account.adobe.com/plans' },
  'canva': { category: 'productivity', logo_url: '/logos/canva.svg', cancel_url: 'https://www.canva.com/account' },
  'slack': { category: 'productivity', logo_url: '/logos/slack.svg', cancel_url: 'https://slack.com/account/settings' },
  'zoom': { category: 'productivity', logo_url: '/logos/zoom.svg', cancel_url: 'https://zoom.us/account' },
  'swiggy': { category: 'food', logo_url: '/logos/swiggy.svg', cancel_url: 'https://www.swiggy.com/super' },
  'zomato': { category: 'food', logo_url: '/logos/zomato.svg', cancel_url: 'https://www.zomato.com/gold' },
  'blinkit': { category: 'food', logo_url: '/logos/blinkit.svg', cancel_url: 'https://blinkit.com' },
  'cult.fit': { category: 'fitness', logo_url: '/logos/cultfit.svg', cancel_url: 'https://www.cult.fit/account' },
  'cultfit': { category: 'fitness', logo_url: '/logos/cultfit.svg', cancel_url: 'https://www.cult.fit/account' },
  'apple': { category: 'entertainment', logo_url: '/logos/apple.svg', cancel_url: 'https://support.apple.com/en-in/HT202039' },
  'icloud': { category: 'productivity', logo_url: '/logos/apple.svg', cancel_url: 'https://support.apple.com/en-in/HT207594' },
  'microsoft': { category: 'productivity', logo_url: '/logos/microsoft.svg', cancel_url: 'https://account.microsoft.com/services' },
  'linkedin': { category: 'productivity', logo_url: '/logos/linkedin.svg', cancel_url: 'https://www.linkedin.com/psettings/manage-premium' },
};

export function getKnownSubscriptionInfo(description: string): (KnownService & { name: string }) | null {
  const lower = description.toLowerCase();
  for (const [name, info] of Object.entries(KNOWN_SUBSCRIPTIONS)) {
    if (lower.includes(name)) return { name, ...info };
  }
  return null;
}

interface GroupedCharge {
  description: string;
  amounts: number[];
  dates: string[];
  matchedService: (KnownService & { name: string }) | null;
}

export function detectSubscriptions(
  transactions: ParsedTransaction[]
): Omit<Subscription, 'id' | 'upload_id'>[] {
  const debits = transactions.filter((t) => t.type === 'debit');

  // Group by similar descriptions
  const groups = new Map<string, GroupedCharge>();

  for (const tx of debits) {
    const known = getKnownSubscriptionInfo(tx.description);
    const key = known ? known.name : normalizeDescription(tx.description);

    const existing = groups.get(key);
    if (existing) {
      existing.amounts.push(tx.amount);
      existing.dates.push(tx.date);
    } else {
      groups.set(key, {
        description: known ? known.name : tx.description,
        amounts: [tx.amount],
        dates: [tx.date],
        matchedService: known,
      });
    }
  }

  const subscriptions: Omit<Subscription, 'id' | 'upload_id'>[] = [];

  for (const group of Array.from(groups.values())) {
    // At least 2 charges or a known service with 1+ charges
    if (group.amounts.length < 2 && !group.matchedService) continue;

    const avgAmount =
      group.amounts.reduce((s, a) => s + a, 0) / group.amounts.length;

    const consistentAmount = group.amounts.every(
      (a) => Math.abs(a - avgAmount) / avgAmount < 0.15
    );

    if (!consistentAmount && !group.matchedService) continue;

    const cycle = guessBillingCycle(group.dates);
    const isForgotten = group.amounts.length >= 3;

    const serviceName = group.matchedService
      ? capitalize(group.matchedService.name)
      : capitalize(group.description);

    subscriptions.push({
      service_name: serviceName,
      amount: Math.round(avgAmount * 100) / 100,
      currency: 'INR',
      billing_cycle: cycle,
      last_charged: group.dates[group.dates.length - 1],
      times_charged: group.amounts.length,
      category: group.matchedService?.category ?? 'other',
      is_forgotten: isForgotten,
      logo_url: group.matchedService?.logo_url ?? null,
      cancel_url: group.matchedService?.cancel_url ?? null,
    });
  }

  return subscriptions.sort((a, b) => b.amount - a.amount);
}

function normalizeDescription(desc: string): string {
  return desc
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .slice(0, 3)
    .join(' ');
}

function capitalize(s: string): string {
  return s
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function guessBillingCycle(dates: string[]): 'monthly' | 'yearly' | 'weekly' {
  if (dates.length < 2) return 'monthly';

  const parsedDates = dates
    .map((d) => {
      const parts = d.match(/(\d{2})[\/\-\s](\d{2}|\w{3})[\/\-\s](\d{2,4})/);
      if (!parts) return null;
      return new Date(d);
    })
    .filter(Boolean)
    .sort((a, b) => a!.getTime() - b!.getTime()) as Date[];

  if (parsedDates.length < 2) return 'monthly';

  const gaps: number[] = [];
  for (let i = 1; i < parsedDates.length; i++) {
    const diffDays =
      (parsedDates[i].getTime() - parsedDates[i - 1].getTime()) /
      (1000 * 60 * 60 * 24);
    gaps.push(diffDays);
  }

  const avgGap = gaps.reduce((s, g) => s + g, 0) / gaps.length;

  if (avgGap <= 10) return 'weekly';
  if (avgGap >= 300) return 'yearly';
  return 'monthly';
}
