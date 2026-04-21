import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import {
  createSessionToken,
  hashPassword,
  setSessionCookie,
} from "@/lib/auth";
import {
  clearThrottle,
  getRequestIp,
  getThrottleState,
  registerThrottleFailure,
} from "@/lib/auth-throttle";

type RegisterBody = {
  email?: string;
  login?: string;
  password?: string;
};

const REGISTER_MAX_ATTEMPTS_IP = 5;
const REGISTER_WINDOW_MS = 60 * 60 * 1000;
const REGISTER_BLOCK_MS = 60 * 60 * 1000;

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function normalizeLogin(login: string): string {
  return login.trim().toLowerCase();
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as RegisterBody;

    const email = body.email ? normalizeEmail(body.email) : "";
    const login = body.login ? normalizeLogin(body.login) : "";
    const password = body.password ?? "";
    const ip = getRequestIp(req.headers);

    if (!email || !login || !password) {
      return NextResponse.json(
        { error: "email, login и password обязательны" },
        { status: 400 },
      );
    }

    const ipState = await getThrottleState({
      scope: "register-ip",
      key: ip,
      maxAttempts: REGISTER_MAX_ATTEMPTS_IP,
      windowMs: REGISTER_WINDOW_MS,
      blockMs: REGISTER_BLOCK_MS,
    });

    if (ipState.isBlocked) {
      return NextResponse.json(
        { error: "Слишком много попыток регистрации. Попробуйте позже." },
        { status: 429 },
      );
    }

    if (!email.includes("@")) {
      return NextResponse.json(
        { error: "Некорректный email" },
        { status: 400 },
      );
    }

    if (login.length < 3 || login.length > 24) {
      return NextResponse.json(
        { error: "Логин должен быть от 3 до 24 символов" },
        { status: 400 },
      );
    }

    if (!/^[a-z0-9._-]+$/.test(login)) {
      return NextResponse.json(
        {
          error:
            "Логин может содержать только a-z, 0-9, точку, дефис и нижнее подчеркивание",
        },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Пароль должен быть минимум 6 символов" },
        { status: 400 },
      );
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { login }],
      },
      select: {
        id: true,
      },
    });

    if (existingUser) {
      await registerThrottleFailure({
        scope: "register-ip",
        key: ip,
        maxAttempts: REGISTER_MAX_ATTEMPTS_IP,
        windowMs: REGISTER_WINDOW_MS,
        blockMs: REGISTER_BLOCK_MS,
      });

      return NextResponse.json(
        { error: "Пользователь с таким email или login уже существует" },
        { status: 409 },
      );
    }

    const passwordHash = await hashPassword(password);
    const welcomeCredits = 10;
    const welcomeOfferEndsAt = new Date(Date.now() + 60 * 60 * 1000);

    const user = await prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          email,
          login,
          passwordHash,
          creditBalance: welcomeCredits,
          welcomeOfferEndsAt,
        },
        select: {
          id: true,
          email: true,
          login: true,
          role: true,
          creditBalance: true,
          createdAt: true,
          welcomeOfferEndsAt: true,
        },
      });

      await tx.creditTransaction.create({
        data: {
          userId: createdUser.id,
          type: "WELCOME_BONUS",
          amount: welcomeCredits,
          balanceAfter: welcomeCredits,
          description: "Приветственный бонус за регистрацию",
        },
      });

      return createdUser;
    });

    await clearThrottle({
      scope: "register-ip",
      key: ip,
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
    console.error("register error", error);

    return NextResponse.json(
      { error: "Не удалось зарегистрировать пользователя" },
      { status: 500 },
    );
  }
}
