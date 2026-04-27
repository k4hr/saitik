import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import {
  createSessionToken,
  hashPassword,
  setSessionCookie,
} from "@/lib/auth";

type VkCompleteBody = {
  vkId?: string | number;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  avatarUrl?: string | null;
};

function normalizeEmail(value?: string | null): string {
  return (value || "").trim().toLowerCase();
}

async function buildUniqueLogin(base: string): Promise<string> {
  const normalizedBase = base.trim().toLowerCase().replace(/[^a-z0-9._-]/g, "");
  const seed = normalizedBase.length >= 3 ? normalizedBase : "vkuser";

  const direct = await prisma.user.findUnique({
    where: { login: seed },
    select: { id: true },
  });

  if (!direct) {
    return seed;
  }

  for (let index = 1; index <= 9999; index += 1) {
    const candidate = `${seed}${index}`;

    const exists = await prisma.user.findUnique({
      where: { login: candidate },
      select: { id: true },
    });

    if (!exists) {
      return candidate;
    }
  }

  return `vkuser${Date.now()}`;
}

function buildFallbackEmail(vkId: string): string {
  return `vk-${vkId}@auth.atelia.local`;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as VkCompleteBody;

    const vkId = String(body.vkId || "").trim();
    const email = normalizeEmail(body.email);
    const firstName = (body.firstName || "").trim();
    const lastName = (body.lastName || "").trim();
    const avatarUrl = (body.avatarUrl || "").trim();

    if (!vkId) {
      return NextResponse.json(
        { error: "Не удалось определить VK ID пользователя" },
        { status: 400 },
      );
    }

    const existingByVkId = await prisma.user.findUnique({
      where: { vkId },
      select: {
        id: true,
        email: true,
        login: true,
        role: true,
        isActive: true,
      },
    });

    if (existingByVkId) {
      if (!existingByVkId.isActive) {
        return NextResponse.json(
          { error: "Аккаунт пользователя отключён" },
          { status: 403 },
        );
      }

      const token = await createSessionToken({
        userId: existingByVkId.id,
        email: existingByVkId.email,
        login: existingByVkId.login,
        role: existingByVkId.role,
      });

      await setSessionCookie(token);

      return NextResponse.json({
        ok: true,
        user: {
          id: existingByVkId.id,
          email: existingByVkId.email,
          login: existingByVkId.login,
          role: existingByVkId.role,
        },
      });
    }

    const existingByEmail =
      email.length > 0
        ? await prisma.user.findUnique({
            where: { email },
            select: {
              id: true,
              email: true,
              login: true,
              role: true,
              isActive: true,
              vkId: true,
            },
          })
        : null;

    if (existingByEmail) {
      if (!existingByEmail.isActive) {
        return NextResponse.json(
          { error: "Аккаунт пользователя отключён" },
          { status: 403 },
        );
      }

      if (existingByEmail.vkId && existingByEmail.vkId !== vkId) {
        return NextResponse.json(
          { error: "Этот email уже связан с другим VK-аккаунтом" },
          { status: 409 },
        );
      }

      const linkedUser = await prisma.user.update({
        where: { id: existingByEmail.id },
        data: {
          vkId,
        },
        select: {
          id: true,
          email: true,
          login: true,
          role: true,
        },
      });

      const token = await createSessionToken({
        userId: linkedUser.id,
        email: linkedUser.email,
        login: linkedUser.login,
        role: linkedUser.role,
      });

      await setSessionCookie(token);

      return NextResponse.json({
        ok: true,
        user: linkedUser,
      });
    }

    const welcomeCredits = 10;
    const welcomeOfferEndsAt = new Date(Date.now() + 60 * 60 * 1000);
    const finalEmail = email || buildFallbackEmail(vkId);
    const preferredLoginSeed = firstName
      ? `${firstName}${lastName ? `.${lastName}` : ""}`
      : `vk${vkId}`;
    const login = await buildUniqueLogin(preferredLoginSeed);
    const passwordHash = await hashPassword(randomUUID());

    const user = await prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          email: finalEmail,
          login,
          passwordHash,
          vkId,
          creditBalance: welcomeCredits,
          welcomeOfferEndsAt,
        },
        select: {
          id: true,
          email: true,
          login: true,
          role: true,
        },
      });

      await tx.creditTransaction.create({
        data: {
          userId: createdUser.id,
          type: "WELCOME_BONUS",
          amount: welcomeCredits,
          balanceAfter: welcomeCredits,
          description: "Приветственный бонус за регистрацию через VK",
        },
      });

      if (avatarUrl) {
        void avatarUrl;
      }

      return createdUser;
    });

    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      login: user.login,
      role: user.role,
    });

    await setSessionCookie(token);

    return NextResponse.json({
      ok: true,
      user,
    });
  } catch (error) {
    console.error("vk complete error", error);

    return NextResponse.json(
      { error: "Не удалось выполнить вход через ВКонтакте" },
      { status: 500 },
    );
  }
}
