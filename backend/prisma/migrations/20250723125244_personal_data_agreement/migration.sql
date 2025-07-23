-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "expires_at" SET DEFAULT NOW() + INTERVAL '1 hour';

-- CreateTable
CREATE TABLE "PersonalDataAgreementLog" (
    "id" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "form_id" TEXT NOT NULL,
    "accepted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "withdrawn_at" TIMESTAMP(3),
    "agreement_url" TEXT NOT NULL,
    "agreement_hash" TEXT NOT NULL,
    "ip_address" TEXT,
    "user_agent" TEXT,

    CONSTRAINT "PersonalDataAgreementLog_pkey" PRIMARY KEY ("id")
);
