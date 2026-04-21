import { redirect } from "next/navigation";

import SiteHeader from "@/components/layout/site-header";
import SiteFooter from "@/components/layout/site-footer";
import CreateEntryShell from "@/components/create/create-entry-shell";
import ReadyStyleCreateShell from "@/components/create/ready-style-create-shell";
import ReferenceCreateShell from "@/components/create/reference-create-shell";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type CreatePageProps = {
  searchParams?: Promise<{
    style?: string;
    mode?: string;
  }>;
};

export default async function CreatePage({ searchParams }: CreatePageProps) {
  const session = await getSession();

  if (!session) {
    redirect("/auth/sign-in");
  }

  const params = (await searchParams) ?? {};
  const selectedStyleId = params.style?.trim() || "";
  const mode = params.mode?.trim() || "";

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      creditBalance: true,
    },
  });

  if (!user) {
    redirect("/auth/sign-in");
  }

  const selectedStyle = selectedStyleId
    ? await prisma.showcaseItem.findFirst({
        where: {
          id: selectedStyleId,
          kind: "READY",
          isActive: true,
        },
        select: {
          id: true,
          title: true,
          description: true,
          promptTemplate: true,
          coverImageUrl: true,
          generationPriceCredits: true,
          category: {
            select: {
              name: true,
            },
          },
        },
      })
    : null;

  return (
    <main className="min-h-screen bg-[#f8f2ed] text-[#3d3128]">
      <SiteHeader />

      {selectedStyle ? (
        <ReadyStyleCreateShell
          selectedStyle={{
            id: selectedStyle.id,
            title: selectedStyle.title,
            category: selectedStyle.category.name,
            description: selectedStyle.description || "",
            promptTemplate: selectedStyle.promptTemplate || null,
            coverImageUrl: selectedStyle.coverImageUrl || null,
            generationPriceCredits:
              selectedStyle.generationPriceCredits ?? 0,
          }}
        />
      ) : mode === "reference" ? (
        <ReferenceCreateShell currentBalance={user.creditBalance} />
      ) : (
        <CreateEntryShell />
      )}

      <SiteFooter />
    </main>
  );
}
