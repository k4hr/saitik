import SiteHeader from "@/components/layout/site-header";
import SiteFooter from "@/components/layout/site-footer";
import StylesPageClient from "@/components/styles/styles-page-client";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function StylesPage() {
  const session = await getSession();

  const [categories, subcategories, showcaseItems] = await Promise.all([
    prisma.showcaseCategory.findMany({
      where: {
        isActive: true,
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      select: {
        id: true,
        name: true,
        slug: true,
      },
    }),
    prisma.showcaseSubcategory.findMany({
      where: {
        isActive: true,
        category: {
          isActive: true,
        },
      },
      orderBy: [
        { category: { sortOrder: "asc" } },
        { sortOrder: "asc" },
        { createdAt: "asc" },
      ],
      select: {
        id: true,
        name: true,
        slug: true,
        categoryId: true,
      },
    }),
    prisma.showcaseItem.findMany({
      where: {
        isActive: true,
        category: {
          isActive: true,
        },
        OR: [
          { subcategoryId: null },
          {
            subcategory: {
              isActive: true,
            },
          },
        ],
      },
      orderBy: [
        { sortOrder: "asc" },
        { createdAt: "asc" },
      ],
      select: {
        id: true,
        title: true,
        slug: true,
        kind: true,
        description: true,
        coverImageUrl: true,
        categoryId: true,
        subcategoryId: true,
        stylePresetId: true,
      },
    }),
  ]);

  return (
    <main className="min-h-screen bg-[#f8f2ed] text-[#3d3128]">
      <SiteHeader />
      <StylesPageClient
        isAuthenticated={Boolean(session)}
        categories={categories}
        subcategories={subcategories}
        showcaseItems={showcaseItems}
      />
      <SiteFooter />
    </main>
  );
}
