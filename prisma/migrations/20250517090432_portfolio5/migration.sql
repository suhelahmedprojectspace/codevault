/*
  Warnings:

  - You are about to drop the column `porfolioid` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "porfolioid",
ADD COLUMN     "portfolioId" TEXT;
