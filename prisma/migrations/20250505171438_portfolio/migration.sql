-- AlterTable
ALTER TABLE "User" ADD COLUMN     "porfolioid" TEXT;

-- CreateTable
CREATE TABLE "techStack" (
    "id" TEXT NOT NULL,
    "stack" TEXT NOT NULL,

    CONSTRAINT "techStack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Portfolio" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" VARCHAR(1000) NOT NULL,
    "profile" TEXT,
    "projects" JSONB,
    "name" TEXT NOT NULL,
    "experiences" TEXT NOT NULL,
    "stackid" TEXT NOT NULL,
    "userid" TEXT NOT NULL,
    "achievements" TEXT,
    "certifications" TEXT,
    "skills" TEXT[],
    "interests" TEXT,
    "availability" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Portfolio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialLink" (
    "id" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "portfolioId" TEXT NOT NULL,

    CONSTRAINT "SocialLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PortfolioTechStack" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PortfolioTechStack_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Portfolio_userid_key" ON "Portfolio"("userid");

-- CreateIndex
CREATE INDEX "_PortfolioTechStack_B_index" ON "_PortfolioTechStack"("B");

-- AddForeignKey
ALTER TABLE "Portfolio" ADD CONSTRAINT "Portfolio_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialLink" ADD CONSTRAINT "SocialLink_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PortfolioTechStack" ADD CONSTRAINT "_PortfolioTechStack_A_fkey" FOREIGN KEY ("A") REFERENCES "Portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PortfolioTechStack" ADD CONSTRAINT "_PortfolioTechStack_B_fkey" FOREIGN KEY ("B") REFERENCES "techStack"("id") ON DELETE CASCADE ON UPDATE CASCADE;
