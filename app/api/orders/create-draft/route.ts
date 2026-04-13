import { NextRequest, NextResponse } from "next/server";
import { OrderStatus } from "@prisma/client";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type CreateDraftBody = {
  stylePresetId?: string | null;
  title?: string;
  goal?: string;
  selectedFormat?: string;
  selectedMood?: string;
  notes?: string;
};

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: "Неавторизован" },
        { status: 401 }
      );
    }

    const body = (await req.json()) as CreateDraftBody;

    const order = await prisma.order.create({
      data: {
        userId: session.userId,
        stylePresetId: body.stylePresetId || null,
        title: body.title?.trim() || null,
        goal: body.goal?.trim() || null,
        selectedFormat: body.selectedFormat?.trim() || null,
        selectedMood: body.selectedMood?.trim() || null,
        notes: body.notes?.trim() || null,
        status: OrderStatus.DRAFT,
      },
      select: {
        id: true,
        status: true,
        title: true,
        goal: true,
        selectedFormat: true,
        selectedMood: true,
        notes: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      ok: true,
      order,
    });
  } catch (error) {
    console.error("create draft order error", error);

    return NextResponse.json(
      { error: "Не удалось создать draft order" },
      { status: 500 }
    );
  }
}
