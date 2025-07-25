-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "expires_at" SET DEFAULT NOW() + INTERVAL '1 hour';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "has_subscription" BOOLEAN NOT NULL DEFAULT false;
