/*
  Warnings:

  - You are about to drop the column `accountNumber` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `identityCard` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `identityNumber` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[identityNumber]` on the table `Borrower` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[accountNumber]` on the table `Borrower` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[identityNumber]` on the table `Lender` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[accountNumber]` on the table `Lender` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `accountNumber` to the `Lender` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address` to the `Lender` table without a default value. This is not possible if the table is not empty.
  - Added the required column `identityCard` to the `Lender` table without a default value. This is not possible if the table is not empty.
  - Added the required column `identityNumber` to the `Lender` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `User_accountNumber_key` ON `user`;

-- AlterTable
ALTER TABLE `borrower` ADD COLUMN `accountNumber` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `identityCard` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `identityNumber` VARCHAR(16) NOT NULL DEFAULT '',
    ADD COLUMN `isInstitution` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `lender` ADD COLUMN `accountNumber` VARCHAR(191) NOT NULL,
    ADD COLUMN `address` VARCHAR(191) NOT NULL,
    ADD COLUMN `identityCard` VARCHAR(191) NOT NULL,
    ADD COLUMN `identityNumber` VARCHAR(16) NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `accountNumber`,
    DROP COLUMN `identityCard`,
    DROP COLUMN `identityNumber`;

-- CreateTable
CREATE TABLE `Admin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Admin_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Document` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `borrowerId` INTEGER NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `filePath` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Wallet` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `lenderId` INTEGER NOT NULL,
    `balance` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Wallet_lenderId_key`(`lenderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WalletTransaction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `walletId` INTEGER NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `amount` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sector` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sector` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Sector_sector_key`(`sector`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FundingAction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fundingRequestId` INTEGER NOT NULL,
    `actionType` VARCHAR(191) NOT NULL,
    `actionBy` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FundingStatus` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `status` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `FundingStatus_status_key`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FundingRequest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `borrowerId` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `totalFund` INTEGER NOT NULL,
    `tenor` INTEGER NOT NULL,
    `returnRate` DOUBLE NOT NULL,
    `fundingExpired` DATETIME(3) NOT NULL,
    `sectorId` INTEGER NOT NULL,
    `status` INTEGER NOT NULL DEFAULT 1,
    `fundsRaised` INTEGER NOT NULL DEFAULT 0,
    `isFullyFunded` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Transaction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fundingRequestId` INTEGER NOT NULL,
    `totalFundRaised` INTEGER NOT NULL DEFAULT 0,
    `isFullyFunded` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `lenderId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TransactionDetail` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `transactionId` INTEGER NOT NULL,
    `lenderId` INTEGER NOT NULL,
    `amount` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Review` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `lenderId` INTEGER NOT NULL,
    `borrowerId` INTEGER NOT NULL,
    `rating` INTEGER NOT NULL DEFAULT 0,
    `comment` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Borrower_identityNumber_key` ON `Borrower`(`identityNumber`);

-- CreateIndex
CREATE UNIQUE INDEX `Borrower_accountNumber_key` ON `Borrower`(`accountNumber`);

-- CreateIndex
CREATE UNIQUE INDEX `Lender_identityNumber_key` ON `Lender`(`identityNumber`);

-- CreateIndex
CREATE UNIQUE INDEX `Lender_accountNumber_key` ON `Lender`(`accountNumber`);

-- AddForeignKey
ALTER TABLE `Admin` ADD CONSTRAINT `Admin_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Document` ADD CONSTRAINT `Document_borrowerId_fkey` FOREIGN KEY (`borrowerId`) REFERENCES `Borrower`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Wallet` ADD CONSTRAINT `Wallet_lenderId_fkey` FOREIGN KEY (`lenderId`) REFERENCES `Lender`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WalletTransaction` ADD CONSTRAINT `WalletTransaction_walletId_fkey` FOREIGN KEY (`walletId`) REFERENCES `Wallet`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FundingAction` ADD CONSTRAINT `FundingAction_fundingRequestId_fkey` FOREIGN KEY (`fundingRequestId`) REFERENCES `FundingRequest`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FundingRequest` ADD CONSTRAINT `FundingRequest_borrowerId_fkey` FOREIGN KEY (`borrowerId`) REFERENCES `Borrower`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FundingRequest` ADD CONSTRAINT `FundingRequest_sectorId_fkey` FOREIGN KEY (`sectorId`) REFERENCES `Sector`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FundingRequest` ADD CONSTRAINT `FundingRequest_status_fkey` FOREIGN KEY (`status`) REFERENCES `FundingStatus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_fundingRequestId_fkey` FOREIGN KEY (`fundingRequestId`) REFERENCES `FundingRequest`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_lenderId_fkey` FOREIGN KEY (`lenderId`) REFERENCES `Lender`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TransactionDetail` ADD CONSTRAINT `TransactionDetail_transactionId_fkey` FOREIGN KEY (`transactionId`) REFERENCES `Transaction`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TransactionDetail` ADD CONSTRAINT `TransactionDetail_lenderId_fkey` FOREIGN KEY (`lenderId`) REFERENCES `Lender`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_lenderId_fkey` FOREIGN KEY (`lenderId`) REFERENCES `Lender`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_borrowerId_fkey` FOREIGN KEY (`borrowerId`) REFERENCES `Borrower`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
