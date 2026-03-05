import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SD Shows — San Diego Live Music",
  description:
    "Upcoming live music shows across San Diego venues. Search artists, find tickets, and listen on Spotify, Apple Music, and YouTube.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${dmSans.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
