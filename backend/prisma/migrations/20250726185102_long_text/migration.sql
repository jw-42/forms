-- AlterEnum
ALTER TYPE "QuestionType" ADD VALUE 'long_text';

-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "expires_at" SET DEFAULT NOW() + INTERVAL '1 hour';
