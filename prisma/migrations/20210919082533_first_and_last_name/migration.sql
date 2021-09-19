/*
  Warnings:

  - You are about to drop the column `name` on the `Cyclist` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Cyclist` DROP COLUMN `name`,
    ADD COLUMN `firstName` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `lastName` VARCHAR(191) NOT NULL DEFAULT '';
