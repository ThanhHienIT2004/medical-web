import { IsString, IsNotEmpty, IsOptional, IsDate, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreatePatientDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  patient_id: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  date_of_birth?: Date;

  @ApiProperty({ enum: ['male', 'female', 'other'] })
  @IsString()
  @IsNotEmpty()
  @Matches(/^(male|female|other)$/i)
  gender: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  hiv_diagnosis_date?: Date;
}

export class UpdatePatientUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  full_name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional()
  @IsOptional()
  avatar?: string;

  @ApiPropertyOptional()
  @IsOptional()
  date_of_birth?: string;
}

export class UpdatePatientDto {
  @ApiPropertyOptional()
  @IsOptional()
  gender?: string;

  @ApiPropertyOptional({ description: 'Thông tin user để cập nhật', type: UpdatePatientUserDto })
  @IsOptional()
  @Type(() => UpdatePatientUserDto)
  user?: UpdatePatientUserDto;

  // Auto-filled from URL param
  patient_id?: string;
}
