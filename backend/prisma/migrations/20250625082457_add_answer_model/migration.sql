-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "expires_at" SET DEFAULT NOW() + INTERVAL '1 hour';

-- CreateTable
CREATE TABLE "AnswersGroup" (
    "id" TEXT NOT NULL,
    "form_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnswersGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Answer" (
    "id" TEXT NOT NULL,
    "answers_group_id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Answer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AnswersGroup" ADD CONSTRAINT "AnswersGroup_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "Form"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_answers_group_id_fkey" FOREIGN KEY ("answers_group_id") REFERENCES "AnswersGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
