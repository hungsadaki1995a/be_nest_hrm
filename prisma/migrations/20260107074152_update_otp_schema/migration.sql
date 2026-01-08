/*
  Warnings:

  - You are about to drop the `otp` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "otp";

-- CreateTable
CREATE TABLE "otps" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "otpHash" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "purpose" "OtpPurpose" NOT NULL DEFAULT 'RESET_PASSWORD',
    "usedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "otps_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "otps_email_idx" ON "otps"("email");
