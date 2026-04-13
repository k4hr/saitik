import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OKAK — AI фотосессии",
  description:
    "Фотосессия как на Pinterest — с твоим лицом. Загрузи фото, выбери стиль и получи премиальные AI-кадры."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
