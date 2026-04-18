import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { ShowcaseKind } from "@prisma/client";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";

type CreateShowcaseItemBody = {
  title?: string;
  slug?: string;
  kind?: ShowcaseKind | string;
  description?: string;
  promptTemplate?: string | null;
  generationPriceCredits?: number | string | null;
  coverImageUrl?: string;
  sortOrder?: number | string;
  isActive?: boolean;
  categoryId?: string;
  subcategoryId?: string | null;
};

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Нужна авторизация" }, { status: 401 });
    }

    if (session.role !== "ADMIN") {
      return NextResponse.json({ error: "Недостаточно прав" }, { status: 403 });
    }

    const body = (await req.json()) as CreateShowcaseItemBody;

    const title = body.title?.trim() ?? "";
    const rawSlug = body.slug?.trim() ?? "";
    const slug = slugify(rawSlug || title);
    const kind =
      body.kind === ShowcaseKind.CUSTOM ? ShowcaseKind.CUSTOM : ShowcaseKind.READY;
    const description = body.description?.trim() || null;
    const promptTemplate = body.promptTemplate?.trim() || null;
    const coverImageUrl = body.coverImageUrl?.trim() ?? "";
    const categoryId = body.categoryId?.trim() ?? "";
    const subcategoryId = body.subcategoryId?.trim() || null;
    const sortOrder = Number(body.sortOrder ?? 0);
    const isActive = typeof body.isActive === "boolean" ? body.isActive : true;
    const generationPriceCreditsRaw =
      body.generationPriceCredits === null ||
      body.generationPriceCredits === undefined ||
      body.generationPriceCredits === ""
        ? null
        : Number(body.generationPriceCredits);

    if (!title) {
      return NextResponse.json({ error: "Укажи название карточки" }, { status: 400 });
    }

    if (!slug) {
      return NextResponse.json({ error: "Не удалось сформировать slug" }, { status: 400 });
    }

    if (!coverImageUrl) {
      return NextResponse.json({ error: "Укажи URL обложки" }, { status: 400 });
    }

    if (!categoryId) {
      return NextResponse.json({ error: "Выбери категорию" }, { status: 400 });
    }

    if (!Number.isFinite(sortOrder)) {
      return NextResponse.json(
        { error: "Порядок сортировки должен быть числом" },
        { status: 400 },
      );
    }

    if (kind === ShowcaseKind.READY && !promptTemplate) {
      return NextResponse.json(
        { error: "Для готового стиля нужно указать изначальный промпт" },
        { status: 400 },
      );
    }

    if (
      kind === ShowcaseKind.READY &&
      (!Number.isFinite(generationPriceCreditsRaw) || generationPriceCreditsRaw === null)
    ) {
      return NextResponse.json(
        { error: "Для готового стиля нужно указать цену в кредитах" },
        { status: 400 },
      );
    }

    if (
      kind === ShowcaseKind.READY &&
      generationPriceCreditsRaw !== null &&
      generationPriceCreditsRaw < 0
    ) {
      return NextResponse.json(
        { error: "Цена в кредитах не может быть отрицательной" },
        { status: 400 },
      );
    }

    const existing = await prisma.showcaseItem.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Карточка с таким slug уже существует" },
        { status: 409 },
      );
    }

    const category = await prisma.showcaseCategory.findUnique({
      where: { id: categoryId },
      select: { id: true },
    });

    if (!category) {
      return NextResponse.json({ error: "Категория не найдена" }, { status: 404 });
    }

    if (subcategoryId) {
      const subcategory = await prisma.showcaseSubcategory.findUnique({
        where: { id: subcategoryId },
        select: { id: true, categoryId: true },
      });

      if (!subcategory) {
        return NextResponse.json(
          { error: "Подкатегория не найдена" },
          { status: 404 },
        );
      }

      if (subcategory.categoryId !== categoryId) {
        return NextResponse.json(
          { error: "Подкатегория не принадлежит выбранной категории" },
          { status: 400 },
        );
      }
    }

    const item = await prisma.showcaseItem.create({
      data: {
        title,
        slug,
        kind,
        description,
        promptTemplate: kind === ShowcaseKind.READY ? promptTemplate : null,
        generationPriceCredits:
          kind === ShowcaseKind.READY ? generationPriceCreditsRaw : null,
        coverImageUrl,
        sortOrder,
        isActive,
        categoryId,
        subcategoryId,
        createdByUserId: session.userId,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        kind: true,
        promptTemplate: true,
        generationPriceCredits: true,
        coverImageUrl: true,
        sortOrder: true,
        isActive: true,
        createdAt: true,
      },
    });

    revalidatePath("/dashboard/admin/styles");
    revalidatePath("/dashboard/admin/custom-styles");
    revalidatePath("/styles");

    return NextResponse.json({
      ok: true,
      item,
    });
  } catch (error) {
    console.error("create showcase item error", error);

    return NextResponse.json(
      { error: "Не удалось создать карточку витрины" },
      { status: 500 },
    );
  }
}
