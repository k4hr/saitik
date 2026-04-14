import Container from "@/components/ui/container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardSettings() {
  return (
    <section className="py-12 sm:py-14 lg:py-18">
      <Container>
        <div className="mb-10 max-w-3xl">
          <h1 className="text-4xl leading-[1.06] text-[#3d3128] sm:text-5xl">
            Настройки
          </h1>
          <p className="mt-5 text-base leading-8 text-[#726458] sm:text-lg">
            Здесь позже будут настройки аккаунта, email, пароль и параметры профиля.
          </p>
        </div>

        <Card className="rounded-[30px] border border-[#eadfd6] bg-white/90 shadow-[0_20px_60px_rgba(95,69,48,0.08)]">
          <CardHeader>
            <CardTitle>Раздел в разработке</CardTitle>
            <CardDescription>
              Подключим реальные настройки пользователя на следующем этапе.
            </CardDescription>
          </CardHeader>

          <CardContent className="text-sm leading-7 text-[#7e6f63]">
            • изменение login<br />
            • смена email<br />
            • смена пароля<br />
            • управление аккаунтом
          </CardContent>
        </Card>
      </Container>
    </section>
  );
}
