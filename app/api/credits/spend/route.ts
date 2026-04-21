import { NextRequest, NextResponse } from "next/server";
import { CreditTransactionType } from "@prisma/client";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type SpendBody = {
  targetUserId?: string;
  credits?: number;
  description?: string;
};

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Неавторизован" }, { status: 401 });
    }

    if (session.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Недостаточно прав" },
        { status: 403 },
      );
    }

    const body = (await req.json()) as SpendBody;

    const targetUserId = body.targetUserId?.trim() || "";
    const credits = Number(body.credits);
    const description =
      body.description?.trim() || "Ручное списание кредитов администратором";

    if (!targetUserId) {
      return NextResponse.json(
        { error: "targetUserId обязателен" },
        { status: 400 },
      );
    }

    if (!Number.isInteger(credits) || credits <= 0) {
      return NextResponse.json(
        { error: "credits должен быть положительным целым числом" },
        { status: 400 },
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: targetUserId },
        select: { id: true, creditBalance: true },
      });

      if (!user) {
        throw new Error("USER_NOT_FOUND");
      }

      if (user.creditBalance < credits) {
        throw new Error("INSUFFICIENT_CREDITS");
      }

      const newBalance = user.creditBalance - credits;

      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: { creditBalance: newBalance },
        select: {
          id: true,
          email: true,
          login: true,
          creditBalance: true,
        },
      });

      const creditTransaction = await tx.creditTransaction.create({
        data: {
          userId: user.id,
          type: CreditTransactionType.ADMIN_ADJUSTMENT,
          amount: -credits,
          balanceAfter: newBalance,
          description,
        },
      });

      return {
        user: updatedUser,
        creditTransaction,
      };
    });

    return NextResponse.json({
      ok: true,
      user: result.user,
      creditTransactionId: result.creditTransaction.id,
    });
  } catch (error) {
    console.error("credits spend error", error);

    if (error instanceof Error) {
      if (error.message === "USER_NOT_FOUND") {
        return NextResponse.json(
          { error: "Пользователь не найден" },
          { status: 404 },
        );
      }

      if (error.message === "INSUFFICIENT_CREDITS") {
        return NextResponse.json(
          { error: "Недостаточно кредитов" },
          { status: 400 },
        );
      }
    }

    return NextResponse.json(
      { error: "Не удалось списать кредиты" },
      { status: 500 },
    );
  }
}
