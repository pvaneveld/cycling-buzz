-- CreateEnum
CREATE TYPE "CountryCode" AS ENUM ('NLD', 'BEL', 'ECU', 'COL', 'SVK', 'GBR', 'SVN');

-- CreateEnum
CREATE TYPE "Medium" AS ENUM ('CYCLING_NEWS');

-- CreateTable
CREATE TABLE "Article" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "published" TIMESTAMP(3) NOT NULL,
    "url" TEXT NOT NULL,
    "headline" TEXT NOT NULL,
    "medium" "Medium" NOT NULL,
    "cyclistId" INTEGER NOT NULL,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cyclist" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "nationality" "CountryCode" NOT NULL,

    CONSTRAINT "Cyclist_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_cyclistId_fkey" FOREIGN KEY ("cyclistId") REFERENCES "Cyclist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
