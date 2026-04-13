import Container from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const packs = [
  { title: "150 кредитов", price: "990 ₽", note: "Стартовый пакет" },
  { title: "400 кредитов", price: "2 490 ₽", note: "Лучший курс" },
  { title: "900 кредитов", price: "4 990 ₽", note: "Для активного использования" },
];

const transactions = [
  { type: "Пополнение", value: "+150", date: "Сегодня" },
  { type: "Генерация Old Money Portrait", value: "-40", date: "Сегодня" },
  { type: "Reroll", value: "-20", date: "Вчера" },
];

export default function DashboardBilling() {
  return (
    <section className="py-12 sm:py-14 lg:py-18">
      <Container>
        <div className="mb-10 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.22em] text-[#a18672]">Billing</p>
          <h1 className="mt-4 text-4xl leading-[1.06] sm:text-5xl">Баланс и кредиты</h1>
          <p className="mt-5 text-base leading-8 text-[#726458] sm:text-lg">
            Пользователь пополняет баланс, а затем тратит кредиты на генерации, референсы, reroll и другие действия.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
          <Card>
            <CardHeader>
              <CardTitle>Пополнить баланс</CardTitle>
              <CardDescription>
                Следующим этапом подключим оплату и реальное начисление кредитов через транзакции.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3">
              {packs.map((pack) => (
                <div key={pack.title} className="rounded-[24px] border border-[#eadfd6] bg-[#fffaf6] p-5">
                  <p className="text-sm text-[#a18672]">{pack.note}</p>
                  <h2 className="mt-3 text-2xl text-[#3d3128]">{pack.title}</h2>
                  <p className="mt-2 text-lg text-[#3d3128]">{pack.price}</p>
                  <Button size="lg" className="mt-5 w-full">Купить</Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-[#fffaf6]">
            <CardHeader>
              <CardTitle>История транзакций</CardTitle>
              <CardDescription>
                Леджер кредитов лучше хранить отдельно от самих заказов.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {transactions.map((item) => (
                <div key={`${item.type}-${item.date}`} className="flex items-center justify-between rounded-[20px] border border-[#eadfd6] bg-white p-4">
                  <div>
                    <p className="text-sm text-[#3d3128]">{item.type}</p>
                    <p className="mt-1 text-xs text-[#8f7f73]">{item.date}</p>
                  </div>
                  <p className="text-sm text-[#3d3128]">{item.value} credits</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </Container>
    </section>
  );
}
