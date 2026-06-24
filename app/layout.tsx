import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Fraunces, Inter } from "next/font/google";
import CustomCursor from "@/components/ui/CustomCursor";
import "./globals.css";

// ... (keep the fonts config)
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

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://inkspire.studio"),
  title: "Inkspire — From ink, we make people inspire",
  description:
    "A cinematic, scroll-driven story from ink and invention to modern creation. Inkspire — where ideas take flight.",
  openGraph: {
    title: "Inkspire — From ink, we make people inspire",
    description: "A cinematic, scroll-driven story from ink and invention to modern creation.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#060509",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        <link href="https://db.onlinewebfonts.com/c/8b75d9dcff6a48c35a46656192adf019?family=FSP+DEMO+-+PODIUM+Sharp+4.11" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col">
        {/* Global Film Grain Overlay */}
        <div 
          className="fixed inset-0 z-[9998] pointer-events-none opacity-[0.035] mix-blend-screen"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}

