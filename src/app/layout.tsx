import type { Metadata } from "next";
import { Navbar } from "@/components/navbar/navbar";
import { Lexend } from 'next/font/google';
import Providers from "../context/provider";
import "./globals.css";
import { SiteFooter } from "@/components/footer";

export const lexend = Lexend({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'], // Choose weights you need
  variable: '--font-lexend', // Optional: CSS variable
  display: 'swap',
});


export const metadata: Metadata = {
  title: "InstitutionPort",
  description: "A user-institution collaboration portal service.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={lexend.variable} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Institution Port</title>
      </head>
      <body className="flex min-h-screen flex-col">
        <Providers>
          {/* Sticky Navbar */}
          <div className="sticky z-50 top-0 w-full border-b bg-background">
            <Navbar />
          </div>

          {/* Children start below Navbar */}
          <div className="flex-1">{children}</div>

          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
