import { NextRequest, NextResponse } from "next/server";
import { CreditTransactionType, PaymentStatus } from "@prisma/client";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type TopUpBody = {
  targetUserId?: string;
  amountRub?: number;
  credits?: number;
  provider?: string;
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

    const body = (await req.json()) as TopUpBody;

    const targetUserId = body.targetUserId?.trim() || "";
    const amountRub = Number(body.amountRub);
    const credits = Number(body.credits);
    const provider = body.provider?.trim() || "admin_manual";
    const description =
      body.description?.trim() || `Ручное пополнение на ${credits} кредитов`;

    if (!targetUserId) {
      return NextResponse.json(
        { error: "targetUserId обязателен" },
        { status: 400 },
      );
    }

    if (!Number.isInteger(amountRub) || amountRub < 0) {
      return NextResponse.json(
        { error: "amountRub должен быть целым числом >= 0" },
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
      const currentUser = await tx.user.findUnique({
        where: { id: targetUserId },
        select: { id: true, creditBalance: true },
      });

      if (!currentUser) {
        throw new Error("USER_NOT_FOUND");
      }

      const newBalance = currentUser.creditBalance + credits;

      const updatedUser = await tx.user.update({
        where: { id: currentUser.id },
        data: { creditBalance: newBalance },
        select: {
          id: true,
          email: true,
          login: true,
          creditBalance: true,
        },
      });

      const payment = await tx.payment.create({
        data: {
          userId: currentUser.id,
          provider,
          amountRub,
          creditsPurchased: credits,
          status: PaymentStatus.SUCCEEDED,
          paidAt: new Date(),
        },
      });

      const creditTransaction = await tx.creditTransaction.create({
        data: {
          userId: currentUser.id,
          type: CreditTransactionType.ADMIN_ADJUSTMENT,
          amount: credits,
          balanceAfter: newBalance,
          description,
        },
      });

      return {
        user: updatedUser,
        payment,
        creditTransaction,
      };
    });

    return NextResponse.json({
      ok: true,
      user: result.user,
      paymentId: result.payment.id,
      creditTransactionId: result.creditTransaction.id,
    });
  } catch (error) {
    console.error("credits topup error", error);

    if (error instanceof Error && error.message === "USER_NOT_FOUND") {
      return NextResponse.json(
        { error: "Пользователь не найден" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { error: "Не удалось пополнить баланс" },
      { status: 500 },
    );
  }
}
