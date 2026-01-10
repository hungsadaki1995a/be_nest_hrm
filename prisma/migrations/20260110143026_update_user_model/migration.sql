/*
  Warnings:

  - You are about to drop the column `avatarUrl` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[identityId]` on the table `user_profiles` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `relationship` on the `emergency_contacts` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "UserRelationship" AS ENUM ('PARENT', 'SPOUSE', 'CHILD', 'FRIEND', 'OTHER');

-- AlterTable
ALTER TABLE "emergency_contacts" DROP COLUMN "relationship",
ADD COLUMN     "relationship" "UserRelationship" NOT NULL;

-- AlterTable
ALTER TABLE "user_profiles" ADD COLUMN     "avatarUrl" TEXT;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "avatarUrl",
ALTER COLUMN "status" SET DEFAULT 'PROBATION';

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_identityId_key" ON "user_profiles"("identityId");
