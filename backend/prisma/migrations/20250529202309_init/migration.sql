-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('TEXT');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "vk_user_id" INTEGER NOT NULL,
    "is_banned" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Traffic" (
    "id" BIGSERIAL NOT NULL,
    "vk_user_id" INTEGER,
    "vk_app_id" INTEGER,
    "vk_chat_id" INTEGER,
    "vk_is_app_user" INTEGER,
    "vk_are_notifications_enabled" INTEGER,
    "vk_language" TEXT,
    "vk_ref" TEXT,
    "vk_access_token_settings" TEXT,
    "vk_group_id" INTEGER,
    "vk_viewer_group_role" TEXT,
    "vk_platform" TEXT,
    "vk_is_favorite" INTEGER,
    "vk_ts" INTEGER,
    "vk_is_recommended" INTEGER,
    "vk_profile_id" INTEGER,
    "vk_has_profile_button" INTEGER,
    "vk_testing_group_id" INTEGER,
    "sign" TEXT,
    "odr_enabled" INTEGER,

    CONSTRAINT "Traffic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" BIGSERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "access_token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL DEFAULT NOW() + INTERVAL '1 hour',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Form" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Form_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" SERIAL NOT NULL,
    "form_id" TEXT NOT NULL,
    "type" "QuestionType" NOT NULL DEFAULT 'TEXT',
    "text" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_vk_user_id_key" ON "User"("vk_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Session_access_token_key" ON "Session"("access_token");

-- AddForeignKey
ALTER TABLE "Traffic" ADD CONSTRAINT "Traffic_vk_user_id_fkey" FOREIGN KEY ("vk_user_id") REFERENCES "User"("vk_user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "Form"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
