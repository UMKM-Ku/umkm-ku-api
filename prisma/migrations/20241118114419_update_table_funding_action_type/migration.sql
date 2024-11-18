/*
  Warnings:

  - You are about to drop the column `type` on the `fundingactiontype` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[action]` on the table `FundingActionType` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `action` to the `FundingActionType` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `FundingActionType_type_key` ON `fundingactiontype`;

-- AlterTable
ALTER TABLE `fundingactiontype` DROP COLUMN `type`,
    ADD COLUMN `action` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `FundingActionType_action_key` ON `FundingActionType`(`action`);
