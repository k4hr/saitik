"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Plus, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import R2UploadInput, {
  type UploadedClientAsset,
} from "@/components/create/r2-upload-input";

export type FaceGroup = {
  personIndex: number;
  label: string;
  assets: UploadedClientAsset[];
};

type MultiFaceUploadProps = {
  value: FaceGroup[];
  onChange: (value: FaceGroup[]) => void;
};

function buildGroups(extraPeopleCount: number, previous: FaceGroup[]): FaceGroup[] {
  return Array.from({ length: extraPeopleCount }, (_, index) => {
    const personIndex = index + 1;
    const existing = previous.find((item) => item.personIndex === personIndex);

    return {
      personIndex,
      label: `Человек ${personIndex + 1}`,
      assets: existing?.assets ?? [],
    };
  });
}

export default function MultiFaceUpload({
  value,
  onChange,
}: MultiFaceUploadProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [peopleCount, setPeopleCount] = useState<number>(1);

  useEffect(() => {
    const extraPeopleCount = Math.max(peopleCount - 1, 0);
    onChange(buildGroups(extraPeopleCount, value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [peopleCount]);

  const totalPhotos = useMemo(() => {
    return value.reduce((sum, group) => sum + group.assets.length, 0);
  }, [value]);

  function updateGroupAssets(personIndex: number, assets: UploadedClientAsset[]) {
    const next = buildGroups(Math.max(peopleCount - 1, 0), value).map((group) =>
      group.personIndex === personIndex ? { ...group, assets } : group,
    );

    onChange(next);
  }

  return (
    <Card className="overflow-hidden rounded-[28px] border border-[#eadfd6] bg-white/90 shadow-[0_14px_36px_rgba(95,69,48,0.06)]">
      <CardContent className="space-y-5 p-6 sm:p-7">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.22em] text-[#a18672]">
              Дополнительно
            </p>
            <h3 className="mt-3 text-2xl text-[#3d3128]">Добавить лицо</h3>
            <p className="mt-3 text-sm leading-7 text-[#7e6f63]">
              Если на образе или референсе больше одного человека, открой этот
              блок, укажи количество людей на картинке и загрузи лица отдельно
              для каждого дополнительного участника.
            </p>
          </div>

          <Button
            type="button"
            variant="secondary"
            size="lg"
            className="rounded-[20px]"
            onClick={() => setIsExpanded((prev) => !prev)}
          >
            <Plus className="size-4.5" />
            {isExpanded ? "Скрыть блок" : "Открыть блок"}
            <ChevronDown
              className={`size-4 transition-transform ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </Button>
        </div>

        <div className="rounded-[22px] border border-[#eadfd6] bg-[#fffaf6] p-5">
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex size-10 items-center justify-center rounded-full bg-[#f1e4d8] text-[#9f7c63]">
              <Users className="size-5" />
            </div>

            <div>
              <p className="text-sm text-[#3d3128]">
                Людей на итоговой картинке:{" "}
                <span className="font-medium">{peopleCount}</span>
              </p>
              <p className="mt-1 text-xs leading-6 text-[#7e6f63]">
                Фото дополнительных лиц: {totalPhotos}
              </p>
            </div>
          </div>

          {isExpanded ? (
            <div className="mt-5 space-y-5">
              <div>
                <p className="mb-3 text-sm text-[#6f6156]">
                  Сколько людей на финальной картинке
                </p>

                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4].map((count) => {
                    const active = peopleCount === count;

                    return (
                      <button
                        key={count}
                        type="button"
                        onClick={() => setPeopleCount(count)}
                        className={`rounded-full px-4 py-2 text-sm transition ${
                          active
                            ? "bg-[#b79273] text-white"
                            : "border border-[#d8c5b7] bg-white text-[#5f5248] hover:bg-[#efe4db]"
                        }`}
                      >
                        {count}
                      </button>
                    );
                  })}
                </div>
              </div>

              {peopleCount > 1 ? (
                <div className="space-y-5">
                  {buildGroups(Math.max(peopleCount - 1, 0), value).map((group) => (
                    <div
                      key={group.personIndex}
                      className="rounded-[24px] border border-[#eadfd6] bg-white p-4 sm:p-5"
                    >
                      <div className="mb-4">
                        <p className="text-lg text-[#3d3128]">{group.label}</p>
                        <p className="mt-1 text-sm leading-7 text-[#7e6f63]">
                          Загрузи 1–5 фото для этого человека.
                        </p>
                      </div>

                      <R2UploadInput
                        title={`Фото: ${group.label.toLowerCase()}`}
                        description="Лучше всего несколько кадров с хорошим светом, без сильных фильтров."
                        kind="face"
                        value={group.assets}
                        onChange={(assets) =>
                          updateGroupAssets(group.personIndex, assets)
                        }
                        multiple
                        maxFiles={5}
                      />
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
