CREATE TABLE IF NOT EXISTS "AuthThrottle" (
  "key" TEXT NOT NULL,
  "scope" TEXT NOT NULL,
  "attempts" INTEGER NOT NULL DEFAULT 0,
  "firstAttemptAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "lastAttemptAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "blockedUntil" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "AuthThrottle_pkey" PRIMARY KEY ("key")
);

CREATE INDEX IF NOT EXISTS "AuthThrottle_scope_blockedUntil_idx"
  ON "AuthThrottle"("scope", "blockedUntil");

CREATE INDEX IF NOT EXISTS "AuthThrottle_scope_lastAttemptAt_idx"
  ON "AuthThrottle"("scope", "lastAttemptAt");
