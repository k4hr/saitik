import { NextRequest, NextResponse } from "next/server";
import {
  CreditTransactionType,
  PaymentStatus,
} from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { verifyTBankToken } from "@/lib/tbank";

type TBankNotificationBody = {
  Success?: boolean;
  Status?: string;
  PaymentId?: string | number;
  OrderId?: string;
  Amount?: number;
  Token?: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as TBankNotificationBody;

    if (!verifyTBankToken(body as Record<string, unknown>)) {
      return NextResponse.json(
        { error: "Некорректная подпись уведомления" },
        { status: 400 },
      );
    }

    const orderId = typeof body.OrderId === "string" ? body.OrderId : "";

    if (!orderId) {
      return NextResponse.json(
        { error: "Отсутствует OrderId" },
        { status: 400 },
      );
    }

    const payment = await prisma.payment.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        userId: true,
        amountRub: true,
        creditsPurchased: true,
        status: true,
        externalPaymentId: true,
      },
    });

    if (!payment) {
      return NextResponse.json({ error: "Платёж не найден" }, { status: 404 });
    }

    const nextStatus = body.Status?.trim() || "";

    if (nextStatus === "CONFIRMED") {
      if (payment.status === PaymentStatus.SUCCEEDED) {
        return NextResponse.json({ ok: true });
      }

      await prisma.$transaction(async (tx) => {
        const user = await tx.user.findUnique({
          where: { id: payment.userId },
          select: {
            id: true,
            creditBalance: true,
          },
        });

        if (!user) {
          throw new Error("USER_NOT_FOUND");
        }

        const credits = payment.creditsPurchased ?? 0;
        const balanceAfter = user.creditBalance + credits;

        await tx.user.update({
          where: { id: user.id },
          data: {
            creditBalance: balanceAfter,
          },
        });

        await tx.payment.update({
          where: { id: payment.id },
          data: {
            status: PaymentStatus.SUCCEEDED,
            paidAt: new Date(),
            externalPaymentId:
              typeof body.PaymentId !== "undefined"
                ? String(body.PaymentId)
                : payment.externalPaymentId,
          },
        });

        await tx.creditTransaction.create({
          data: {
            userId: user.id,
            type: CreditTransactionType.TOPUP,
            amount: credits,
            balanceAfter,
            description: `Пополнение через T-Банк на ${credits} кредитов`,
          },
        });
      });

      return NextResponse.json({ ok: true });
    }

    if (
      nextStatus === "REJECTED" ||
      nextStatus === "CANCELED" ||
      nextStatus === "DEADLINE_EXPIRED"
    ) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status:
            nextStatus === "CANCELED"
              ? PaymentStatus.CANCELED
              : PaymentStatus.FAILED,
          externalPaymentId:
            typeof body.PaymentId !== "undefined"
              ? String(body.PaymentId)
              : payment.externalPaymentId,
        },
      });

      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("tbank notify error", error);

    return NextResponse.json(
      { error: "Не удалось обработать уведомление" },
      { status: 500 },
    );
  }
}
