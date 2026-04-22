import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import CookieConsentBanner from "@/components/layout/cookie-consent-banner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ATELIA — AI фотосессии",
  description:
    "Премиальные фотосессии по готовым стилям и референсам с Вашим лицом.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${inter.variable} ${playfair.variable}`}>
        {children}
        <CookieConsentBanner />
      </body>
    </html>
  );
}
