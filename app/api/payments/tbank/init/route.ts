import { NextRequest, NextResponse } from "next/server";
import { PaymentStatus } from "@prisma/client";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  buildTBankReceipt,
  getAppUrl,
  initTBankPayment,
} from "@/lib/tbank";
import {
  getBillingPack,
  STUDIO_PROMO_PRICE_RUB,
  type BillingPackKey,
} from "@/lib/billing-packs";

type InitPaymentBody = {
  packKey?: BillingPackKey;
  offer?: "regular" | "welcome_studio";
};

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Неавторизован" }, { status: 401 });
    }

    const body = (await req.json()) as InitPaymentBody;
    const packKey = body.packKey;

    if (!packKey) {
      return NextResponse.json({ error: "Не выбран пакет" }, { status: 400 });
    }

    const pack = getBillingPack(packKey);

    if (!pack) {
      return NextResponse.json({ error: "Пакет не найден" }, { status: 404 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        email: true,
        login: true,
        welcomeOfferEndsAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Пользователь не найден" },
        { status: 404 },
      );
    }

    if (!user.email) {
      return NextResponse.json(
        { error: "Для оплаты у пользователя должен быть указан email" },
        { status: 400 },
      );
    }

    const hasWelcomeOffer =
      Boolean(user.welcomeOfferEndsAt) &&
      user.welcomeOfferEndsAt!.getTime() > Date.now();

    const isWelcomeStudio =
      pack.key === "studio" &&
      body.offer === "welcome_studio" &&
      hasWelcomeOffer;

    const amountRub = isWelcomeStudio ? STUDIO_PROMO_PRICE_RUB : pack.priceRub;

    const createdPayment = await prisma.payment.create({
      data: {
        userId: user.id,
        provider: "tbank",
        amountRub,
        creditsPurchased: pack.credits,
        status: PaymentStatus.PENDING,
      },
      select: {
        id: true,
      },
    });

    const appUrl = getAppUrl();
    const itemName = `Пакет "${pack.name}" — ${pack.credits} кредитов`;

    try {
      const tbankPayment = await initTBankPayment({
        amountRub,
        orderId: createdPayment.id,
        description: itemName,
        customerKey: user.id,
        notificationURL: `${appUrl}/api/payments/tbank/notify`,
        successURL: `${appUrl}/dashboard/billing?payment=success`,
        failURL: `${appUrl}/dashboard/billing?payment=failed`,
        receipt: buildTBankReceipt({
          email: user.email,
          itemName,
          amountRub,
        }),
      });

      await prisma.payment.update({
        where: { id: createdPayment.id },
        data: {
          externalPaymentId: String(tbankPayment.PaymentId),
        },
      });

      return NextResponse.json({
        ok: true,
        paymentUrl: tbankPayment.PaymentURL,
      });
    } catch (error) {
      await prisma.payment.update({
        where: { id: createdPayment.id },
        data: {
          status: PaymentStatus.FAILED,
        },
      });

      throw error;
    }
  } catch (error) {
    console.error("tbank init error", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Не удалось создать платёж",
      },
      { status: 500 },
    );
  }
}
