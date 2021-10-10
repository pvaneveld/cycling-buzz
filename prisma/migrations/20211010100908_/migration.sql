/*
  Warnings:

  - You are about to alter the column `headline` on the `Article` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum("Article_headline")`.
  - You are about to alter the column `nationality` on the `Cyclist` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum("Cyclist_nationality")`.

*/
-- AlterTable
ALTER TABLE `Article` MODIFY `headline` ENUM('CYCLING_NEWS') NOT NULL;

-- AlterTable
ALTER TABLE `Cyclist` MODIFY `nationality` ENUM('NLD', 'BEL', 'ECU', 'COL', 'SVK', 'GBR', 'SVN') NOT NULL;
