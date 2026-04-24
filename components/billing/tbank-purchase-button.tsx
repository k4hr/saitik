"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

import { Button, type ButtonProps } from "@/components/ui/button";
import type { BillingPackKey } from "@/lib/billing-packs";

type TBankPurchaseButtonProps = Omit<ButtonProps, "onClick"> & {
  packKey: BillingPackKey;
  offer?: "regular" | "welcome_studio";
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

      const data = (await response.json()) as InitResponse;

      if (!response.ok || !data.paymentUrl) {
        throw new Error(data.error || "Не удалось создать платёж");
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
