/*
  Warnings:

  - The primary key for the `role_permission` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `page` on the `role_permission` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Page" AS ENUM ('USER', 'DEPARTMENT', 'TEAM', 'ROLE');

-- AlterTable
ALTER TABLE "role_permission" DROP CONSTRAINT "role_permission_pkey",
DROP COLUMN "page",
ADD COLUMN     "page" "Page" NOT NULL,
ADD CONSTRAINT "role_permission_pkey" PRIMARY KEY ("roleId", "page");

-- CreateIndex
CREATE INDEX "role_permission_roleId_idx" ON "role_permission"("roleId");

-- CreateIndex
CREATE INDEX "user_roles_userId_idx" ON "user_roles"("userId");
