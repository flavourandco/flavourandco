import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Flavour & Co. | Premium Indo-Fusion Artisan Pies by Simran",
  description:
    "Delicious Indo-Australian fusion pies created by Simran, showcased on Channel 7's Plate of Origin. Delivered Sydney-wide.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-serif">{children}</body>
    </html>
  );
}
