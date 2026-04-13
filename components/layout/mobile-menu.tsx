"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
};

type MobileMenuProps = {
  items: NavItem[];
};

export default function MobileMenu({ items }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) {
        setOpen(false);
      }
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <Button
        variant="ivory"
        size="sm"
        aria-label={open ? "Закрыть меню" : "Открыть меню"}
        onClick={() => setOpen((prev) => !prev)}
        className="size-10 rounded-full p-0"
      >
        {open ? <X className="size-4" /> : <Menu className="size-4" />}
      </Button>

      <AnimatePresence>
        {open ? (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-[#2b221d]/35 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />

            <motion.div
              key="sheet"
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.24 }}
              className={cn(
                "fixed inset-x-4 top-20 z-50 rounded-[28px] border border-[#eadfd6]",
                "bg-[#fffaf6]/95 p-4 shadow-[0_24px_80px_rgba(61,49,40,0.18)] backdrop-blur-xl"
              )}
            >
              <nav className="flex flex-col">
                {items.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="rounded-2xl px-4 py-3 text-sm text-[#5f5248] transition hover:bg-[#f3e9e1]"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-4 grid gap-2">
                <Button asChild size="lg">
                  <Link href="/create" onClick={() => setOpen(false)}>
                    Создать
                  </Link>
                </Button>

                <Button asChild variant="secondary" size="lg">
                  <Link href="/styles" onClick={() => setOpen(false)}>
                    Каталог стилей
                  </Link>
                </Button>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
