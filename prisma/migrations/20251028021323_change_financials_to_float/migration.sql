/*
  Warnings:

  - You are about to alter the column `exchange_rate` on the `countries` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Double`.
  - You are about to alter the column `estimated_gdp` on the `countries` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Double`.

*/
-- AlterTable
ALTER TABLE `countries` MODIFY `exchange_rate` DOUBLE NULL,
    MODIFY `estimated_gdp` DOUBLE NULL;
