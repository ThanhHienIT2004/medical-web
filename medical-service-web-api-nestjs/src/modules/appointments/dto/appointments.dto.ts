import { IsString, IsInt, IsNotEmpty, IsOptional, IsBoolean, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateAppointmentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  patient_id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  doctor_id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  slot_id: string;

  @ApiProperty({ enum: ['CONSULTATION', 'TREATMENT', 'FOLLOW_UP'] })
  @IsString()
  @IsNotEmpty()
  appointment_type: string;

  @ApiProperty({ example: '2025-06-15T09:00:00Z' })
  @IsNotEmpty()
  appointment_date: Date;

  @ApiPropertyOptional({ default: 'PENDING' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  is_anonymous?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string | null;
}

export class UpdateAppointmentDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  is_done?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  appointment_type?: string;

  @ApiPropertyOptional()
  @IsOptional()
  appointment_date?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  is_anonymous?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  // Auto-filled from URL param
  appointment_id?: string;
}

export class UpdateAppointmentStatusDto {
  @ApiProperty({ enum: ['PENDING', 'COMPLETED', 'CANCELLED'] })
  @IsString()
  @IsNotEmpty()
  @IsIn(['PENDING', 'COMPLETED', 'CANCELLED'])
  status: string;
}

export class PaginationAppointmentQueryDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  doctor_id: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page?: number = 1;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  pageSize?: number = 10;
}
