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
  metadataBase: new URL("https://www.ateliaai.ru"),
  title: {
    default: "ATELIA — ИИ фотосессии",
    template: "%s | ATELIA",
  },
  description:
    "Премиальные фотосессии по готовым стилям и референсам с Вашим лицом.",
  alternates: {
    canonical: "https://www.ateliaai.ru",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png" }],
    shortcut: ["/favicon.ico"],
  },
  openGraph: {
    type: "website",
    url: "https://www.ateliaai.ru",
    siteName: "ATELIA",
    title: "ATELIA — AI фотосессии",
    description:
      "Премиальные фотосессии по готовым стилям и референсам с Вашим лицом.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ATELIA — AI фотосессии",
    description:
      "Премиальные фотосессии по готовым стилям и референсам с Вашим лицом.",
  },
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
