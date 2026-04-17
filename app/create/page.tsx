import { redirect } from "next/navigation";

import SiteHeader from "@/components/layout/site-header";
import SiteFooter from "@/components/layout/site-footer";
import CreateEntryShell from "@/components/create/create-entry-shell";
import ReadyStyleCreateShell from "@/components/create/ready-style-create-shell";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type SelectedReadyStyle = {
  id: string;
  title: string;
  category: string;
  description: string;
  promptTemplate?: string | null;
  coverImageUrl?: string | null;
};

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

  let selectedStyle: SelectedReadyStyle | null = null;

  if (styleId) {
    const readyItem = await prisma.showcaseItem.findUnique({
      where: { id: styleId },
      select: {
        id: true,
        kind: true,
        title: true,
        description: true,
        promptTemplate: true,
        coverImageUrl: true,
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    if (readyItem && readyItem.kind === "READY") {
      selectedStyle = {
        id: readyItem.id,
        title: readyItem.title,
        category: readyItem.category.name,
        description: readyItem.description || "",
        promptTemplate: readyItem.promptTemplate,
        coverImageUrl: readyItem.coverImageUrl,
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
        coverImageUrl: true,
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    if (showcase && showcase.kind === "READY") {
      selectedStyle = {
        id: showcase.id,
        title: showcase.title,
        category: showcase.category.name,
        description:
          showcase.description ?? "Готовый образ из витрины.",
        coverImageUrl: showcase.coverImageUrl,
      };
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
