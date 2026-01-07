-- CreateEnum
CREATE TYPE "OtpPurpose" AS ENUM ('RESET_PASSWORD');

-- AlterTable
ALTER TABLE "otps" ADD COLUMN     "purpose" "OtpPurpose" NOT NULL DEFAULT 'RESET_PASSWORD',
ADD COLUMN     "revokedAt" TIMESTAMP(3),
ADD COLUMN     "usedAt" TIMESTAMP(3);
