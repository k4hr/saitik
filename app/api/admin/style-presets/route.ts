import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";

type CreateStylePresetBody = {
  title?: string;
  slug?: string;
  category?: string;
  description?: string;
  promptTemplate?: string | null;
  coverImageUrl?: string | null;
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

    const body = (await req.json()) as CreateStylePresetBody;

    const title = body.title?.trim() ?? "";
    const rawSlug = body.slug?.trim() ?? "";
    const slug = slugify(rawSlug || title);
    const category = body.category?.trim() ?? "";
    const description = body.description?.trim() ?? "";
    const promptTemplate = body.promptTemplate?.trim() || null;
    const coverImageUrl = body.coverImageUrl?.trim() || null;
    const sortOrder = Number(body.sortOrder ?? 0);
    const isActive =
      typeof body.isActive === "boolean" ? body.isActive : true;

    if (!title) {
      return NextResponse.json(
        { error: "Укажи название style preset" },
        { status: 400 },
      );
    }

    if (!slug) {
      return NextResponse.json(
        { error: "Не удалось сформировать slug" },
        { status: 400 },
      );
    }

    if (!category) {
      return NextResponse.json(
        { error: "Укажи категорию style preset" },
        { status: 400 },
      );
    }

    if (!description) {
      return NextResponse.json(
        { error: "Укажи описание style preset" },
        { status: 400 },
      );
    }

    if (!promptTemplate) {
      return NextResponse.json(
        { error: "Укажи prompt template для style preset" },
        { status: 400 },
      );
    }

    if (!Number.isFinite(sortOrder)) {
      return NextResponse.json(
        { error: "Порядок сортировки должен быть числом" },
        { status: 400 },
      );
    }

    const existing = await prisma.stylePreset.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Style preset с таким slug уже существует" },
        { status: 409 },
      );
    }

    const preset = await prisma.stylePreset.create({
      data: {
        title,
        slug,
        category,
        description,
        promptTemplate,
        coverImageUrl,
        sortOrder,
        isActive,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        category: true,
        promptTemplate: true,
        isActive: true,
      },
    });

    revalidatePath("/dashboard/admin/presets");
    revalidatePath("/dashboard/admin/styles");
    revalidatePath("/styles");

    return NextResponse.json({
      ok: true,
      preset,
    });
  } catch (error) {
    console.error("create style preset error", error);

    return NextResponse.json(
      { error: "Не удалось создать style preset" },
      { status: 500 },
    );
  }
}
