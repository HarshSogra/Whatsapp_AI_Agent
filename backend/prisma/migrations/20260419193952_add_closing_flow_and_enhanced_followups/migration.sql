-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "lastFollowUpType" TEXT,
ADD COLUMN     "leadStatus" TEXT NOT NULL DEFAULT 'COLD';
