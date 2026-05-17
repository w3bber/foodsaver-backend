-- AlterTable
ALTER TABLE "businesses"
DROP COLUMN "pickup_start_at",
DROP COLUMN "pickup_end_at",
ADD COLUMN "pickup_start_time" TEXT,
ADD COLUMN "pickup_end_time" TEXT;
