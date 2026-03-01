-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "plan_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "TreatmentPlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
