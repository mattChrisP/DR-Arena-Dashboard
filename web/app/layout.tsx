import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "DR-Arena — Deep Research Agent Leaderboard",
    template: "%s · DR-Arena",
  },
  description:
    "DR-Arena is an automated evaluation framework for Deep Research agents. Dynamic information trees, adaptive difficulty, and 0.94 Spearman correlation with LMSYS Search Arena.",
  metadataBase: new URL("https://mattchrisp.github.io/DR-Arena-Test/"),
  openGraph: {
    title: "DR-Arena — Deep Research Agent Leaderboard",
    description:
      "Automated evaluation for deep research agents. 0.94 Spearman with LMSYS Search Arena.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-fg">
        <SiteHeader />
        <main className="flex-1 flex flex-col items-center">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
