-- AlterTable
ALTER TABLE "Question" ALTER COLUMN "required" SET DEFAULT true;

-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "expires_at" SET DEFAULT NOW() + INTERVAL '1 hour';
