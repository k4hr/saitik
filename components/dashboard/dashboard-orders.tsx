import Container from "@/components/ui/container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const orders = [
  { id: "ORD-1001", title: "Old Money Portrait", status: "DONE", credits: 40 },
  { id: "ORD-1002", title: "Pinterest Soft", status: "PROCESSING", credits: 40 },
  { id: "ORD-1003", title: "Business Clean + Reference", status: "PAID", credits: 70 },
];

export default function DashboardOrders() {
  return (
    <section className="py-12 sm:py-14 lg:py-18">
      <Container>
        <div className="mb-10 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.22em] text-[#a18672]">Orders</p>
          <h1 className="mt-4 text-4xl leading-[1.06] sm:text-5xl">Заказы пользователя</h1>
          <p className="mt-5 text-base leading-8 text-[#726458] sm:text-lg">
            Эта страница подготовлена под реальные статусы заказов и списание кредитов по каждому сценарию.
          </p>
        </div>

        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm text-[#a18672]">{order.id}</p>
                  <h2 className="mt-2 text-2xl text-[#3d3128]">{order.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-[#7e6f63]">
                    После подключения базы здесь будут дата создания, вложения, результаты и ссылка на заказ.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="ivory">{order.status}</Badge>
                  <Badge variant="default">{order.credits} credits</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
