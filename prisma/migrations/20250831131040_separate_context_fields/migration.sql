/*
  Warnings:

  - The `pageNumber` column on the `Message` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "chapterName" TEXT,
ADD COLUMN     "containerExpiry" TEXT,
DROP COLUMN "pageNumber",
ADD COLUMN     "pageNumber" INTEGER;
