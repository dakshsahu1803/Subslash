import type { Alternative } from '@/types';

export const ALTERNATIVES: Record<string, Alternative> = {
  netflix: {
    free: ['YouTube (free with ads)', 'Pluto TV', 'Tubi', 'MX Player'],
    cheaper: ['Disney+ Hotstar Basic (₹299/mo)', 'JioCinema Premium (₹29/mo)'],
    tip: 'Netflix Basic with ads is ₹199/mo — 70% cheaper than Standard',
  },
  spotify: {
    free: ['YouTube Music free tier', 'Gaana free', 'JioSaavn free'],
    cheaper: ['Spotify Mini (₹7/day)', 'Spotify Student (₹59/mo)'],
    tip: 'Spotify Student plan is ₹59/mo if you have a valid .edu email',
  },
  'amazon prime': {
    free: [],
    cheaper: ['Amazon Prime Mobile (₹599/yr)'],
    tip: 'Prime Mobile plan is half the price — mobile-only streaming + free delivery',
  },
  'youtube premium': {
    free: ['YouTube with uBlock Origin browser extension', 'NewPipe (Android)'],
    cheaper: ['YouTube Premium Student (₹79/mo)'],
    tip: 'YouTube with an ad blocker gives you 90% of the experience for free',
  },
  'chatgpt plus': {
    free: ['Claude.ai free tier', 'Gemini free', 'Microsoft Copilot free', 'Perplexity free'],
    cheaper: [],
    tip: 'Claude.ai and Gemini free tiers are excellent for most daily tasks',
  },
  'canva pro': {
    free: ['Canva free tier (very generous)', 'Adobe Express free', 'Figma free tier'],
    cheaper: [],
    tip: 'Canva free has 90% of what most people need — 250K+ templates included',
  },
  'linkedin premium': {
    free: ['LinkedIn free tier', 'Glassdoor free', 'AngelList free'],
    cheaper: ['LinkedIn Career (₹1,999/mo vs Business ₹4,499/mo)'],
    tip: 'Most LinkedIn Premium features rarely justify the cost for job seekers',
  },
  notion: {
    free: ['Notion free (unlimited personal)', 'Obsidian free', 'Logseq free'],
    cheaper: [],
    tip: 'Notion free plan is unlimited for personal use — no need to pay',
  },
  dropbox: {
    free: ['Google Drive 15GB free', 'OneDrive 5GB free', 'Mega 20GB free'],
    cheaper: [],
    tip: 'Google Drive gives 15GB free vs Dropbox 2GB — switch and save',
  },
  'adobe creative cloud': {
    free: ['GIMP (Photoshop alt)', 'Inkscape (Illustrator alt)', 'DaVinci Resolve free', 'Krita free'],
    cheaper: ['Adobe Photography Plan (₹1,464/mo)', 'Affinity Suite (one-time ₹5,000)'],
    tip: 'Single-app plans cost 60% less than full Creative Cloud',
  },
  zoom: {
    free: ['Google Meet (free, 60min)', 'Jitsi Meet (free, unlimited)', 'Microsoft Teams free'],
    cheaper: [],
    tip: 'Google Meet free tier handles most meeting needs — 100 participants, 60 mins',
  },
  slack: {
    free: ['Slack free tier (90-day history)', 'Discord free', 'Microsoft Teams free'],
    cheaper: [],
    tip: 'Discord is completely free with unlimited history — great for small teams',
  },
  grammarly: {
    free: ['Grammarly free tier', 'LanguageTool free', 'Google Docs spell check'],
    cheaper: ['Grammarly Student discount'],
    tip: 'Grammarly free catches 90% of errors — premium is mostly style suggestions',
  },
  nordvpn: {
    free: ['Proton VPN free (unlimited)', 'Windscribe free (10GB/mo)'],
    cheaper: ['Surfshark (₹149/mo)'],
    tip: 'Proton VPN free tier has no data limits — great for basic privacy',
  },
  expressvpn: {
    free: ['Proton VPN free (unlimited)', 'Windscribe free (10GB/mo)'],
    cheaper: ['NordVPN (₹259/mo)', 'Surfshark (₹149/mo)'],
    tip: 'ExpressVPN is one of the most expensive VPNs — Surfshark does the same for less',
  },
  headspace: {
    free: ['Insight Timer free', 'YouTube meditation channels', 'Smiling Mind free'],
    cheaper: ['Headspace Student (50% off)'],
    tip: 'Insight Timer has 100K+ free guided meditations — no subscription needed',
  },
  calm: {
    free: ['Insight Timer free', 'YouTube sleep sounds', 'Medito free'],
    cheaper: ['Calm Student discount'],
    tip: 'Medito is 100% free and non-profit — same quality guided meditations',
  },
  'duolingo plus': {
    free: ['Duolingo free tier', 'Busuu free', 'Tandem free'],
    cheaper: ['Duolingo Family (₹649/mo for 6)'],
    tip: 'Duolingo free works perfectly for learning — Super is mostly cosmetic perks',
  },
  coursera: {
    free: ['Coursera audit mode (free)', 'edX free courses', 'Khan Academy free', 'MIT OpenCourseWare'],
    cheaper: [],
    tip: 'You can audit any Coursera course for free — you just skip the certificate',
  },
  'microsoft 365': {
    free: ['Google Workspace free', 'LibreOffice free', 'Office web apps (free)'],
    cheaper: ['Microsoft 365 Family (₹5,299/yr for 6 people)'],
    tip: 'Microsoft Office web apps are free — you only pay for desktop apps + 1TB storage',
  },
  lastpass: {
    free: ['Bitwarden free (unlimited)', 'KeePass free'],
    cheaper: ['Bitwarden Premium ($10/yr)'],
    tip: 'Bitwarden free is better than LastPass free — unlimited devices, open source',
  },
  '1password': {
    free: ['Bitwarden free (unlimited)', 'KeePass free'],
    cheaper: ['Bitwarden Premium ($10/yr)'],
    tip: 'Bitwarden gives you 95% of 1Password features at a fraction of the cost',
  },
  evernote: {
    free: ['Notion free', 'Obsidian free', 'Google Keep free', 'Apple Notes free'],
    cheaper: [],
    tip: 'Notion free has replaced Evernote for most users — unlimited pages, better UI',
  },
  todoist: {
    free: ['Todoist free (5 projects)', 'TickTick free', 'Microsoft To-Do free'],
    cheaper: [],
    tip: 'Microsoft To-Do is completely free and syncs across all devices',
  },
  pocket: {
    free: ['Pocket free tier', 'Raindrop.io free', 'Browser bookmarks'],
    cheaper: [],
    tip: 'Pocket free does everything most people need — save and read later',
  },
  readwise: {
    free: ['Notion web clipper free', 'Hypothesis free'],
    cheaper: ['Readwise Lite'],
    tip: 'A simple Notion database can replace Readwise for most highlight workflows',
  },
  superhuman: {
    free: ['Gmail (free)', 'Outlook free', 'Spark free'],
    cheaper: ['Spark Premium (₹499/mo)'],
    tip: 'Superhuman costs ₹2,500/mo — Gmail with keyboard shortcuts is 95% as fast',
  },
  figma: {
    free: ['Figma free (3 projects)', 'Penpot free (open source)', 'Lunacy free'],
    cheaper: [],
    tip: 'Figma free gives 3 projects with full features — enough for most freelancers',
  },
  'github copilot': {
    free: ['Codeium free', 'TabNine free tier', 'Amazon CodeWhisperer free'],
    cheaper: [],
    tip: 'Codeium offers free AI code completion that rivals Copilot',
  },
  loom: {
    free: ['Loom free (25 videos)', 'OBS Studio free', 'ShareX free'],
    cheaper: [],
    tip: 'OBS Studio is completely free and far more powerful for screen recording',
  },
  'disney+ hotstar': {
    free: ['JioCinema free', 'MX Player free', 'YouTube free'],
    cheaper: ['Disney+ Hotstar Mobile (₹149/mo)'],
    tip: 'JioCinema now has most sports + shows for free with a Jio connection',
  },
  'swiggy one': {
    free: [],
    cheaper: [],
    tip: 'Calculate if you order enough to justify the fee — most people save more by comparing prices per order',
  },
  'zomato gold': {
    free: [],
    cheaper: [],
    tip: 'Compare Swiggy One vs Zomato Gold — keeping both is almost always wasteful',
  },
};

export function getAlternatives(serviceName: string): Alternative | null {
  const key = serviceName.toLowerCase().trim();
  if (ALTERNATIVES[key]) return ALTERNATIVES[key];

  for (const [name, alt] of Object.entries(ALTERNATIVES)) {
    if (key.includes(name) || name.includes(key)) return alt;
  }
  return null;
}
