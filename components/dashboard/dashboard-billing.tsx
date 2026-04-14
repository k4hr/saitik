import Container from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const packs = [
  { title: "150 кредитов", price: "990 ₽", note: "Стартовый пакет" },
  { title: "400 кредитов", price: "2 490 ₽", note: "Лучший курс" },
  { title: "900 кредитов", price: "4 990 ₽", note: "Для активного использования" },
];

const topupTransactions = [
  { type: "Пополнение баланса", value: "+150 credits", amountRub: "990 ₽", date: "Сегодня" },
  { type: "Пополнение баланса", value: "+400 credits", amountRub: "2 490 ₽", date: "12 апреля 2026" },
  { type: "Пополнение баланса", value: "+900 credits", amountRub: "4 990 ₽", date: "8 апреля 2026" },
];

export default function DashboardBilling() {
  return (
    <section className="py-12 sm:py-14 lg:py-18">
      <Container>
        <div className="mb-10 max-w-3xl">
          <h1 className="text-4xl leading-[1.06] text-[#3d3128] sm:text-5xl">
            Пополнить баланс
          </h1>
          <p className="mt-5 text-base leading-8 text-[#726458] sm:text-lg">
            Здесь пользователь пополняет кредиты и видит всю историю своих пополнений.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
          <Card className="rounded-[30px] border border-[#eadfd6] bg-white/85 shadow-[0_20px_60px_rgba(95,69,48,0.08)]">
            <CardHeader>
              <CardTitle>Выберите пакет</CardTitle>
              <CardDescription>
                После подключения оплаты здесь будут реальные покупки кредитов.
              </CardDescription>
            </CardHeader>

            <CardContent className="grid gap-4 sm:grid-cols-3">
              {packs.map((pack) => (
                <div
                  key={pack.title}
                  className="rounded-[24px] border border-[#eadfd6] bg-[#fffaf6] p-5 shadow-[0_10px_30px_rgba(95,69,48,0.05)]"
                >
                  <p className="text-sm text-[#a18672]">{pack.note}</p>
                  <h2 className="mt-3 text-2xl text-[#3d3128]">{pack.title}</h2>
                  <p className="mt-2 text-lg text-[#3d3128]">{pack.price}</p>
                  <Button size="lg" className="mt-5 w-full">
                    Купить
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-[30px] border border-[#eadfd6] bg-[#fffaf6] shadow-[0_20px_60px_rgba(95,69,48,0.08)]">
            <CardHeader>
              <CardTitle>История транзакций</CardTitle>
              <CardDescription>
                Здесь отображаются все пополнения баланса пользователя.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {topupTransactions.map((item) => (
                <div
                  key={`${item.type}-${item.date}-${item.amountRub}`}
                  className="rounded-[20px] border border-[#eadfd6] bg-white p-4 shadow-[0_8px_24px_rgba(95,69,48,0.04)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-[#3d3128]">{item.type}</p>
                      <p className="mt-1 text-xs text-[#8f7f73]">{item.date}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-[#3d3128]">{item.value}</p>
                      <p className="mt-1 text-xs text-[#8f7f73]">{item.amountRub}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </Container>
    </section>
  );
}
