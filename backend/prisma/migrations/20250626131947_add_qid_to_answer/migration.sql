/*
  Warnings:

  - Added the required column `question_id` to the `Answer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Answer" ADD COLUMN     "question_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "expires_at" SET DEFAULT NOW() + INTERVAL '1 hour';

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
