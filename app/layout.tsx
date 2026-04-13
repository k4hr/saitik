import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ATELIA — AI фотосессии",
  description:
    "Премиальные AI-фотосессии по готовым стилям и референсам. Авторизация по email, баланс кредитов и личный кабинет с заказами.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
