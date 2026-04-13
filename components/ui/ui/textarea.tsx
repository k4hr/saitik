import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-[140px] w-full rounded-[24px] border border-[#dfd1c4] bg-white px-4 py-3 text-sm text-[#3d3128] shadow-[0_2px_10px_rgba(88,62,40,0.03)] outline-none transition placeholder:text-[#a08f82] focus-visible:ring-2 focus-visible:ring-[#caa789]/55",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
