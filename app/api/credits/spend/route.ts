import { NextRequest, NextResponse } from "next/server";
import { CreditTransactionType, OrderStatus } from "@prisma/client";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type SpendBody = {
  orderId?: string;
  credits?: number;
  description?: string;
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

    const body = (await req.json()) as SpendBody;

    const orderId = body.orderId?.trim() || "";
    const credits = Number(body.credits);
    const description = body.description?.trim() || "Списание кредитов за генерацию";

    if (!orderId) {
      return NextResponse.json(
        { error: "orderId обязателен" },
        { status: 400 }
      );
    }

    if (!Number.isInteger(credits) || credits <= 0) {
      return NextResponse.json(
        { error: "credits должен быть положительным целым числом" },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: session.userId },
        select: { id: true, creditBalance: true },
      });

      if (!user) {
        throw new Error("USER_NOT_FOUND");
      }

      const order = await tx.order.findFirst({
        where: {
          id: orderId,
          userId: user.id,
        },
        select: {
          id: true,
          status: true,
        },
      });

      if (!order) {
        throw new Error("ORDER_NOT_FOUND");
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
          nickname: true,
          creditBalance: true,
        },
      });

      const updatedOrder = await tx.order.update({
        where: { id: order.id },
        data: {
          creditsSpent: credits,
          status: OrderStatus.PAID,
          paidAt: new Date(),
        },
        select: {
          id: true,
          status: true,
          creditsSpent: true,
          paidAt: true,
        },
      });

      const creditTransaction = await tx.creditTransaction.create({
        data: {
          userId: user.id,
          orderId: order.id,
          type: CreditTransactionType.SPEND,
          amount: -credits,
          balanceAfter: newBalance,
          description,
        },
      });

      return {
        user: updatedUser,
        order: updatedOrder,
        creditTransaction,
      };
    });

    return NextResponse.json({
      ok: true,
      user: result.user,
      order: result.order,
      creditTransactionId: result.creditTransaction.id,
    });
  } catch (error) {
    console.error("credits spend error", error);

    if (error instanceof Error) {
      if (error.message === "USER_NOT_FOUND") {
        return NextResponse.json(
          { error: "Пользователь не найден" },
          { status: 404 }
        );
      }

      if (error.message === "ORDER_NOT_FOUND") {
        return NextResponse.json(
          { error: "Заказ не найден" },
          { status: 404 }
        );
      }

      if (error.message === "INSUFFICIENT_CREDITS") {
        return NextResponse.json(
          { error: "Недостаточно кредитов" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Не удалось списать кредиты" },
      { status: 500 }
    );
  }
}
