import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-12 w-full rounded-2xl border border-[#dfd1c4] bg-white px-4 text-sm text-[#3d3128] shadow-[0_2px_10px_rgba(88,62,40,0.03)] outline-none transition placeholder:text-[#a08f82] focus-visible:ring-2 focus-visible:ring-[#caa789]/55",
        className
      )}
      {...props}
    />
  );
}

export { Input };
