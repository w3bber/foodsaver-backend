-- AlterTable
ALTER TABLE "products" DROP COLUMN "expiry_date";

-- AlterTable
ALTER TABLE "businesses"
ADD COLUMN "pickup_start_at" TIMESTAMP(3),
ADD COLUMN "pickup_end_at" TIMESTAMP(3);
