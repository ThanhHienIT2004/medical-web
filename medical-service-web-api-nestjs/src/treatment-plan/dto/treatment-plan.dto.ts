import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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

export class UpdateTreatmentPlanDto {
  @ApiPropertyOptional()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  hiv_diagnosis_date?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  start_date?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  end_date?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  notes?: string;

  // Auto-filled from URL param
  id?: number;
}
