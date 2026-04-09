export interface Regimen {
    id: string;
    care_stage: string;
    regimen_type: string;
    medication_list: string[];
    user_guide: string;
    is_default: boolean;
    created_at?: string | Date;
    updated_at?: string | Date;
}

export interface CreateRegimenInput {
    care_stage: string;
    regimen_type: string;
    medication_list: string[];
    user_guide: string;
    is_default: boolean;
}