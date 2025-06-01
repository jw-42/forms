/*
  Warnings:

  - A unique constraint covering the columns `[title,owner_id]` on the table `Form` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('TEXT');

-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "expires_at" SET DEFAULT NOW() + INTERVAL '1 hour';

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "type" "QuestionType" NOT NULL DEFAULT 'TEXT',
    "form_id" TEXT NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Form_title_owner_id_key" ON "Form"("title", "owner_id");

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "Form"("id") ON DELETE CASCADE ON UPDATE CASCADE;
