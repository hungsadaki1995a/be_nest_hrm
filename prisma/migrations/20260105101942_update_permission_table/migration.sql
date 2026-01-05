/*
  Warnings:

  - The primary key for the `role_permission` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[page]` on the table `role_permission` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `page` on the `role_permission` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "role_permission" DROP CONSTRAINT "role_permission_pkey",
DROP COLUMN "page",
ADD COLUMN     "page" TEXT NOT NULL,
ADD CONSTRAINT "role_permission_pkey" PRIMARY KEY ("roleId", "page");

-- DropEnum
DROP TYPE "PageCode";

-- CreateIndex
CREATE UNIQUE INDEX "role_permission_page_key" ON "role_permission"("page");
