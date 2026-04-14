import { ReactNode } from "react";

import { cn } from "@/lib/utils";
import Container from "@/components/ui/container";

type SectionShellProps = {
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  centered?: boolean;
};

export default function SectionShell({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
  innerClassName,
  centered = true
}: SectionShellProps) {
  return (
    <section id={id} className={cn("py-16 sm:py-20 lg:py-28", className)}>
      <Container>
        {(eyebrow || title || description) ? (
          <div
            className={cn(
              "mb-10 sm:mb-12 lg:mb-14",
              centered ? "text-center" : "text-left"
            )}
          >
            {eyebrow ? (
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.22em] text-[#a18672]">
                {eyebrow}
              </p>
            ) : null}

            {title ? (
              <h2 className="mx-auto max-w-4xl text-3xl leading-tight text-[#3d3128] sm:text-4xl lg:text-5xl">
                {title}
              </h2>
            ) : null}

            {description ? (
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#7e6f63] sm:text-base">
                {description}
              </p>
            ) : null}
          </div>
        ) : null}

        <div className={innerClassName}>{children}</div>
      </Container>
    </section>
  );
}
