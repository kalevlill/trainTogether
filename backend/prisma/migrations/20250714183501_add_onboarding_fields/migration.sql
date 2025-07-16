-- AlterTable
ALTER TABLE "User" ADD COLUMN     "birthday" TIMESTAMP(3),
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "level" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "profilePicturePath" TEXT,
ADD COLUMN     "sports" JSONB;
