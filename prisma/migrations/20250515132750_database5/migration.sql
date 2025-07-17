-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "codebuddyId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_codebuddyId_fkey" FOREIGN KEY ("codebuddyId") REFERENCES "CodeBuddyRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;
