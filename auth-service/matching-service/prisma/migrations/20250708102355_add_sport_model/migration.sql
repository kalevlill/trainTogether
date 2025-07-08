/*
  Warnings:

  - You are about to drop the column `name` on the `UserSport` table. All the data in the column will be lost.
  - Added the required column `sportId` to the `UserSport` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserSport" DROP COLUMN "name",
ADD COLUMN     "sportId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Sport" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Sport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Sport_name_key" ON "Sport"("name");

-- AddForeignKey
ALTER TABLE "UserSport" ADD CONSTRAINT "UserSport_sportId_fkey" FOREIGN KEY ("sportId") REFERENCES "Sport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
