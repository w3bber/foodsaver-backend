/*
  Warnings:

  - You are about to drop the column `business_address` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `business_name` on the `orders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "orders" DROP COLUMN "business_address",
DROP COLUMN "business_name";
