/*
  Warnings:

  - You are about to drop the column `datetime` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `sport` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "datetime",
DROP COLUMN "location",
DROP COLUMN "sport";
