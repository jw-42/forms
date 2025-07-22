-- AlterTable
ALTER TABLE "DataProcessingAgreementLog" ALTER COLUMN "agreement_url" SET DEFAULT 'https://bugs-everywhere.ru/typical-data-processing-agreement';

-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "expires_at" SET DEFAULT NOW() + INTERVAL '1 hour';
