// Design system color tokens
export const COLORS = {
  bgPrimary: '#080808',
  bgSecondary: '#0f0f0f',
  bgCard: '#111111',
  bgCardHover: '#161616',
  borderDefault: '#1a1a1a',
  borderHover: '#2a2a2a',
  accentGreen: '#00ff88',
  accentGreenDim: 'rgba(0, 255, 136, 0.08)',
  accentGreenGlow: 'rgba(0, 255, 136, 0.15)',
  dangerRed: '#ff4444',
  dangerRedDim: 'rgba(255, 68, 68, 0.08)',
  warningAmber: '#ffaa00',
  warningDim: 'rgba(255, 170, 0, 0.08)',
  purpleAccent: '#a855f7',
  purpleDim: 'rgba(168, 85, 247, 0.08)',
  textPrimary: '#ffffff',
  textSecondary: '#888888',
  textTertiary: '#444444',
} as const;

// Service name -> domain for Clearbit logos
export const SERVICE_DOMAINS: Record<string, string> = {
  netflix: 'netflix.com',
  spotify: 'spotify.com',
  youtube: 'youtube.com',
  'youtube premium': 'youtube.com',
  'amazon prime': 'amazon.com',
  amazon: 'amazon.com',
  hotstar: 'hotstar.com',
  'disney+ hotstar': 'hotstar.com',
  disney: 'hotstar.com',
  notion: 'notion.so',
  chatgpt: 'openai.com',
  'chatgpt plus': 'openai.com',
  openai: 'openai.com',
  github: 'github.com',
  'github copilot': 'github.com',
  copilot: 'github.com',
  figma: 'figma.com',
  adobe: 'adobe.com',
  'adobe creative cloud': 'adobe.com',
  canva: 'canva.com',
  'canva pro': 'canva.com',
  slack: 'slack.com',
  zoom: 'zoom.us',
  swiggy: 'swiggy.com',
  'swiggy one': 'swiggy.com',
  zomato: 'zomato.com',
  'zomato gold': 'zomato.com',
  'cult.fit': 'cultfit.com',
  cultfit: 'cultfit.com',
  apple: 'apple.com',
  icloud: 'apple.com',
  'apple music': 'apple.com',
  'apple one': 'apple.com',
  microsoft: 'microsoft.com',
  'microsoft 365': 'microsoft.com',
  linkedin: 'linkedin.com',
  'linkedin premium': 'linkedin.com',
  'google one': 'google.com',
  jiocinema: 'jiocinema.com',
  blinkit: 'blinkit.com',
  grammarly: 'grammarly.com',
  nordvpn: 'nordvpn.com',
  expressvpn: 'expressvpn.com',
  headspace: 'headspace.com',
  calm: 'calm.com',
  duolingo: 'duolingo.com',
  'duolingo plus': 'duolingo.com',
  coursera: 'coursera.org',
  lastpass: 'lastpass.com',
  '1password': '1password.com',
  evernote: 'evernote.com',
  todoist: 'todoist.com',
  dropbox: 'dropbox.com',
  loom: 'loom.com',
  superhuman: 'superhuman.com',
  readwise: 'readwise.io',
  pocket: 'getpocket.com',
  zee5: 'zee5.com',
};

export function getClearbitLogoUrl(serviceName: string): string {
  const key = serviceName.toLowerCase().trim();
  if (SERVICE_DOMAINS[key]) {
    return `https://logo.clearbit.com/${SERVICE_DOMAINS[key]}`;
  }
  for (const [name, domain] of Object.entries(SERVICE_DOMAINS)) {
    if (key.includes(name) || name.includes(key)) {
      return `https://logo.clearbit.com/${domain}`;
    }
  }
  return `https://logo.clearbit.com/${key.replace(/\s+/g, '')}.com`;
}

// Direct cancel URLs for top 20 services
export const CANCEL_URLS: Record<string, string> = {
  netflix: 'https://www.netflix.com/cancelplan',
  spotify: 'https://www.spotify.com/account/cancel',
  'amazon prime': 'https://www.amazon.in/gp/primecentral',
  'youtube premium': 'https://www.youtube.com/paid_memberships',
  'chatgpt plus': 'https://chat.openai.com/settings/subscription',
  'canva pro': 'https://www.canva.com/settings/billing',
  'linkedin premium': 'https://www.linkedin.com/mypreferences/d/manage-premium',
  notion: 'https://www.notion.so/my-account',
  dropbox: 'https://www.dropbox.com/account/plan',
  'adobe creative cloud': 'https://account.adobe.com/plans',
  'disney+ hotstar': 'https://www.hotstar.com/in/account/subscription',
  zoom: 'https://zoom.us/account',
  slack: 'https://slack.com/intl/en-in/help/articles/218915077-Manage-billing-',
  grammarly: 'https://account.grammarly.com/subscription',
  nordvpn: 'https://my.nordaccount.com/dashboard/nordvpn/',
  headspace: 'https://www.headspace.com/settings/subscription',
  calm: 'https://www.calm.com/account',
  'duolingo plus': 'https://www.duolingo.com/settings/subscription',
  'github copilot': 'https://github.com/settings/copilot',
  'swiggy one': 'https://www.swiggy.com/super',
};

// Category configuration
export const CATEGORY_CONFIG: Record<string, { label: string; color: string; bgColor: string; borderColor: string }> = {
  entertainment: { label: 'Entertainment', color: 'text-purple-400', bgColor: 'bg-purple-500/10', borderColor: 'border-purple-500/20' },
  productivity: { label: 'Productivity', color: 'text-blue-400', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/20' },
  fitness: { label: 'Fitness', color: 'text-orange-400', bgColor: 'bg-orange-500/10', borderColor: 'border-orange-500/20' },
  food: { label: 'Food', color: 'text-yellow-400', bgColor: 'bg-yellow-500/10', borderColor: 'border-yellow-500/20' },
  utilities: { label: 'Utilities', color: 'text-cyan-400', bgColor: 'bg-cyan-500/10', borderColor: 'border-cyan-500/20' },
  education: { label: 'Education', color: 'text-emerald-400', bgColor: 'bg-emerald-500/10', borderColor: 'border-emerald-500/20' },
  other: { label: 'Other', color: 'text-zinc-400', bgColor: 'bg-zinc-500/10', borderColor: 'border-zinc-500/20' },
};

// Popular services for manual add quick-select chips
export const POPULAR_SERVICES = [
  { name: 'Netflix', domain: 'netflix.com', amount: 649, category: 'entertainment' },
  { name: 'Spotify', domain: 'spotify.com', amount: 119, category: 'entertainment' },
  { name: 'Amazon Prime', domain: 'amazon.com', amount: 1499, category: 'entertainment' },
  { name: 'YouTube Premium', domain: 'youtube.com', amount: 149, category: 'entertainment' },
  { name: 'ChatGPT Plus', domain: 'openai.com', amount: 1680, category: 'productivity' },
  { name: 'Canva Pro', domain: 'canva.com', amount: 499, category: 'productivity' },
  { name: 'LinkedIn Premium', domain: 'linkedin.com', amount: 1999, category: 'productivity' },
  { name: 'Disney+ Hotstar', domain: 'hotstar.com', amount: 299, category: 'entertainment' },
  { name: 'Swiggy One', domain: 'swiggy.com', amount: 149, category: 'food' },
  { name: 'Zomato Gold', domain: 'zomato.com', amount: 300, category: 'food' },
  { name: 'Dropbox', domain: 'dropbox.com', amount: 972, category: 'productivity' },
  { name: 'Adobe Creative Cloud', domain: 'adobe.com', amount: 4899, category: 'productivity' },
] as const;

// Nav links
export const NAV_LINKS = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/savings', label: 'Savings' },
  { href: '/calendar', label: 'Calendar' },
  { href: '/budget', label: 'Budget' },
  { href: '/notifications', label: 'Notifications' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
] as const;
