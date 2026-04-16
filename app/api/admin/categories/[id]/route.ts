import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type UpdateCategoryBody = {
  isActive?: boolean;
};

export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Нужна авторизация" }, { status: 401 });
    }

    if (session.role !== "ADMIN") {
      return NextResponse.json({ error: "Недостаточно прав" }, { status: 403 });
    }

    const { id } = await context.params;
    const body = (await req.json()) as UpdateCategoryBody;

    if (typeof body.isActive !== "boolean") {
      return NextResponse.json(
        { error: "Нужно передать isActive" },
        { status: 400 },
      );
    }

    const category = await prisma.showcaseCategory.update({
      where: { id },
      data: {
        isActive: body.isActive,
      },
      select: {
        id: true,
        isActive: true,
      },
    });

    revalidatePath("/dashboard/admin/categories");
    revalidatePath("/dashboard/admin/subcategories");
    revalidatePath("/dashboard/admin/styles");
    revalidatePath("/dashboard/admin/custom-styles");
    revalidatePath("/styles");

    return NextResponse.json({ ok: true, category });
  } catch (error) {
    console.error("update category error", error);

    return NextResponse.json(
      { error: "Не удалось обновить категорию" },
      { status: 500 },
    );
  }
}
