"use client";

import { useState } from "react";
import { Download, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type GeneratedResultCardProps = {
  imagePath: string;
  downloadPath: string;
  sharePath: string;
};

export default function GeneratedResultCard({
  imagePath,
  downloadPath,
  sharePath,
}: GeneratedResultCardProps) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const shareUrl = `${window.location.origin}${sharePath}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Результат ATELIA",
          url: shareUrl,
        });
        return;
      } catch {
        // no-op
      }
    }

    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Готовый результат</CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imagePath}
          alt="Готовый результат"
          className="w-full rounded-[28px] object-cover"
        />

        <div className="grid gap-3 sm:grid-cols-2">
          <Button asChild size="xl">
            <a href={downloadPath}>
              <Download className="size-4.5" />
              Скачать
            </a>
          </Button>

          <Button variant="secondary" size="xl" onClick={handleShare}>
            <Share2 className="size-4.5" />
            {copied ? "Ссылка скопирована" : "Поделиться"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
