
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "VETOR — Estúdio de Desenvolvimento Digital",
    template: "%s — VETOR",
  },

  description:
    "Estúdio independente de desenvolvimento digital. Websites, aplicativos, sistemas e automações feitos para ir além do comum.",

  icons: {
    icon: [
      {
        url: "/images/logo.png",
        type: "image/png",
        sizes: "any",
      },
    ],
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${geist.variable} ${geistMono.variable}`}
    >
      <body className="bg-ink font-sans text-ice antialiased">
        {children}
      </body>
    </html>
  );
}
