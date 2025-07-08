-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "level" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSport" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserSport_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserSport" ADD CONSTRAINT "UserSport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
