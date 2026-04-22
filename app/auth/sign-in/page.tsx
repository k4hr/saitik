import SiteHeader from "@/components/layout/site-header";
import SiteFooter from "@/components/layout/site-footer";
import EmailSignInCard from "@/components/auth/email-sign-in-card";
import Container from "@/components/ui/container";

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-[#f8f2ed] text-[#3d3128]">
      <SiteHeader />
      <section className="py-14 sm:py-18 lg:py-24">
        <Container className="max-w-[960px]">
          <div className="mb-10 max-w-2xl">
            <p className="text-xs uppercase tracking-[0.22em] text-[#a18672]">
              Вход и регистрация
            </p>

            <h1 className="mt-4 text-4xl leading-[1.06] sm:text-5xl">
              Войди в ATELIA и управляй своими заказами
            </h1>

            <p className="mt-5 text-base leading-8 text-[#726458] sm:text-lg">
              Получите доступ к уникальному сервису.
            </p>
          </div>

          <EmailSignInCard />
        </Container>
      </section>
      <SiteFooter />
    </main>
  );
}
