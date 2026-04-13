-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM (
  'DRAFT',
  'PENDING_PAYMENT',
  'PAID',
  'PROCESSING',
  'DONE',
  'FAILED',
  'CANCELED'
);

-- CreateEnum
CREATE TYPE "AssetType" AS ENUM (
  'FACE',
  'REFERENCE',
  'RESULT'
);

-- CreateEnum
CREATE TYPE "CreditTransactionType" AS ENUM (
  'TOPUP',
  'SPEND',
  'REFUND',
  'ADMIN_ADJUSTMENT'
);

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM (
  'PENDING',
  'SUCCEEDED',
  'FAILED',
  'CANCELED'
);

-- CreateTable
CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "login" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "creditBalance" INTEGER NOT NULL DEFAULT 0,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StylePreset" (
  "id" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "coverImageUrl" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "StylePreset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "stylePresetId" TEXT,
  "title" TEXT,
  "goal" TEXT,
  "status" "OrderStatus" NOT NULL DEFAULT 'DRAFT',
  "selectedFormat" TEXT,
  "selectedMood" TEXT,
  "notes" TEXT,
  "creditsSpent" INTEGER NOT NULL DEFAULT 0,
  "priceRub" INTEGER,
  "currency" TEXT NOT NULL DEFAULT 'RUB',
  "paidAt" TIMESTAMP(3),
  "startedAt" TIMESTAMP(3),
  "finishedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderAsset" (
  "id" TEXT NOT NULL,
  "orderId" TEXT NOT NULL,
  "type" "AssetType" NOT NULL,
  "url" TEXT NOT NULL,
  "mimeType" TEXT,
  "width" INTEGER,
  "height" INTEGER,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "OrderAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "orderId" TEXT,
  "provider" TEXT NOT NULL,
  "externalPaymentId" TEXT,
  "amountRub" INTEGER NOT NULL,
  "creditsPurchased" INTEGER,
  "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
  "paidAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreditTransaction" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "orderId" TEXT,
  "type" "CreditTransactionType" NOT NULL,
  "amount" INTEGER NOT NULL,
  "balanceAfter" INTEGER NOT NULL,
  "description" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "CreditTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_login_key" ON "User"("login");

-- CreateIndex
CREATE UNIQUE INDEX "StylePreset_slug_key" ON "StylePreset"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_externalPaymentId_key" ON "Payment"("externalPaymentId");

-- AddForeignKey
ALTER TABLE "Order"
ADD CONSTRAINT "Order_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order"
ADD CONSTRAINT "Order_stylePresetId_fkey"
FOREIGN KEY ("stylePresetId") REFERENCES "StylePreset"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderAsset"
ADD CONSTRAINT "OrderAsset_orderId_fkey"
FOREIGN KEY ("orderId") REFERENCES "Order"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment"
ADD CONSTRAINT "Payment_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment"
ADD CONSTRAINT "Payment_orderId_fkey"
FOREIGN KEY ("orderId") REFERENCES "Order"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditTransaction"
ADD CONSTRAINT "CreditTransaction_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditTransaction"
ADD CONSTRAINT "CreditTransaction_orderId_fkey"
FOREIGN KEY ("orderId") REFERENCES "Order"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
