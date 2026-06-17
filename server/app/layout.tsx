import type { Metadata } from "next";
import { Manrope, Syne } from "next/font/google";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NutriMind — Open-Source AI Nutrition Tracking",
  description:
    "NutriMind turns anything you eat into instant calories and macros with Gemini AI. No barcode scanning, no meal plans—just type what you ate. Open source and self-hostable.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${syne.variable} ${manrope.variable} antialiased bg-[#0D1210] text-[#EFF5F0]`}
      >
        {children}
      </body>
    </html>
  );
}
