-- DropIndex
DROP INDEX "role_permission_page_key";

-- AlterTable
ALTER TABLE "otps" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT false;
