"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

import { Button, type ButtonProps } from "@/components/ui/button";
import type { BillingPackKey } from "@/lib/billing-packs";

type PurchaseOffer = "regular" | "welcome_studio" | "business_flash";

type TBankPurchaseButtonProps = Omit<ButtonProps, "onClick"> & {
  packKey: BillingPackKey;
  offer?: PurchaseOffer;
};

type InitResponse = {
  ok?: boolean;
  paymentUrl?: string;
  error?: string;
};

export default function TBankPurchaseButton({
  packKey,
  offer = "regular",
  children,
  disabled,
  ...buttonProps
}: TBankPurchaseButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleClick() {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/payments/tbank/init", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          packKey,
          offer,
        }),
      });

      const contentType = response.headers.get("content-type") || "";
      let data: InitResponse | null = null;
      let rawText = "";

      if (contentType.includes("application/json")) {
        data = (await response.json()) as InitResponse;
      } else {
        rawText = await response.text();
      }

      if (!response.ok) {
        throw new Error(
          data?.error ||
            rawText ||
            `Ошибка создания платежа (HTTP ${response.status})`,
        );
      }

      if (!data?.paymentUrl) {
        throw new Error("Сервер не вернул ссылку на оплату");
      }

      window.location.href = data.paymentUrl;
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Не удалось создать платёж",
      );
      setIsSubmitting(false);
    }
  }

  return (
    <Button
      {...buttonProps}
      disabled={disabled || isSubmitting}
      onClick={handleClick}
    >
      {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
      {children}
    </Button>
  );
}
