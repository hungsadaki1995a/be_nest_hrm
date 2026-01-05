/*
  Warnings:

  - You are about to drop the column `groupId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `teamId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `group_page_permissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `groups` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `headId` on table `departments` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "departments" DROP CONSTRAINT "departments_headId_fkey";

-- DropForeignKey
ALTER TABLE "group_page_permissions" DROP CONSTRAINT "group_page_permissions_groupId_fkey";

-- DropForeignKey
ALTER TABLE "group_page_permissions" DROP CONSTRAINT "group_page_permissions_pageId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_groupId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_teamId_fkey";

-- AlterTable
ALTER TABLE "departments" ALTER COLUMN "headId" SET NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "groupId",
DROP COLUMN "teamId",
ADD COLUMN     "identityId" TEXT;

-- DropTable
DROP TABLE "group_page_permissions";

-- DropTable
DROP TABLE "groups";

-- CreateTable
CREATE TABLE "team_members" (
    "teamId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "team_members_pkey" PRIMARY KEY ("teamId","userId")
);

-- AddForeignKey
ALTER TABLE "departments" ADD CONSTRAINT "departments_headId_fkey" FOREIGN KEY ("headId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
