import {CreateRegimenInput} from "@/types/regimen";
import {CreateTreatmentPlanInput} from "@/types/treatment_plan";

export interface ExaminationReport {
    id: string;
    name: string;
    doctor_id: string;
    risk_assessment: string;
    is_HIV: boolean;
    HIV_test_file: string;
    regimen_id: string;
    treatment_plan_id?: string | null;
    created_at?: string | Date;
    updated_at?: string | Date;
}

export interface CreateExaminationReportInput{
    name: string;
    doctor_id: string;
    risk_assessment: string;
    is_HIV:boolean;
    HIV_test_file: string;
    regimen_id: string;
    treatment_plan_id?: string;
}

export interface MedicalExaminationInput{
    treatmentPlan?:CreateTreatmentPlanInput;
    regimen:CreateRegimenInput;
    report: CreateExaminationReportInput;
}
