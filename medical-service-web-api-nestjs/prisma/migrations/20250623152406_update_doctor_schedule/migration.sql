/*
  Warnings:

  - Added the required column `day` to the `DoctorSchedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shift` to the `DoctorSchedule` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ShiftType" AS ENUM ('MORNING', 'AFTERNOON', 'OVERTIME');

-- CreateEnum
CREATE TYPE "Days" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- AlterTable
ALTER TABLE "DoctorSchedule" ADD COLUMN     "day" "Days" NOT NULL,
ADD COLUMN     "shift" "ShiftType" NOT NULL;
