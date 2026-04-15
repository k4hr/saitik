import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";

type CreateSubcategoryBody = {
  categoryId?: string;
  name?: string;
  slug?: string;
  sortOrder?: number | string;
  isActive?: boolean;
};

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: "Нужна авторизация" },
        { status: 401 },
      );
    }

    if (session.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Недостаточно прав" },
        { status: 403 },
      );
    }

    const body = (await req.json()) as CreateSubcategoryBody;

    const categoryId = body.categoryId?.trim() ?? "";
    const name = body.name?.trim() ?? "";
    const rawSlug = body.slug?.trim() ?? "";
    const slug = slugify(rawSlug || name);
    const sortOrder = Number(body.sortOrder ?? 0);
    const isActive =
      typeof body.isActive === "boolean" ? body.isActive : true;

    if (!categoryId) {
      return NextResponse.json(
        { error: "Выбери категорию" },
        { status: 400 },
      );
    }

    if (!name) {
      return NextResponse.json(
        { error: "Укажи название подкатегории" },
        { status: 400 },
      );
    }

    if (!slug) {
      return NextResponse.json(
        { error: "Не удалось сформировать slug" },
        { status: 400 },
      );
    }

    if (!Number.isFinite(sortOrder)) {
      return NextResponse.json(
        { error: "Порядок сортировки должен быть числом" },
        { status: 400 },
      );
    }

    const category = await prisma.showcaseCategory.findUnique({
      where: { id: categoryId },
      select: { id: true, name: true },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Категория не найдена" },
        { status: 404 },
      );
    }

    const existing = await prisma.showcaseSubcategory.findUnique({
      where: {
        categoryId_slug: {
          categoryId,
          slug,
        },
      },
      select: { id: true },
    });

    if (existing) {
      return NextResponse.json(
        { error: "В этой категории уже есть подкатегория с таким slug" },
        { status: 409 },
      );
    }

    const subcategory = await prisma.showcaseSubcategory.create({
      data: {
        categoryId,
        name,
        slug,
        sortOrder,
        isActive,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        sortOrder: true,
        isActive: true,
        createdAt: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    revalidatePath("/dashboard/admin/categories");
    revalidatePath("/dashboard/admin/subcategories");
    revalidatePath("/styles");

    return NextResponse.json({
      ok: true,
      subcategory,
    });
  } catch (error) {
    console.error("create subcategory error", error);

    return NextResponse.json(
      { error: "Не удалось создать подкатегорию" },
      { status: 500 },
    );
  }
}
