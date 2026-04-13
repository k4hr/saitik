import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs uppercase tracking-[0.16em]",
  {
    variants: {
      variant: {
        default: "bg-[#f3e8df] text-[#9d7b62]",
        selected: "bg-[#b79273] text-white",
        outline: "border border-[#d8c5b7] text-[#5f5248]",
        ivory: "border border-[#eadfd6] bg-white/80 text-[#7b6c61]"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

type BadgeProps = React.ComponentProps<"div"> &
  VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}
