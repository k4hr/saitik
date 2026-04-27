export const dynamic = "force-dynamic";

import { Suspense } from "react";
import Script from "next/script";
import Link from "next/link";
import Container from "@/components/ui/container";
import VkCallbackClient from "@/components/auth/vk-callback-client";

export default function VkCallbackPage() {
  return (
    <main className="min-h-screen bg-[#f8f2ed] text-[#3d3128]">
      <Script
        src="https://unpkg.com/@vkid/sdk@<3.0.0/dist-sdk/umd/index.js"
        strategy="afterInteractive"
      />

      <section className="py-14 sm:py-18 lg:py-24">
        <Container className="max-w-[720px]">
          <div className="rounded-[32px] border border-[#eadfd6] bg-white/90 p-8 shadow-[0_24px_80px_rgba(88,62,40,0.08)]">
            <div className="mb-6 flex items-center justify-between gap-4">
              <p className="text-xs uppercase tracking-[0.22em] text-[#a18672]">
                ATELIA
              </p>

              <Link
                href="/auth/sign-in"
                className="text-sm text-[#8f7f73] underline underline-offset-4 transition hover:text-[#3d3128]"
              >
                Назад ко входу
              </Link>
            </div>

            <h1 className="text-3xl leading-tight sm:text-4xl">
              Вход через ВКонтакте
            </h1>

            <Suspense
              fallback={
                <div className="mt-6 flex items-center gap-3 rounded-2xl border border-[#d8e8d5] bg-[#f5fbf3] px-4 py-4 text-[#4f7a4c]">
                  <span>Подтверждаем вход через ВКонтакте...</span>
                </div>
              }
            >
              <VkCallbackClient />
            </Suspense>
          </div>
        </Container>
      </section>
    </main>
  );
}
