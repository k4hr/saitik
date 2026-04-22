import SiteHeader from "@/components/layout/site-header";
import SiteFooter from "@/components/layout/site-footer";
import Container from "@/components/ui/container";

export default function TermsPage() {
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
              Условия использования
            </h1>

            <div className="mt-8 space-y-6 text-base leading-8 text-[#5f5248]">
              <p>
                Сервис предоставляет пользователю доступ к AI-генерации
                изображений по готовым стилям, референсам и текстовым промптам.
              </p>

              <p>
                Пользователь самостоятельно отвечает за содержание загружаемых
                материалов, правомерность их использования и корректность
                введённых данных.
              </p>

              <p>
                Созданные результаты предоставляются в рамках функциональности
                сервиса и могут зависеть от качества исходных материалов,
                промптов и внешних моделей генерации.
              </p>

              <p>
                Используя сайт, пользователь подтверждает согласие с настоящими
                условиями использования.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <SiteFooter />
    </main>
  );
}
