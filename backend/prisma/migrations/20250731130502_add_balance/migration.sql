/*
  Warnings:

  - You are about to drop the column `has_subscription` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "SubscriptionType" AS ENUM ('standard_30', 'premium_30');

-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "expires_at" SET DEFAULT NOW() + INTERVAL '1 hour';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "has_subscription",
ADD COLUMN     "balance" INTEGER NOT NULL DEFAULT 5;
