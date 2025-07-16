-- AlterTable
ALTER TABLE "Form" ADD COLUMN     "notifications" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "expires_at" SET DEFAULT NOW() + INTERVAL '1 hour';
