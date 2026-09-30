import type { Metadata } from "next";
import { Playfair_Display, Geist, Cormorant_Garamond } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import SmoothScroll from "@/components/home/SmoothScroll";
import FloatingAdminButton from "@/components/layout/FloatingAdminButton";
import UserSyncListener from "@/components/layout/UserSyncListener";
import ToastContainer from "@/components/ui/ToastContainer";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Flavour & Co. | Premium Indo-Australian Artisan Pies by Simran",
  description:
    "Delicious Indo-Australian pies created by Simran, showcased on Channel 7's Plate of Origin.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${playfair.variable} ${geist.variable} ${cormorant.variable} h-full antialiased`}
      >
        <head>
          {/* Preconnect to media CDN & Supabase for fast parallel resource loading */}
          <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
          <link rel="dns-prefetch" href="https://res.cloudinary.com" />
          <link rel="preconnect" href="https://mxqzkuzjhqrfayixgzsm.supabase.co" crossOrigin="anonymous" />
          <link rel="dns-prefetch" href="https://mxqzkuzjhqrfayixgzsm.supabase.co" />
        </head>
        <body className="min-h-full flex flex-col font-serif">
          <UserSyncListener />
          <ToastContainer />
          <SmoothScroll>{children}</SmoothScroll>
          <FloatingAdminButton />
        </body>
      </html>
    </ClerkProvider>
  );
}
