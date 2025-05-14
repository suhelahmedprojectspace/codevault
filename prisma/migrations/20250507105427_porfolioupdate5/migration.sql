/*
  Warnings:

  - You are about to drop the `_PortfolioTotechStack` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_PortfolioTotechStack" DROP CONSTRAINT "_PortfolioTotechStack_A_fkey";

-- DropForeignKey
ALTER TABLE "_PortfolioTotechStack" DROP CONSTRAINT "_PortfolioTotechStack_B_fkey";

-- AlterTable
ALTER TABLE "Portfolio" ADD COLUMN     "techstack" TEXT[];

-- AlterTable
ALTER TABLE "techStack" ALTER COLUMN "category" DROP NOT NULL,
ALTER COLUMN "name" DROP NOT NULL;

-- DropTable
DROP TABLE "_PortfolioTotechStack";
