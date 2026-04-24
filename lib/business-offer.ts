import { OrderStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";

const BUSINESS_OFFER_REQUIRED_GENERATIONS = 4;
const BUSINESS_OFFER_DURATION_MS = 15 * 60 * 1000;

export async function ensureBusinessOfferForUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      businessOfferTriggeredAt: true,
      businessOfferEndsAt: true,
    },
  });

  if (!user) {
    return null;
  }

  if (user.businessOfferTriggeredAt) {
    return {
      businessOfferTriggeredAt: user.businessOfferTriggeredAt,
      businessOfferEndsAt: user.businessOfferEndsAt,
    };
  }

  const doneOrdersCount = await prisma.order.count({
    where: {
      userId,
      status: OrderStatus.DONE,
    },
  });

  if (doneOrdersCount < BUSINESS_OFFER_REQUIRED_GENERATIONS) {
    return {
      businessOfferTriggeredAt: null,
      businessOfferEndsAt: null,
    };
  }

  const now = new Date();
  const businessOfferEndsAt = new Date(now.getTime() + BUSINESS_OFFER_DURATION_MS);

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      businessOfferTriggeredAt: now,
      businessOfferEndsAt,
    },
    select: {
      businessOfferTriggeredAt: true,
      businessOfferEndsAt: true,
    },
  });

  return updatedUser;
}
