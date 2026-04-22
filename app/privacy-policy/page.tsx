import SiteHeader from "@/components/layout/site-header";
import SiteFooter from "@/components/layout/site-footer";
import Container from "@/components/ui/container";

export default function PrivacyPolicyPage() {
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
              Политика конфиденциальности
            </h1>

            <div className="mt-8 space-y-6 text-base leading-8 text-[#5f5248]">
              <p>
                Мы обрабатываем данные пользователя только в объеме, необходимом
                для работы сервиса, создания аккаунта, хранения заказов,
                пополнения баланса и отображения результатов генерации.
              </p>

              <p>
                В рамках работы сервиса могут обрабатываться email, логин,
                технические данные авторизации, история заказов, баланс кредитов,
                загруженные изображения и созданные результаты.
              </p>

              <p>
                Cookies используются для корректной работы интерфейса,
                авторизации, сохранения пользовательских настроек и улучшения
                качества сервиса.
              </p>

              <p>
                Пользователь, продолжая использовать сайт, соглашается с данной
                политикой конфиденциальности.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <SiteFooter />
    </main>
  );
}
