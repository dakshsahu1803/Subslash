import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "SubSlash — Kill Forgotten Subscriptions",
  description:
    "Upload your bank statement. AI finds every forgotten subscription in 30 seconds. Stop paying for things you forgot about.",
  keywords: [
    "subscriptions",
    "fintech",
    "bank statement",
    "AI",
    "savings",
    "cancel subscriptions",
    "subscription tracker",
    "personal finance",
  ],
  authors: [{ name: "SubSlash" }],
  openGraph: {
    title: "SubSlash — Kill Forgotten Subscriptions",
    description:
      "Upload your bank statement. AI finds every forgotten subscription in 30 seconds.",
    url: "https://subslash.vercel.app",
    siteName: "SubSlash",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "SubSlash — Kill Forgotten Subscriptions",
    description:
      "Upload your bank statement. AI finds every forgotten subscription in 30 seconds.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans antialiased", inter.variable)}>
      <body className="min-h-screen bg-[#0a0a0a]">{children}</body>
    </html>
  );
}
