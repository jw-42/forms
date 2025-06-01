/*
  Warnings:

  - The values [TEXT] on the enum `QuestionType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "QuestionType_new" AS ENUM ('text');
ALTER TABLE "Question" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Question" ALTER COLUMN "type" TYPE "QuestionType_new" USING ("type"::text::"QuestionType_new");
ALTER TYPE "QuestionType" RENAME TO "QuestionType_old";
ALTER TYPE "QuestionType_new" RENAME TO "QuestionType";
DROP TYPE "QuestionType_old";
ALTER TABLE "Question" ALTER COLUMN "type" SET DEFAULT 'text';
COMMIT;

-- AlterTable
ALTER TABLE "Question" ALTER COLUMN "type" SET DEFAULT 'text';

-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "expires_at" SET DEFAULT NOW() + INTERVAL '1 hour';
