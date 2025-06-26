/*
  Warnings:

  - Added the required column `user_id` to the `AnswersGroup` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AnswersGroup" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "expires_at" SET DEFAULT NOW() + INTERVAL '1 hour';

-- AddForeignKey
ALTER TABLE "AnswersGroup" ADD CONSTRAINT "AnswersGroup_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
