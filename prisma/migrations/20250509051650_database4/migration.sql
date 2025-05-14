/*
  Warnings:

  - The `techstack` column on the `Portfolio` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Portfolio" DROP COLUMN "techstack",
ADD COLUMN     "techstack" JSONB;
