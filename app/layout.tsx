import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { PageTransition } from "@/components/page-transition";
import { CustomCursor } from "@/components/cursor";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "GitMan | GitHub Intelligence Explorer",
  description: "Explore GitHub profiles and repositories deeply with live stats and stunning visuals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0d1117] text-[#c9d1d9] selection:bg-[#39d353]/30 min-h-screen font-sans overflow-x-hidden`}
      >
        <CustomCursor />
        {/* Ambient Mesh Background */}
        <div className="mesh-gradient-bg pointer-events-none">
          <div className="mesh-blob mesh-blob-1 rounded-full absolute mix-blend-screen" />
          <div className="mesh-blob mesh-blob-2 rounded-full absolute mix-blend-screen" />
          <div className="mesh-blob mesh-blob-3 rounded-full absolute mix-blend-screen" />
        </div>
        {/* Graph Paper Grid Line overlay */}
        <div className="pointer-events-none fixed inset-0 z-[-1] graph-grid opacity-100" />
        
        <PageTransition>
          {children}
        </PageTransition>
      </body>
    </html>
  );
}
