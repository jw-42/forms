/*
  Warnings:

  - A unique constraint covering the columns `[form_id,user_id]` on the table `AnswersGroup` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "expires_at" SET DEFAULT NOW() + INTERVAL '1 hour';

-- CreateIndex
CREATE UNIQUE INDEX "AnswersGroup_form_id_user_id_key" ON "AnswersGroup"("form_id", "user_id");
