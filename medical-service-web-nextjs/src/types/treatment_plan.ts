
export interface TreatmentPlan{
    id:string;
    name:string;
    hiv_diagnosis_date?: string | Date;
    start_date: string | Date;
    end_date?: string | Date;
    notes?: string;
    created_at?: string | Date;
    updated_at?: string | Date;
}

    export interface CreateTreatmentPlanInput {
        name: string;
        hiv_diagnosis_date?: string;
        start_date?: string;
        end_date?: string;
        notes?: string;
    }

    export type UpdateTreatmentPlanInput = Partial<CreateTreatmentPlanInput>