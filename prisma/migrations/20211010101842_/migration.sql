/*
  Warnings:

  - You are about to alter the column `medium` on the `Article` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum("Article_medium")`.
  - You are about to alter the column `headline` on the `Article` table. The data in that column could be lost. The data in that column will be cast from `Enum("Article_headline")` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `Article` MODIFY `medium` ENUM('CYCLING_NEWS') NOT NULL,
    MODIFY `headline` VARCHAR(191) NOT NULL;
