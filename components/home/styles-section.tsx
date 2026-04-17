import Image from "next/image";
import Link from "next/link";

import SectionShell from "@/components/layout/section-shell";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/auth";

const demoItems = [
  { id: "style-1", title: "Old Money", image: "/demo/main/style-1.png" },
  { id: "style-2", title: "Luxury Black", image: "/demo/main/style-2.png" },
  { id: "style-3", title: "Business Clean", image: "/demo/main/style-3.png" },
  { id: "style-4", title: "Soft Editorial", image: "/demo/main/style-4.png" },
  { id: "style-5", title: "Pinterest Soft", image: "/demo/main/style-5.png" },
  { id: "style-6", title: "Travel Mood", image: "/demo/main/style-6.png" },
  { id: "style-7", title: "Dating Style", image: "/demo/main/style-7.png" },
  { id: "style-8", title: "Studio Portrait", image: "/demo/main/style-8.png" },
];

export default async function StylesSection() {
  const session = await getSession();
  const primaryHref = session ? "/styles" : "/auth/sign-in";

  const loopItems = [...demoItems, ...demoItems];

  return (
    <SectionShell
      id="styles"
      title="Выберите стиль будущей фотосессии"
      className="overflow-hidden bg-[#fbf7f3]"
    >
      <div className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-[linear-gradient(90deg,#fbf7f3_0%,rgba(251,247,243,0.92)_35%,rgba(251,247,243,0)_100%)] sm:w-28 lg:w-40" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-[linear-gradient(270deg,#fbf7f3_0%,rgba(251,247,243,0.92)_35%,rgba(251,247,243,0)_100%)] sm:w-28 lg:w-40" />

        <div className="styles-marquee flex w-max gap-5 px-4 py-3 sm:gap-6 sm:px-6 lg:gap-7 lg:px-8">
          {loopItems.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="group shrink-0 overflow-hidden rounded-[32px] border border-[#eadfd6] bg-white/90 shadow-[0_14px_38px_rgba(88,62,40,0.08)] transition-transform duration-500 hover:-translate-y-1"
            >
              <div className="relative h-[320px] w-[240px] sm:h-[380px] sm:w-[285px] lg:h-[460px] lg:w-[340px]">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  sizes="(max-width: 640px) 240px, (max-width: 1024px) 285px, 340px"
                  priority={index < 8}
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02)_0%,rgba(61,49,40,0.08)_100%)]" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 flex justify-center">
        <Button
          asChild
          size="xl"
          className="min-w-[220px] rounded-[24px] border border-[#c8ab8d] bg-[#bc9670] px-8 text-[15px] font-medium text-[#3d3128] shadow-[0_16px_40px_rgba(95,69,48,0.18),inset_0_1px_0_rgba(255,255,255,0.20)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#b38b64] hover:shadow-[0_22px_52px_rgba(95,69,48,0.24)]"
        >
          <Link href={primaryHref}>Начать</Link>
        </Button>
      </div>

      <style>{`
        .styles-marquee {
          animation: styles-marquee 40s linear infinite;
          will-change: transform;
        }

        @keyframes styles-marquee {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(calc(-50% - 12px), 0, 0);
          }
        }
      `}</style>
    </SectionShell>
  );
}
