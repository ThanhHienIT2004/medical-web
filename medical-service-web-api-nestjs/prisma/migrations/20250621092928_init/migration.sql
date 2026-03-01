/*
  Warnings:

  - You are about to drop the column `date_of_birth` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `hiv_diagnosis_date` on the `Patient` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "date_of_birth",
DROP COLUMN "hiv_diagnosis_date";
