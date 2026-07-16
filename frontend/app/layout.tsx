// ====================================================
// Root Layout
// Wraps the entire app with the Inter font and the
// Theme provider (light/dark mode context).
// ====================================================

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PhotoAI Studio | Organize • Find • Edit • Generate",
  description:
    "AI-powered photo organization, face grouping, image generation, and editing tools.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
