"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

type EntityVisibilityToggleProps = {
  id: string;
  endpoint: string;
  initialIsActive: boolean;
  onChanged?: (nextValue: boolean) => void;
};

export default function EntityVisibilityToggle({
  id,
  endpoint,
  initialIsActive,
  onChanged,
}: EntityVisibilityToggleProps) {
  const [isActive, setIsActive] = useState(initialIsActive);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorText, setErrorText] = useState("");

  async function handleToggle() {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorText("");

    try {
      const response = await fetch(`${endpoint}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isActive: !isActive,
        }),
      });

      const data = (await response.json()) as {
        ok?: boolean;
        error?: string;
        item?: { isActive?: boolean };
        category?: { isActive?: boolean };
        subcategory?: { isActive?: boolean };
      };

      if (!response.ok) {
        throw new Error(data.error || "Не удалось обновить видимость");
      }

      const nextValue =
        data.item?.isActive ??
        data.category?.isActive ??
        data.subcategory?.isActive ??
        !isActive;

      setIsActive(Boolean(nextValue));
      onChanged?.(Boolean(nextValue));
    } catch (error) {
      setErrorText(
        error instanceof Error ? error.message : "Ошибка обновления",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <Button
        type="button"
        variant={isActive ? "secondary" : "default"}
        size="lg"
        onClick={handleToggle}
        disabled={isSubmitting}
      >
        {isSubmitting
          ? "Сохраняем..."
          : isActive
            ? "Скрыть"
            : "Показать"}
      </Button>

      {errorText ? (
        <p className="text-right text-xs text-[#8b4f43]">{errorText}</p>
      ) : null}
    </div>
  );
}
