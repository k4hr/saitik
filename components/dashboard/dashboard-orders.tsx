import Container from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type GenerationItem = {
  id: string;
  title: string;
  status: string;
  credits: number;
  createdAtLabel: string;
};

type DashboardOrdersProps = {
  generations: GenerationItem[];
};

export default function DashboardOrders({
  generations,
}: DashboardOrdersProps) {
  return (
    <section className="py-12 sm:py-14 lg:py-18">
      <Container>
        <div className="mb-10 max-w-3xl">
          <h1 className="text-4xl leading-[1.06] text-[#3d3128] sm:text-5xl">
            Мои генерации
          </h1>
          <p className="mt-5 text-base leading-8 text-[#726458] sm:text-lg">
            Здесь пользователь видит свои заказы, статусы генерации и списание кредитов.
          </p>
        </div>

        <div className="space-y-4">
          {generations.length === 0 ? (
            <Card className="rounded-[28px] border border-[#eadfd6] bg-white/90 shadow-[0_16px_40px_rgba(95,69,48,0.06)]">
              <CardContent className="p-6 text-sm leading-7 text-[#7e6f63]">
                У пользователя пока нет генераций.
              </CardContent>
            </Card>
          ) : (
            generations.map((generation) => (
              <Card
                key={generation.id}
                className="rounded-[28px] border border-[#eadfd6] bg-white/90 shadow-[0_16px_40px_rgba(95,69,48,0.06)]"
              >
                <CardContent className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-sm text-[#a18672]">{generation.id}</p>
                    <h2 className="mt-2 text-2xl text-[#3d3128]">
                      {generation.title}
                    </h2>
                    <p className="mt-2 text-sm leading-7 text-[#7e6f63]">
                      Создано: {generation.createdAtLabel}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant="ivory">{generation.status}</Badge>
                    <Badge variant="default">
                      {generation.credits} credits
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </Container>
    </section>
  );
}
