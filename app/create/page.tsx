import { redirect } from "next/navigation";

import SiteHeader from "@/components/layout/site-header";
import SiteFooter from "@/components/layout/site-footer";
import CreateEntryShell from "@/components/create/create-entry-shell";
import ReadyStyleCreateShell from "@/components/create/ready-style-create-shell";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { StyleOption } from "@/lib/data/style-presets";

type CreatePageProps = {
  searchParams?: Promise<{
    style?: string;
    showcase?: string;
  }>;
};

export default async function CreatePage({ searchParams }: CreatePageProps) {
  const session = await getSession();

  if (!session) {
    redirect("/auth/sign-in");
  }

  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const styleId = resolvedSearchParams?.style?.trim();
  const showcaseId = resolvedSearchParams?.showcase?.trim();

  let selectedStyle: StyleOption | null = null;

  if (styleId) {
    const preset = await prisma.stylePreset.findUnique({
      where: { id: styleId },
      select: {
        id: true,
        title: true,
        category: true,
        description: true,
      },
    });

    if (preset) {
      selectedStyle = {
        id: preset.id,
        title: preset.title,
        category: preset.category,
        description: preset.description,
      };
    }
  }

  if (!selectedStyle && showcaseId) {
    const showcase = await prisma.showcaseItem.findUnique({
      where: { id: showcaseId },
      select: {
        id: true,
        title: true,
        description: true,
        kind: true,
        stylePreset: {
          select: {
            id: true,
            title: true,
            category: true,
            description: true,
          },
        },
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    if (showcase) {
      if (showcase.stylePreset) {
        selectedStyle = {
          id: showcase.stylePreset.id,
          title: showcase.stylePreset.title,
          category: showcase.stylePreset.category,
          description: showcase.stylePreset.description,
        };
      } else {
        selectedStyle = {
          id: showcase.id,
          title: showcase.title,
          category: showcase.category.name,
          description:
            showcase.description ??
            "Пользовательская фотосессия из витрины.",
        };
      }
    }
  }

  return (
    <main className="min-h-screen bg-[#f8f2ed] text-[#3d3128]">
      <SiteHeader />
      {selectedStyle ? (
        <ReadyStyleCreateShell selectedStyle={selectedStyle} />
      ) : (
        <CreateEntryShell />
      )}
      <SiteFooter />
    </main>
  );
}
