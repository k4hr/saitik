import Link from "next/link";
import { Sparkles, Check, Clock3, Gift } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  BILLING_PACKS,
  STUDIO_PROMO_PRICE_RUB,
} from "@/lib/billing-packs";
import TBankPurchaseButton from "@/components/billing/tbank-purchase-button";

function formatRub(value: number): string {
  return `${new Intl.NumberFormat("ru-RU").format(value)} ₽`;
}

function formatTimeLeft(targetDate: Date): string {
  const diff = targetDate.getTime() - Date.now();

  if (diff <= 0) {
    return "00:00:00";
  }

  const totalSeconds = Math.floor(diff / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
}

export default async function PricingSection() {
  const session = await getSession();
  const primaryHref = session ? "/dashboard/billing" : "/auth/sign-in";

  const user = session
    ? await prisma.user.findUnique({
        where: { id: session.userId },
        select: {
          welcomeOfferEndsAt: true,
        },
      })
    : null;

  const hasWelcomeOffer =
    Boolean(user?.welcomeOfferEndsAt) &&
    user!.welcomeOfferEndsAt!.getTime() > Date.now();

  const studioRegularPriceRub = 1490;
  const studioDiscountRub = studioRegularPriceRub - STUDIO_PROMO_PRICE_RUB;
  const timeLeft = hasWelcomeOffer
    ? formatTimeLeft(user!.welcomeOfferEndsAt!)
    : null;

  return (
    <section
      id="pricing"
      className="relative overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(222,207,194,0.65),transparent_32%),linear-gradient(180deg,#2d241f_0%,#4f3f35_38%,#d9c8bb_100%)] py-16 text-white sm:py-20 lg:py-24"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-120px] top-[80px] h-[280px] w-[280px] rounded-full bg-[#8b6b56]/25 blur-3xl" />
        <div className="absolute right-[-100px] top-[-40px] h-[360px] w-[360px] rounded-full bg-[#d8c0ad]/20 blur-3xl" />
        <div className="absolute bottom-[-120px] left-1/2 h-[280px] w-[280px] -translate-x-1/2 rounded-full bg-[#f4ebe4]/15 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-medium uppercase tracking-[0.26em] text-[#ead6c7]">
            Тарифы
          </p>

          <h2 className="mt-4 text-4xl leading-[1.02] text-white sm:text-5xl lg:text-6xl">
            Кредиты для генерации фотосессий
          </h2>

          <p className="mt-5 text-base leading-8 text-white/78 sm:text-lg">
            10 кредитов = 1 изображение. Новым пользователям даём бесплатный
            бонус, чтобы можно было протестировать сервис без оплаты.
          </p>
        </div>

        {hasWelcomeOffer ? (
          <div className="mx-auto mt-10 max-w-6xl overflow-hidden rounded-[32px] border border-white/14 bg-white/10 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.12)] backdrop-blur-md sm:p-8">
            <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-full bg-white/15 text-white">
                    <Gift className="size-5" />
                  </div>

                  <p className="text-sm uppercase tracking-[0.24em] text-[#ead6c7]">
                    Предложение для нового пользователя
                  </p>
                </div>

                <h3 className="mt-5 text-3xl leading-tight text-white sm:text-4xl">
                  Вам начислено 10 кредитов за регистрацию
                </h3>

                <p className="mt-4 max-w-2xl text-base leading-8 text-white/78">
                  Только первый час после регистрации действует специальная
                  цена на тариф <span className="font-medium text-white">Студия</span>.
                </p>

                <div className="mt-6 flex flex-wrap items-end gap-3">
                  <span className="text-xl text-white/52 line-through">
                    {formatRub(studioRegularPriceRub)}
                  </span>
                  <span className="text-4xl font-semibold text-white">
                    {formatRub(STUDIO_PROMO_PRICE_RUB)}
                  </span>
                  <span className="rounded-full bg-white/12 px-3 py-1 text-sm text-[#ead6c7]">
                    Выгода {formatRub(studioDiscountRub)}
                  </span>
                </div>
              </div>

              <div className="rounded-[28px] border border-white/12 bg-white/8 p-6">
                <div className="flex items-center gap-3">
                  <Clock3 className="size-5 text-[#ead6c7]" />
                  <p className="text-sm uppercase tracking-[0.18em] text-[#ead6c7]">
                    До конца акции
                  </p>
                </div>

                <p className="mt-4 text-4xl font-semibold tracking-[0.06em] text-white">
                  {timeLeft}
                </p>

                <div className="mt-6">
                  {session ? (
                    <TBankPurchaseButton
                      packKey="studio"
                      offer="welcome_studio"
                      size="lg"
                      className="w-full bg-white text-[#2f241d] hover:bg-[#f7efe9]"
                    >
                      Купить тариф Студия
                    </TBankPurchaseButton>
                  ) : (
                    <Button
                      asChild
                      size="lg"
                      className="w-full bg-white text-[#2f241d] hover:bg-[#f7efe9]"
                    >
                      <Link href={primaryHref}>
                        <span className="text-[#2f241d]">
                          Купить тариф Студия
                        </span>
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <div className="mt-10 grid gap-5 lg:grid-cols-4">
          {BILLING_PACKS.map((pack) => {
            const isPromoStudio = hasWelcomeOffer && pack.key === "studio";
            const actualPriceRub = isPromoStudio
              ? STUDIO_PROMO_PRICE_RUB
              : pack.priceRub;

            return (
              <div
                key={pack.key}
                className={`relative rounded-[32px] border p-7 shadow-[0_18px_50px_rgba(0,0,0,0.18)] backdrop-blur-sm ${
                  pack.featured
                    ? "border-[#d9b392] bg-[#fff9f4] text-[#2f241d]"
                    : "border-white/12 bg-white/92 text-[#2f241d]"
                }`}
              >
                {pack.featured && pack.badge ? (
                  <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#bc9670] px-4 py-2 text-sm font-medium text-white shadow-[0_10px_24px_rgba(95,69,48,0.20)]">
                    {pack.badge}
                  </div>
                ) : null}

                <h3 className="text-3xl italic text-[#2f241d]">{pack.name}</h3>
                <p className="mt-2 text-lg text-[#6e5d51]">{pack.subtitle}</p>

                <div className="mt-7">
                  {isPromoStudio ? (
                    <div className="space-y-2">
                      <p className="text-xl text-[#9d8470] line-through">
                        {formatRub(pack.priceRub)}
                      </p>
                      <p className="text-5xl font-semibold tracking-tight text-[#1f1712]">
                        {formatRub(actualPriceRub)}
                      </p>
                      <p className="text-sm text-[#9d8470]">
                        Только для новых пользователей
                      </p>
                    </div>
                  ) : (
                    <p className="text-5xl font-semibold tracking-tight text-[#1f1712]">
                      {formatRub(actualPriceRub)}
                    </p>
                  )}
                </div>

                <div className="mt-5 flex items-center gap-2 text-[#2f241d]">
                  <Sparkles className="size-5 text-[#bc9670]" />
                  <p className="text-2xl font-medium">
                    {pack.credits} кредитов
                  </p>
                </div>

                <div className="mt-7 border-t border-[#eadfd6] pt-5">
                  <p className="text-sm font-medium uppercase tracking-[0.16em] text-[#9d8470]">
                    Хватит на
                  </p>

                  <div className="mt-4 flex items-center gap-3 text-[#2f241d]">
                    <div className="flex size-6 items-center justify-center rounded-full bg-[#bc9670] text-white">
                      <Check className="size-4" />
                    </div>
                    <p className="text-lg">{pack.images} изображений</p>
                  </div>

                  <p className="mt-4 text-sm leading-7 text-[#6e5d51]">
                    Стандартная генерация: 1 фото = 10 кредитов.
                  </p>
                </div>

                {session ? (
                  <TBankPurchaseButton
                    packKey={pack.key}
                    offer={isPromoStudio ? "welcome_studio" : "regular"}
                    size="lg"
                    className={`mt-8 w-full ${
                      pack.featured
                        ? "bg-[#bc9670] text-[#2f241d] hover:bg-[#b18861]"
                        : "bg-[#2f241d] text-white hover:bg-[#241b16]"
                    }`}
                  >
                    Купить
                  </TBankPurchaseButton>
                ) : (
                  <Button
                    asChild
                    size="lg"
                    className={`mt-8 w-full ${
                      pack.featured
                        ? "bg-[#bc9670] text-[#2f241d] hover:bg-[#b18861]"
                        : "bg-[#2f241d] text-white hover:bg-[#241b16]"
                    }`}
                  >
                    <Link href={primaryHref}>
                      <span
                        className={
                          pack.featured ? "text-[#2f241d]" : "text-white"
                        }
                      >
                        Купить
                      </span>
                    </Link>
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        {!hasWelcomeOffer ? (
          <div className="mt-8 rounded-[30px] border border-white/15 bg-white/10 p-6 shadow-[0_16px_40px_rgba(0,0,0,0.10)] backdrop-blur-md sm:p-7">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-3xl">
                <div className="flex items-center gap-3">
                  <div className="flex size-14 items-center justify-center rounded-full bg-white/15 text-white">
                    <Sparkles className="size-6" />
                  </div>

                  <div>
                    <h3 className="text-2xl text-white">
                      Бесплатные кредиты для новых пользователей
                    </h3>
                    <p className="mt-2 text-base leading-7 text-white/78">
                      После регистрации пользователь получает 10 кредитов — этого
                      хватит на 1 бесплатную генерацию.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                asChild
                size="xl"
                className="min-w-[240px] bg-white text-[#2f241d] hover:bg-[#f7efe9]"
              >
                <Link href={session ? "/create" : "/auth/sign-in"}>
                  <span className="text-[#2f241d]">
                    {session ? "Начать" : "Попробовать бесплатно"}
                  </span>
                </Link>
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
