/*
  Warnings:

  - The primary key for the `role_permission` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `pageId` on the `role_permission` table. All the data in the column will be lost.
  - You are about to drop the `pages` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `page` to the `role_permission` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PageCode" AS ENUM ('DASHBOARD', 'USER', 'ROLE', 'PERMISSION', 'DEPARTMENT', 'TEAM');

-- DropForeignKey
ALTER TABLE "role_permission" DROP CONSTRAINT "role_permission_pageId_fkey";

-- AlterTable
ALTER TABLE "role_permission" DROP CONSTRAINT "role_permission_pkey",
DROP COLUMN "pageId",
ADD COLUMN     "page" "PageCode" NOT NULL,
ADD CONSTRAINT "role_permission_pkey" PRIMARY KEY ("roleId", "page");

-- DropTable
DROP TABLE "pages";
