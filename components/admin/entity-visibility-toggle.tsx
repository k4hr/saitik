"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

type EntityVisibilityToggleProps = {
  apiPath: string;
  isActive: boolean;
};

export default function EntityVisibilityToggle({
  apiPath,
  isActive,
}: EntityVisibilityToggleProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(isActive);

  async function handleToggle() {
    try {
      setLoading(true);

      const response = await fetch(apiPath, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isActive: !active,
        }),
      });

      if (!response.ok) {
        setLoading(false);
        return;
      }

      setActive((prev) => !prev);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      type="button"
      variant="secondary"
      size="lg"
      onClick={handleToggle}
      disabled={loading}
      className="min-w-[150px]"
    >
      {active ? <EyeOff className="size-4.5" /> : <Eye className="size-4.5" />}
      {loading ? "Сохраняем..." : active ? "Скрыть" : "Показать"}
    </Button>
  );
}
