-- AlterTable
ALTER TABLE "User" ADD COLUMN     "codeBuddyId" TEXT,
ADD COLUMN     "matchingPreferences" JSONB;

-- CreateTable
CREATE TABLE "CodeBuddyRequest" (
    "id" TEXT NOT NULL,
    "requesterId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CodeBuddyRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CodeBuddyRequest_status_idx" ON "CodeBuddyRequest"("status");

-- CreateIndex
CREATE UNIQUE INDEX "CodeBuddyRequest_requesterId_receiverId_key" ON "CodeBuddyRequest"("requesterId", "receiverId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_codeBuddyId_fkey" FOREIGN KEY ("codeBuddyId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CodeBuddyRequest" ADD CONSTRAINT "CodeBuddyRequest_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CodeBuddyRequest" ADD CONSTRAINT "CodeBuddyRequest_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
