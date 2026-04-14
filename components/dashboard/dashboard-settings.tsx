import Container from "@/components/ui/container";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type DashboardSettingsProps = {
  login: string;
  email: string;
};

export default function DashboardSettings({
  login,
  email,
}: DashboardSettingsProps) {
  return (
    <section className="py-12 sm:py-14 lg:py-18">
      <Container>
        <div className="mb-10 max-w-3xl">
          <h1 className="text-4xl leading-[1.06] text-[#3d3128] sm:text-5xl">
            Настройки
          </h1>
          <p className="mt-5 text-base leading-8 text-[#726458] sm:text-lg">
            Здесь информация об аккаунте пользователя.
          </p>
        </div>

        <Card className="rounded-[30px] border border-[#eadfd6] bg-white/90 shadow-[0_20px_60px_rgba(95,69,48,0.08)]">
          <CardHeader>
            <CardTitle>Данные аккаунта</CardTitle>
            <CardDescription>
              Базовые данные текущего пользователя.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="rounded-[20px] border border-[#eadfd6] bg-[#fffaf6] p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-[#a18672]">
                Login
              </p>
              <p className="mt-2 text-lg text-[#3d3128]">{login}</p>
            </div>

            <div className="rounded-[20px] border border-[#eadfd6] bg-[#fffaf6] p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-[#a18672]">
                Email
              </p>
              <p className="mt-2 text-lg text-[#3d3128]">{email}</p>
            </div>
          </CardContent>
        </Card>
      </Container>
    </section>
  );
}
