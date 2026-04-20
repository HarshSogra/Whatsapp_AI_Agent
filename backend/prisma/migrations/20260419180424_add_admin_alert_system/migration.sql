-- AlterTable
ALTER TABLE "Institute" ADD COLUMN     "adminPhoneNumber" TEXT;

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "intent" TEXT;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "followUpCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lastFollowUpSentAt" TIMESTAMP(3),
ADD COLUMN     "lastHighIntentAt" TIMESTAMP(3);
