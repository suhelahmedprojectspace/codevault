/*
  Warnings:

  - You are about to drop the `_PortfolioTechStack` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_PortfolioTechStack" DROP CONSTRAINT "_PortfolioTechStack_A_fkey";

-- DropForeignKey
ALTER TABLE "_PortfolioTechStack" DROP CONSTRAINT "_PortfolioTechStack_B_fkey";

-- DropTable
DROP TABLE "_PortfolioTechStack";

-- CreateTable
CREATE TABLE "_PortfolioTotechStack" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PortfolioTotechStack_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_PortfolioTotechStack_B_index" ON "_PortfolioTotechStack"("B");

-- AddForeignKey
ALTER TABLE "_PortfolioTotechStack" ADD CONSTRAINT "_PortfolioTotechStack_A_fkey" FOREIGN KEY ("A") REFERENCES "Portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PortfolioTotechStack" ADD CONSTRAINT "_PortfolioTotechStack_B_fkey" FOREIGN KEY ("B") REFERENCES "techStack"("id") ON DELETE CASCADE ON UPDATE CASCADE;
