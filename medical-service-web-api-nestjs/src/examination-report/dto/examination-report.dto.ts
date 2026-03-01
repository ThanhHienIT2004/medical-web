import { IsString, IsBoolean, IsInt, IsOptional, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateExaminationReportDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  doctor_id: string;

  @ApiProperty()
  @IsString()
  risk_assessment: string;

  @ApiProperty()
  @IsBoolean()
  is_HIV: boolean;

  @ApiProperty()
  @IsString()
  HIV_test_file: string;

  @ApiProperty()
  @IsInt()
  @Type(() => Number)
  regimen_id: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  treatment_plan_id?: number;
}

export class CreateRegimenDto {
  @ApiProperty()
  @IsString()
  care_stage: string;

  @ApiProperty()
  @IsString()
  regimen_type: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  medication_list: string[];

  @ApiProperty()
  @IsString()
  user_guide: string;

  @ApiProperty()
  @IsBoolean()
  is_default: boolean;
}

export class CreateTreatmentPlanDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  hiv_diagnosis_date?: Date;

  @ApiProperty()
  start_date: Date;

  @ApiPropertyOptional()
  @IsOptional()
  end_date?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class MedicalExaminationDto {
  @ApiPropertyOptional({ type: CreateTreatmentPlanDto })
  @IsOptional()
  @Type(() => CreateTreatmentPlanDto)
  treatmentPlan?: CreateTreatmentPlanDto;

  @ApiProperty({ type: CreateRegimenDto })
  @Type(() => CreateRegimenDto)
  regimen: CreateRegimenDto;

  @ApiProperty({ type: CreateExaminationReportDto })
  @Type(() => CreateExaminationReportDto)
  report: CreateExaminationReportDto;
}
