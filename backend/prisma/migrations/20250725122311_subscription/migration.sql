-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('chargeable', 'active', 'cancelled');

-- CreateEnum
CREATE TYPE "SubscriptionCancelReason" AS ENUM ('user_decision', 'app_decision', 'payment_fail', 'unknown');

-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "expires_at" SET DEFAULT NOW() + INTERVAL '1 hour';

-- CreateTable
CREATE TABLE "Subscription" (
    "subscription_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "status" "SubscriptionStatus" NOT NULL,
    "cancel_reason" "SubscriptionCancelReason",
    "item_id" TEXT NOT NULL,
    "item_price" INTEGER NOT NULL,
    "next_bill_time" TIMESTAMP(3) NOT NULL,
    "pending_cancel" INTEGER,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("subscription_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_subscription_id_key" ON "Subscription"("subscription_id");

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
