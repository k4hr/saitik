import { NextRequest, NextResponse } from "next/server";
import { CreditTransactionType, PaymentStatus } from "@prisma/client";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type TopUpBody = {
  amountRub?: number;
  credits?: number;
  provider?: string;
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

    const body = (await req.json()) as TopUpBody;

    const amountRub = Number(body.amountRub);
    const credits = Number(body.credits);
    const provider = body.provider?.trim() || "manual";

    if (!Number.isInteger(amountRub) || amountRub <= 0) {
      return NextResponse.json(
        { error: "amountRub должен быть положительным целым числом" },
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
      const currentUser = await tx.user.findUnique({
        where: { id: session.userId },
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
          type: CreditTransactionType.TOPUP,
          amount: credits,
          balanceAfter: newBalance,
          description: `Пополнение баланса на ${credits} кредитов`,
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
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Не удалось пополнить баланс" },
      { status: 500 }
    );
  }
}
