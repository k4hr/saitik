import Container from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const packs = [
  {
    title: "60 кредитов",
    price: "290 ₽",
    note: "Старт · 6 изображений",
    featured: false,
  },
  {
    title: "160 кредитов",
    price: "690 ₽",
    note: "Креатор · 16 изображений",
    featured: false,
  },
  {
    title: "380 кредитов",
    price: "1 490 ₽",
    note: "Студия · 38 изображений",
    featured: true,
  },
  {
    title: "800 кредитов",
    price: "2 990 ₽",
    note: "Бизнес · 80 изображений",
    featured: false,
  },
];

type TransactionItem = {
  id: string;
  credits: number;
  amountRub: number;
  dateLabel: string;
};

type DashboardBillingProps = {
  transactions: TransactionItem[];
};

function formatRub(value: number): string {
  return new Intl.NumberFormat("ru-RU").format(value) + " ₽";
}

export default function DashboardBilling({
  transactions,
}: DashboardBillingProps) {
  return (
    <section className="py-12 sm:py-14 lg:py-18">
      <Container>
        <div className="mb-10 max-w-3xl">
          <h1 className="text-4xl leading-[1.06] text-[#3d3128] sm:text-5xl">
            Пополнить баланс
          </h1>
          <p className="mt-5 text-base leading-8 text-[#726458] sm:text-lg">
            10 кредитов = 1 изображение. После регистрации пользователь получает
            10 бесплатных кредитов, чтобы попробовать 1 генерацию без оплаты.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
          <Card className="rounded-[30px] border border-[#eadfd6] bg-white/85 shadow-[0_20px_60px_rgba(95,69,48,0.08)]">
            <CardHeader>
              <CardTitle>Выберите пакет</CardTitle>
              <CardDescription>
                Подберите удобный объём кредитов для генерации фотосессий.
              </CardDescription>
            </CardHeader>

            <CardContent className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {packs.map((pack) => (
                <div
                  key={pack.title}
                  className={`rounded-[24px] border p-5 shadow-[0_10px_30px_rgba(95,69,48,0.05)] ${
                    pack.featured
                      ? "border-[#caa789] bg-[#fff7f1]"
                      : "border-[#eadfd6] bg-[#fffaf6]"
                  }`}
                >
                  {pack.featured ? (
                    <span className="inline-flex rounded-full bg-[#f1e0d1] px-3 py-1 text-xs uppercase tracking-[0.18em] text-[#9a7658]">
                      Лучший выбор
                    </span>
                  ) : null}

                  <p className="mt-3 text-sm text-[#a18672]">{pack.note}</p>
                  <h2 className="mt-3 text-2xl text-[#3d3128]">{pack.title}</h2>
                  <p className="mt-2 text-lg text-[#3d3128]">{pack.price}</p>

                  <p className="mt-4 text-sm leading-7 text-[#7e6f63]">
                    Стандартная генерация списывает 10 кредитов за 1 изображение.
                  </p>

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
              {transactions.length === 0 ? (
                <div className="rounded-[20px] border border-[#eadfd6] bg-white p-4 text-sm text-[#7e6f63]">
                  Пока нет ни одного пополнения.
                </div>
              ) : (
                transactions.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-[20px] border border-[#eadfd6] bg-white p-4 shadow-[0_8px_24px_rgba(95,69,48,0.04)]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-[#3d3128]">
                          Пополнение баланса
                        </p>
                        <p className="mt-1 text-xs text-[#8f7f73]">
                          {item.dateLabel}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-[#3d3128]">
                          +{item.credits} credits
                        </p>
                        <p className="mt-1 text-xs text-[#8f7f73]">
                          {formatRub(item.amountRub)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </Container>
    </section>
  );
}
