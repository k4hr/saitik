import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";

type CreateCategoryBody = {
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

    const body = (await req.json()) as CreateCategoryBody;

    const name = body.name?.trim() ?? "";
    const rawSlug = body.slug?.trim() ?? "";
    const slug = slugify(rawSlug || name);
    const sortOrder = Number(body.sortOrder ?? 0);
    const isActive =
      typeof body.isActive === "boolean" ? body.isActive : true;

    if (!name) {
      return NextResponse.json(
        { error: "Укажи название категории" },
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

    const existing = await prisma.showcaseCategory.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Категория с таким slug уже существует" },
        { status: 409 },
      );
    }

    const category = await prisma.showcaseCategory.create({
      data: {
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
      },
    });

    revalidatePath("/dashboard/admin/categories");
    revalidatePath("/styles");

    return NextResponse.json({
      ok: true,
      category,
    });
  } catch (error) {
    console.error("create category error", error);

    return NextResponse.json(
      { error: "Не удалось создать категорию" },
      { status: 500 },
    );
  }
}
