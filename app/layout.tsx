import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mansa Organic Meadows - Sustainable Agriculture & Fresh Produce",
  description:
    "Family-owned farm specializing in organic produce, grass-fed beef, and sustainable farming practices. Visit our farm stand, join our CSA, or take a tour.",
  keywords:
    "farm, organic, sustainable agriculture, fresh produce, CSA, farm tours, local food",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
