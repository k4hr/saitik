import { prisma } from "@/lib/prisma";

type ThrottleScope =
  | "login-ip"
  | "login-identifier"
  | "register-ip"
  | "upload-sign-ip"
  | "upload-sign-user"
  | "generate-ip"
  | "generate-user";

type ThrottleConfig = {
  scope: ThrottleScope;
  key: string;
  maxAttempts: number;
  windowMs: number;
  blockMs: number;
};

type ThrottleState = {
  isBlocked: boolean;
  blockedUntil: Date | null;
  attemptsLeft: number;
};

function now(): Date {
  return new Date();
}

export function getRequestIp(headers: Headers): string {
  const forwardedFor = headers.get("x-forwarded-for");
  const realIp = headers.get("x-real-ip");

  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0]?.trim();

    if (firstIp) {
      return firstIp;
    }
  }

  if (realIp) {
    return realIp.trim();
  }

  return "unknown";
}

export async function getThrottleState(
  config: ThrottleConfig,
): Promise<ThrottleState> {
  const record = await prisma.authThrottle.findUnique({
    where: { key: `${config.scope}:${config.key}` },
    select: {
      attempts: true,
      firstAttemptAt: true,
      blockedUntil: true,
    },
  });

  if (!record) {
    return {
      isBlocked: false,
      blockedUntil: null,
      attemptsLeft: config.maxAttempts,
    };
  }

  const currentTime = now();

  if (record.blockedUntil && record.blockedUntil.getTime() > currentTime.getTime()) {
    return {
      isBlocked: true,
      blockedUntil: record.blockedUntil,
      attemptsLeft: 0,
    };
  }

  const inWindow =
    currentTime.getTime() - record.firstAttemptAt.getTime() <= config.windowMs;

  if (!inWindow) {
    return {
      isBlocked: false,
      blockedUntil: null,
      attemptsLeft: config.maxAttempts,
    };
  }

  return {
    isBlocked: false,
    blockedUntil: null,
    attemptsLeft: Math.max(config.maxAttempts - record.attempts, 0),
  };
}

export async function registerThrottleFailure(
  config: ThrottleConfig,
): Promise<ThrottleState> {
  const currentTime = now();
  const storageKey = `${config.scope}:${config.key}`;

  const existing = await prisma.authThrottle.findUnique({
    where: { key: storageKey },
    select: {
      key: true,
      attempts: true,
      firstAttemptAt: true,
      blockedUntil: true,
    },
  });

  if (!existing) {
    const attempts = 1;
    const blockedUntil =
      attempts >= config.maxAttempts
        ? new Date(currentTime.getTime() + config.blockMs)
        : null;

    await prisma.authThrottle.create({
      data: {
        key: storageKey,
        scope: config.scope,
        attempts,
        firstAttemptAt: currentTime,
        lastAttemptAt: currentTime,
        blockedUntil,
      },
    });

    return {
      isBlocked: Boolean(blockedUntil),
      blockedUntil,
      attemptsLeft: Math.max(config.maxAttempts - attempts, 0),
    };
  }

  const stillBlocked =
    existing.blockedUntil &&
    existing.blockedUntil.getTime() > currentTime.getTime();

  if (stillBlocked) {
    return {
      isBlocked: true,
      blockedUntil: existing.blockedUntil,
      attemptsLeft: 0,
    };
  }

  const inWindow =
    currentTime.getTime() - existing.firstAttemptAt.getTime() <= config.windowMs;

  const attempts = inWindow ? existing.attempts + 1 : 1;
  const firstAttemptAt = inWindow ? existing.firstAttemptAt : currentTime;
  const blockedUntil =
    attempts >= config.maxAttempts
      ? new Date(currentTime.getTime() + config.blockMs)
      : null;

  await prisma.authThrottle.update({
    where: { key: storageKey },
    data: {
      attempts,
      firstAttemptAt,
      lastAttemptAt: currentTime,
      blockedUntil,
    },
  });

  return {
    isBlocked: Boolean(blockedUntil),
    blockedUntil,
    attemptsLeft: Math.max(config.maxAttempts - attempts, 0),
  };
}

export async function clearThrottle(config: {
  scope: ThrottleScope;
  key: string;
}): Promise<void> {
  await prisma.authThrottle
    .delete({
      where: { key: `${config.scope}:${config.key}` },
    })
    .catch(() => undefined);
}

export async function sleepAtLeast(startMs: number, minDurationMs: number) {
  const elapsed = Date.now() - startMs;

  if (elapsed < minDurationMs) {
    await new Promise((resolve) => setTimeout(resolve, minDurationMs - elapsed));
  }
}
