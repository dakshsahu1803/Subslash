import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#080808",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "SubSlash — Find & Kill Forgotten Subscriptions",
  description:
    "AI-powered subscription audit for Indians. Upload your bank statement, find forgotten subscriptions, and save ₹22,000/year in minutes.",
  keywords: [
    "subscriptions",
    "fintech",
    "bank statement",
    "AI",
    "savings",
    "cancel subscriptions",
    "subscription tracker",
    "personal finance",
    "India",
    "money management",
  ],
  authors: [{ name: "Daksh Sahu" }],
  openGraph: {
    title: "SubSlash — Find & Kill Forgotten Subscriptions",
    description:
      "AI-powered subscription audit for Indians. Upload your bank statement, find forgotten subscriptions, and save ₹22,000/year in minutes.",
    url: "https://subslash.vercel.app",
    siteName: "SubSlash",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "SubSlash — Find & Kill Forgotten Subscriptions",
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
      <body className="min-h-screen bg-[#080808]">
        <TooltipProvider>
          {children}
        </TooltipProvider>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#111111",
              color: "#ffffff",
              border: "1px solid #1a1a1a",
              borderRadius: "12px",
              fontSize: "13px",
            },
            success: {
              iconTheme: {
                primary: "#00ff88",
                secondary: "#111111",
              },
            },
            error: {
              iconTheme: {
                primary: "#ff4444",
                secondary: "#111111",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
