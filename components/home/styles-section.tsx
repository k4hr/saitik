import Link from "next/link";

import SectionShell from "@/components/layout/section-shell";
import { Button } from "@/components/ui/button";
import { stylePresets } from "@/lib/data/style-presets";
import { getSession } from "@/lib/auth";

export default async function StylesSection() {
  const session = await getSession();

  return (
    <SectionShell
      id="styles"
      eyebrow="Каталог образов"
      title="Выбирай готовую эстетику, а не думай над промптом"
      description="Пользователь входит в аккаунт, выбирает стиль и запускает генерацию из личного кабинета с оплатой кредитами."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stylePresets.slice(0, 6).map((item, index) => {
          const styleHref = session
            ? `/create?style=${item.id}`
            : "/auth/sign-in";

          return (
            <div
              key={item.id}
              className="group overflow-hidden rounded-[30px] border border-[#eadfd6] bg-white shadow-[0_10px_35px_rgba(88,62,40,0.06)] transition hover:-translate-y-1"
            >
              <div
                className={`aspect-[1/1.18] ${
                  index % 3 === 0
                    ? "bg-[linear-gradient(180deg,#dac7b8_0%,#f3ebe5_100%)]"
                    : index % 3 === 1
                      ? "bg-[linear-gradient(180deg,#e8ddd3_0%,#f8f3ee_100%)]"
                      : "bg-[linear-gradient(180deg,#ccb7a8_0%,#efe5de_100%)]"
                }`}
              />
              <div className="p-6">
                <h3 className="text-2xl text-[#3d3128]">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#7e6f63]">
                  {item.description}
                </p>

                <Button asChild variant="secondary" size="lg" className="mt-5">
                  <Link href={styleHref}>Выбрать стиль</Link>
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </SectionShell>
  );
}
