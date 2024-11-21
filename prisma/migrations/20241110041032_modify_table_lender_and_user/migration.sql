/*
  Warnings:

  - You are about to drop the column `accountNumber` on the `borrower` table. All the data in the column will be lost.
  - You are about to drop the column `birthDate` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[accountNumber]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `birthDate` to the `Lender` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accountNumber` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Borrower_accountNumber_key` ON `Borrower`;

-- AlterTable
ALTER TABLE `Borrower` DROP COLUMN `accountNumber`;

-- AlterTable
ALTER TABLE `Lender` ADD COLUMN `birthDate` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `birthDate`,
    ADD COLUMN `accountNumber` VARCHAR(50) NOT NULL,
    MODIFY `password` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_accountNumber_key` ON `User`(`accountNumber`);
