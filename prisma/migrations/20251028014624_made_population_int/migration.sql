/*
  Warnings:

  - You are about to alter the column `population` on the `countries` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.

*/
-- AlterTable
ALTER TABLE `countries` MODIFY `population` INTEGER NOT NULL;
