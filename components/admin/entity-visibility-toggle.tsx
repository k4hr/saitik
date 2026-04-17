"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";

type EntityVisibilityToggleProps = {
  id?: string;
  endpoint?: string;
  initialIsActive?: boolean;

  apiPath?: string;
  isActive?: boolean;

  onChanged?: (nextValue: boolean) => void;
};

export default function EntityVisibilityToggle(props: EntityVisibilityToggleProps) {
  const resolvedPath = useMemo(() => {
    if (props.apiPath) {
      return props.apiPath;
    }

    if (props.endpoint && props.id) {
      return `${props.endpoint}/${props.id}`;
    }

    return "";
  }, [props.apiPath, props.endpoint, props.id]);

  const initialValue =
    typeof props.initialIsActive === "boolean"
      ? props.initialIsActive
      : Boolean(props.isActive);

  const [active, setActive] = useState(initialValue);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorText, setErrorText] = useState("");

  async function handleToggle() {
    if (!resolvedPath || isSubmitting) return;

    setIsSubmitting(true);
    setErrorText("");

    try {
      const response = await fetch(resolvedPath, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isActive: !active,
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
        !active;

      setActive(Boolean(nextValue));
      props.onChanged?.(Boolean(nextValue));
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
        variant={active ? "secondary" : "default"}
        size="lg"
        onClick={handleToggle}
        disabled={isSubmitting || !resolvedPath}
      >
        {isSubmitting ? "Сохраняем..." : active ? "Скрыть" : "Показать"}
      </Button>

      {errorText ? (
        <p className="text-right text-xs text-[#8b4f43]">{errorText}</p>
      ) : null}
    </div>
  );
}
