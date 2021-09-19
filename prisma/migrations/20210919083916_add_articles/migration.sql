-- CreateTable
CREATE TABLE `Article` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `published` DATETIME(3) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `medium` VARCHAR(191) NOT NULL,
    `cyclistId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Article` ADD CONSTRAINT `Article_cyclistId_fkey` FOREIGN KEY (`cyclistId`) REFERENCES `Cyclist`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
