import { IsInt, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateAppointmentSlotDto {
  @ApiProperty()
  @IsInt()
  @Type(() => Number)
  schedule_id: number;

  @ApiProperty({ example: '2025-06-15T08:00:00Z' })
  @Type(() => Date)
  start_time: Date;

  @ApiProperty({ example: '2025-06-15T08:30:00Z' })
  @Type(() => Date)
  end_time: Date;

  @ApiPropertyOptional({ default: 6 })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  max_patients?: number;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  booked_count?: number;
}

export class UpdateAppointmentSlotDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  schedule_id?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  start_time?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  end_time?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  max_patients?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  booked_count?: number;
}
