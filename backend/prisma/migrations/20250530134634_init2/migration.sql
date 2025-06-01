/*
  Warnings:

  - You are about to drop the `Question` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Traffic` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_form_id_fkey";

-- DropForeignKey
ALTER TABLE "Traffic" DROP CONSTRAINT "Traffic_vk_user_id_fkey";

-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "expires_at" SET DEFAULT NOW() + INTERVAL '1 hour';

-- DropTable
DROP TABLE "Question";

-- DropTable
DROP TABLE "Traffic";

-- DropEnum
DROP TYPE "QuestionType";
