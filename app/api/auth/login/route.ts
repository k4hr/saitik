import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { createSessionToken, setSessionCookie, verifyPassword } from "@/lib/auth";

type LoginBody = {
  identifier?: string;
  password?: string;
};

function normalizeIdentifier(value: string): string {
  return value.trim().toLowerCase();
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as LoginBody;

    const identifier = body.identifier ? normalizeIdentifier(body.identifier) : "";
    const password = body.password ?? "";

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "identifier и password обязательны" },
        { status: 400 }
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
        passwordHash: true,
        creditBalance: true,
        isActive: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Неверный логин/email или пароль" },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: "Аккаунт отключен" },
        { status: 403 }
      );
    }

    const isValidPassword = await verifyPassword(password, user.passwordHash);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Неверный логин/email или пароль" },
        { status: 401 }
      );
    }

    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      login: user.login,
    });

    await setSessionCookie(token);

    return NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        email: user.email,
        login: user.login,
        creditBalance: user.creditBalance,
      },
    });
  } catch (error) {
    console.error("login error", error);

    return NextResponse.json(
      { error: "Не удалось выполнить вход" },
      { status: 500 }
    );
  }
}
