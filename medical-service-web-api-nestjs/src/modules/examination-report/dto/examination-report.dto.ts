import { IsString, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CreateRegimenDto } from 'src/modules/regimen/dto/regimen.dto';

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
  @IsString()
  regimen_id: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  treatment_plan_id?: string;
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
