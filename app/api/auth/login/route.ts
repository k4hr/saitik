import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import {
  createSessionToken,
  setSessionCookie,
  verifyPassword,
} from "@/lib/auth";
import {
  clearThrottle,
  getRequestIp,
  getThrottleState,
  registerThrottleFailure,
  sleepAtLeast,
} from "@/lib/auth-throttle";

type LoginBody = {
  identifier?: string;
  password?: string;
};

const DUMMY_PASSWORD_HASH =
  "$2b$12$7G8P7sV7H2ifP8mXUoJrFud5o9WJg8mA8fYQy4QW4i4xqP7N8P5zC";

const LOGIN_MAX_ATTEMPTS_IP = 20;
const LOGIN_MAX_ATTEMPTS_IDENTIFIER = 5;
const LOGIN_WINDOW_MS = 10 * 60 * 1000;
const LOGIN_BLOCK_MS = 15 * 60 * 1000;
const MIN_LOGIN_RESPONSE_MS = 900;

function normalizeIdentifier(value: string): string {
  return value.trim().toLowerCase();
}

function invalidCredentialsResponse() {
  return NextResponse.json(
    { error: "Неверный email, логин или пароль" },
    { status: 401 },
  );
}

export async function POST(req: NextRequest) {
  const startedAt = Date.now();

  try {
    const body = (await req.json()) as LoginBody;

    const identifier = body.identifier ? normalizeIdentifier(body.identifier) : "";
    const password = body.password ?? "";
    const ip = getRequestIp(req.headers);

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "identifier и password обязательны" },
        { status: 400 },
      );
    }

    const [ipState, identifierState] = await Promise.all([
      getThrottleState({
        scope: "login-ip",
        key: ip,
        maxAttempts: LOGIN_MAX_ATTEMPTS_IP,
        windowMs: LOGIN_WINDOW_MS,
        blockMs: LOGIN_BLOCK_MS,
      }),
      getThrottleState({
        scope: "login-identifier",
        key: identifier,
        maxAttempts: LOGIN_MAX_ATTEMPTS_IDENTIFIER,
        windowMs: LOGIN_WINDOW_MS,
        blockMs: LOGIN_BLOCK_MS,
      }),
    ]);

    if (ipState.isBlocked || identifierState.isBlocked) {
      await sleepAtLeast(startedAt, MIN_LOGIN_RESPONSE_MS);

      return NextResponse.json(
        { error: "Слишком много попыток входа. Попробуйте позже." },
        { status: 429 },
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { login: identifier }],
      },
      select: {
        id: true,
        email: true,
        login: true,
        role: true,
        passwordHash: true,
        creditBalance: true,
        isActive: true,
      },
    });

    const passwordHashToCheck = user?.passwordHash || DUMMY_PASSWORD_HASH;
    const isValidPassword = await verifyPassword(password, passwordHashToCheck);

    if (!user || !user.isActive || !isValidPassword) {
      await Promise.all([
        registerThrottleFailure({
          scope: "login-ip",
          key: ip,
          maxAttempts: LOGIN_MAX_ATTEMPTS_IP,
          windowMs: LOGIN_WINDOW_MS,
          blockMs: LOGIN_BLOCK_MS,
        }),
        registerThrottleFailure({
          scope: "login-identifier",
          key: identifier,
          maxAttempts: LOGIN_MAX_ATTEMPTS_IDENTIFIER,
          windowMs: LOGIN_WINDOW_MS,
          blockMs: LOGIN_BLOCK_MS,
        }),
      ]);

      await sleepAtLeast(startedAt, MIN_LOGIN_RESPONSE_MS);

      return invalidCredentialsResponse();
    }

    await Promise.all([
      clearThrottle({ scope: "login-ip", key: ip }),
      clearThrottle({ scope: "login-identifier", key: identifier }),
    ]);

    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      login: user.login,
      role: user.role,
    });

    await setSessionCookie(token);

    return NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        email: user.email,
        login: user.login,
        role: user.role,
        creditBalance: user.creditBalance,
      },
    });
  } catch (error) {
    console.error("login error", error);

    await sleepAtLeast(startedAt, MIN_LOGIN_RESPONSE_MS);

    return NextResponse.json(
      { error: "Не удалось выполнить вход" },
      { status: 500 },
    );
  }
}
