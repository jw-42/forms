-- AlterTable
ALTER TABLE "Form" ALTER COLUMN "privacy_policy" SET DEFAULT 'https://bugs-everywhere.ru/typical-data-proccessing-agreement';

-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "expires_at" SET DEFAULT NOW() + INTERVAL '1 hour';
