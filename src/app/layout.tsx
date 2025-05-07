import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { OfflineFallback } from "@/components/ui/OfflineFallback";
import { ServiceWorkerRegistration } from "@/components/ui/ServiceWorkerRegistration";
import { AppShell } from "@/components/ui/AppShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cafe Inventory Tracker",
  description: "An offline-first inventory tracker for church coffee team",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Cafe Inventory",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#4f46e5",
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        {/* Prefetch key resources for offline use */}
        <link rel="prefetch" href="/fallback.html" />
        <link rel="prefetch" href="/inventory" />
        <link rel="prefetch" href="/enter-password" />
        <link rel="prefetch" href="/icons/icon-192x192.png" />
        <link rel="prefetch" href="/icons/icon-512x512.png" />
        {/* Add a network detection meta tag for better user experience */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppShell>
          {children}
          <Toaster />
          <OfflineFallback />
        </AppShell>
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
