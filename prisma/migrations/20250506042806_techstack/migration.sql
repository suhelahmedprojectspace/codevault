/*
  Warnings:

  - The primary key for the `_PortfolioTechStack` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `techStack` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `stack` on the `techStack` table. All the data in the column will be lost.
  - The `id` column on the `techStack` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `B` on the `_PortfolioTechStack` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `category` to the `techStack` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `techStack` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_PortfolioTechStack" DROP CONSTRAINT "_PortfolioTechStack_B_fkey";

-- AlterTable
ALTER TABLE "_PortfolioTechStack" DROP CONSTRAINT "_PortfolioTechStack_AB_pkey",
DROP COLUMN "B",
ADD COLUMN     "B" INTEGER NOT NULL,
ADD CONSTRAINT "_PortfolioTechStack_AB_pkey" PRIMARY KEY ("A", "B");

-- AlterTable
ALTER TABLE "techStack" DROP CONSTRAINT "techStack_pkey",
DROP COLUMN "stack",
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "techStack_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE INDEX "_PortfolioTechStack_B_index" ON "_PortfolioTechStack"("B");

-- AddForeignKey
ALTER TABLE "_PortfolioTechStack" ADD CONSTRAINT "_PortfolioTechStack_B_fkey" FOREIGN KEY ("B") REFERENCES "techStack"("id") ON DELETE CASCADE ON UPDATE CASCADE;
