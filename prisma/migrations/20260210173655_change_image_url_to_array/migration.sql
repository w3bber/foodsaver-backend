/*
  Warnings:

  - The `image_url` column on the `businesses` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `image_url` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "businesses" DROP COLUMN "image_url",
ADD COLUMN     "image_url" TEXT[];

-- AlterTable
ALTER TABLE "users" DROP COLUMN "image_url",
ADD COLUMN     "image_url" TEXT[];
