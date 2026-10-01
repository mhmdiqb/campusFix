-- DropForeignKey
ALTER TABLE `report` DROP FOREIGN KEY `Report_facilityId_fkey`;

-- DropIndex
DROP INDEX `Report_facilityId_fkey` ON `report`;

-- AlterTable
ALTER TABLE `report` MODIFY `facilityId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Report` ADD CONSTRAINT `Report_facilityId_fkey` FOREIGN KEY (`facilityId`) REFERENCES `Facility`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
