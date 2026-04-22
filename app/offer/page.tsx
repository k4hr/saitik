import SiteHeader from "@/components/layout/site-header";
import SiteFooter from "@/components/layout/site-footer";
import Container from "@/components/ui/container";

export default function OfferPage() {
  return (
    <main className="min-h-screen bg-[#f8f2ed] text-[#3d3128]">
      <SiteHeader />

      <section className="py-14 sm:py-18 lg:py-24">
        <Container className="max-w-[920px]">
          <div className="rounded-[32px] border border-[#eadfd6] bg-white/90 p-8 shadow-[0_18px_48px_rgba(61,49,40,0.06)] sm:p-10">
            <p className="text-xs uppercase tracking-[0.22em] text-[#a18672]">
              Документ
            </p>
            <h1 className="mt-4 text-4xl leading-[1.06] sm:text-5xl">
              Оферта
            </h1>

            <div className="mt-8 space-y-6 text-base leading-8 text-[#5f5248]">
              <p>
                Настоящая оферта регулирует порядок предоставления пользователю
                доступа к платным функциям сервиса, включая покупку кредитов и
                использование генерации изображений.
              </p>

              <p>
                Стоимость услуг определяется тарифами и ценами, опубликованными
                на сайте на момент оплаты.
              </p>

              <p>
                Пополнение баланса и использование кредитов означает согласие
                пользователя с условиями настоящей оферты.
              </p>

              <p>
                Использование сервиса после оплаты считается акцептом данной
                оферты.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <SiteFooter />
    </main>
  );
}
