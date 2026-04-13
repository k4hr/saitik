"use client";

import { Link2, PinIcon, UploadCloud } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function StepReferenceUpload() {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-[#a18672]">
          Шаг 3
        </p>
        <h2 className="mt-3 text-3xl text-[#3d3128]">Референс фотосессии</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#7e6f63]">
          Пользователь сможет либо загрузить свою картинку, либо вставить ссылку
          на Pinterest. Для MVP можно оставить это как дополнительную опцию.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Свой референс</CardTitle>
          <CardDescription>
            Используй этот шаг, если хочешь получить кадры ближе к конкретной композиции,
            одежде или атмосфере.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-[28px] border border-dashed border-[#d8c5b7] bg-[#fffaf6] p-6 sm:p-8">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="inline-flex size-14 items-center justify-center rounded-full bg-[#f2e6db] text-[#9d7b62]">
                  <UploadCloud className="size-6" />
                </div>

                <h3 className="mt-4 text-xl text-[#3d3128]">
                  Загрузить референс
                </h3>

                <p className="mt-2 text-sm leading-7 text-[#7e6f63]">
                  Позже здесь будет реальный upload для Pinterest-референса или moodboard.
                </p>
              </div>
            </div>

            <div className="rounded-[28px] border border-[#eadfd6] bg-white p-5 sm:p-6">
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm text-[#6f6156]">
                  <PinIcon className="size-4" />
                  Ссылка на Pinterest
                </span>
                <Input
                  placeholder="https://pinterest.com/..."
                  defaultValue=""
                />
              </label>

              <label className="mt-4 block">
                <span className="mb-2 flex items-center gap-2 text-sm text-[#6f6156]">
                  <Link2 className="size-4" />
                  Комментарий к референсу
                </span>
                <Textarea placeholder="Например: хочу такой же свет, ракурс и настроение, но без сильного изменения лица." />
              </label>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[24px] border border-[#eadfd6] bg-[#fffaf6] p-5">
              <p className="text-sm text-[#a18672]">Подходит для</p>
              <p className="mt-2 text-sm leading-7 text-[#7e6f63]">
                Fashion-съемок, dating-фото, luxury-подачи, студийных портретов.
              </p>
            </div>

            <div className="rounded-[24px] border border-[#eadfd6] bg-[#fffaf6] p-5">
              <p className="text-sm text-[#a18672]">Лучший сценарий</p>
              <p className="mt-2 text-sm leading-7 text-[#7e6f63]">
                Когда пользователь хочет повторить конкретную композицию или вайб.
              </p>
            </div>

            <div className="rounded-[24px] border border-[#eadfd6] bg-[#fffaf6] p-5">
              <p className="text-sm text-[#a18672]">Как продавать</p>
              <p className="mt-2 text-sm leading-7 text-[#7e6f63]">
                Оставить как отдельный Pro-режим с более высоким чеком.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
