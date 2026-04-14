import Link from "next/link";
import { ImagePlus, Sparkles, WandSparkles } from "lucide-react";

import Container from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export default function FreeEditShell() {
  return (
    <section className="py-10 sm:py-12 lg:py-16">
      <Container>
        <div className="mb-10 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.22em] text-[#a18672]">
            Free edit
          </p>
          <h1 className="mt-4 text-4xl leading-[1.06] text-[#3d3128] sm:text-5xl lg:text-6xl">
            Свободное редактирование
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[#726458] sm:text-lg">
            Здесь пользователь сможет загружать картинку, писать свободный
            промпт и запускать любые трансформации в одном экране.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>Исходное изображение</CardTitle>
                <CardDescription>
                  Загрузи фото или картинку, которую хочешь отредактировать.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="rounded-[28px] border border-dashed border-[#d8c5b7] bg-[#fffaf6] p-6 sm:p-8">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="inline-flex size-14 items-center justify-center rounded-full bg-[#f2e6db] text-[#9d7b62]">
                      <ImagePlus className="size-6" />
                    </div>

                    <h3 className="mt-4 text-xl text-[#3d3128]">
                      Загрузить изображение
                    </h3>

                    <p className="mt-2 max-w-xl text-sm leading-7 text-[#7e6f63]">
                      Здесь позже подключим реальный upload input, preview и
                      валидацию файлов.
                    </p>
                  </div>
                </div>

                <label className="block">
                  <span className="mb-2 block text-sm text-[#6f6156]">
                    Название задачи
                  </span>
                  <Input placeholder="Например: сделать более luxury, заменить фон, изменить одежду" />
                </label>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Свободный промпт</CardTitle>
                <CardDescription>
                  Опиши, что именно нужно сделать с изображением.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <Textarea
                  className="min-h-[220px]"
                  placeholder="Например: сделай из этого фото дорогой editorial portrait, сохрани лицо, измени одежду на молочный пиджак, замени фон на luxury interior, добавь мягкий теплый свет..."
                />

                <div className="rounded-[24px] border border-[#eadfd6] bg-[#fffaf6] p-5">
                  <div className="flex items-start gap-3">
                    <WandSparkles className="mt-0.5 size-5 text-[#a18672]" />
                    <div>
                      <p className="text-sm text-[#3d3128]">
                        Это будет отдельный свободный режим
                      </p>
                      <p className="mt-1 text-xs leading-6 text-[#7e6f63]">
                        Позже сюда легко подключим загрузку, prompt history,
                        credits и реальный вызов генерации.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-24 overflow-hidden">
              <div className="aspect-[1.18] bg-[linear-gradient(180deg,#e2d2c5_0%,#f4ece6_100%)]" />

              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-[#a18672]">
                  <Sparkles className="size-4" />
                  Сводка режима
                </div>

                <CardTitle className="mt-2">Свободное редактирование</CardTitle>

                <CardDescription>
                  Пользователь сам задает промпт, загружает картинку и дальше
                  работает без ограничений готового стиля.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-5">
                <div className="space-y-3 rounded-[24px] border border-[#eadfd6] bg-[#fffaf6] p-5">
                  <p className="text-sm text-[#3d3128]">
                    Позже сюда добавим:
                  </p>
                  <ul className="space-y-2 text-xs leading-6 text-[#7e6f63]">
                    <li>загрузку изображения</li>
                    <li>свободный prompt</li>
                    <li>стоимость в кредитах</li>
                    <li>историю генераций</li>
                    <li>повторное редактирование результата</li>
                  </ul>
                </div>

                <div className="grid gap-3">
                  <Button size="xl">Запустить режим</Button>

                  <Button asChild variant="secondary" size="xl">
                    <Link href="/dashboard/billing">Пополнить баланс</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </section>
  );
}
