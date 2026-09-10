import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cavyn // Institutional AI Boardroom",
  description: "Voice-Native Multi-Agent Arbitration Engine",
  icons: {
    icon: "/Cavyn_Logo_noname.png",
    shortcut: "/Cavyn_Logo_noname.png",
    apple: "/Cavyn_Logo_noname.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased bg-[#050811] text-slate-100`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-[#050811] text-slate-100"
      >
        {children}
      </body>
    </html>
  );
}
