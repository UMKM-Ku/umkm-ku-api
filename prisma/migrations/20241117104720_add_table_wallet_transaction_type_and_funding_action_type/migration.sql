/*
  Warnings:

  - You are about to drop the column `actionType` on the `fundingaction` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `wallettransaction` table. All the data in the column will be lost.
  - Added the required column `typeId` to the `FundingAction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `typeId` to the `WalletTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `FundingAction` DROP COLUMN `actionType`,
    ADD COLUMN `typeId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `WalletTransaction` DROP COLUMN `type`,
    ADD COLUMN `typeId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `WalletTransactionType` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `WalletTransactionType_type_key`(`type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FundingActionType` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `FundingActionType_type_key`(`type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `WalletTransaction` ADD CONSTRAINT `WalletTransaction_typeId_fkey` FOREIGN KEY (`typeId`) REFERENCES `WalletTransactionType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FundingAction` ADD CONSTRAINT `FundingAction_typeId_fkey` FOREIGN KEY (`typeId`) REFERENCES `FundingActionType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
