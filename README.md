# SubSlash — Kill Forgotten Subscriptions

A personal finance web app that uses AI to detect and audit subscriptions from bank statements. Upload your PDF bank statement, and SubSlash identifies every recurring charge, flags forgotten subscriptions, calculates your burn rate, and generates cancellation letters — all in seconds.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4, shadcn/ui
- **Database:** Supabase (PostgreSQL + Storage)
- **AI:** Claude API (claude-haiku-4-5-20251001) via Anthropic SDK
- **Charts:** Recharts
- **PDF Parsing:** pdf-parse
- **Deploy:** Vercel

## Features

- **AI-Powered Detection** — Upload a bank statement PDF and Claude AI extracts every recurring subscription
- **Smart Categorization** — Subscriptions auto-categorized into entertainment, productivity, fitness, food, etc.
- **Forgotten Subscription Flagging** — AI identifies likely forgotten or duplicate subscriptions
- **Burn Rate Dashboard** — Donut charts by category, bar charts by service, daily spend calculation
- **Cancel Letter Generator** — One-click AI-generated cancellation emails with copy-to-clipboard
- **Share Card** — Generate and download a shareable image of your audit results
- **Mobile Responsive** — Works seamlessly on phone, tablet, and desktop

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A [Supabase](https://supabase.com) project
- An [Anthropic](https://console.anthropic.com) API key

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/subslash.git
cd subslash
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_DIRECT_URL=postgresql://postgres:your-password@db.your-project.supabase.co:5432/postgres
ANTHROPIC_API_KEY=sk-ant-api03-your-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Set up Supabase database

Run the SQL in `supabase-schema.sql` in your Supabase SQL Editor to create the required tables (`uploads`, `subscriptions`, `ai_analysis`), indexes, and RLS policies.

Create a storage bucket named `statements` in your Supabase dashboard (Settings → Storage) and set it to public.

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Build for production

```bash
npm run build
npm start
```

## Deploy to Vercel

1. Push your code to GitHub
2. Connect the repository to [Vercel](https://vercel.com)
3. Add the environment variables in Vercel's project settings
4. Deploy — Vercel auto-detects Next.js and uses the `vercel.json` config

## Project Structure

```
subslash/
├── app/
│   ├── api/
│   │   ├── upload/route.ts    # PDF upload → Supabase Storage
│   │   ├── parse/route.ts     # PDF text extraction → AI analysis
│   │   ├── analyze/route.ts   # Claude AI subscription detection
│   │   └── cancel/route.ts    # AI cancellation letter generation
│   ├── dashboard/page.tsx     # Main subscription audit dashboard
│   ├── upload/page.tsx        # Drag-and-drop PDF upload
│   ├── error.tsx              # Error boundary
│   ├── not-found.tsx          # 404 page
│   ├── layout.tsx             # Root layout with metadata
│   └── page.tsx               # Landing page
├── components/
│   ├── Navbar.tsx             # Responsive navigation
│   ├── UploadZone.tsx         # Drag-and-drop upload component
│   ├── SubscriptionCard.tsx   # Individual subscription display
│   ├── BurnRateChart.tsx      # Recharts donut + bar charts
│   ├── SavingsAdvisor.tsx     # AI recommendations panel
│   ├── CancelModal.tsx        # Cancellation letter modal
│   ├── ShareCard.tsx          # Shareable audit image generator
│   └── DashboardSkeleton.tsx  # Loading skeleton placeholders
├── hooks/
│   └── useCountUp.ts          # Animated counter hook
├── lib/
│   ├── supabase.ts            # Supabase client config
│   ├── claude.ts              # Anthropic client config
│   ├── pdfParser.ts           # PDF text extraction
│   └── subscriptionDetector.ts # Known subscription matching
├── types/
│   └── index.ts               # TypeScript type definitions
└── supabase-schema.sql        # Database schema
```

## License

MIT
