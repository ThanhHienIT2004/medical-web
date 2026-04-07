import { IsBoolean, IsDateString, IsEnum, IsInt, IsNotEmpty, IsOptional, Max, Min, MinLength, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum ShiftType {
  MORNING = 'MORNING',
  AFTERNOON = 'AFTERNOON',
  OVERTIME = 'OVERTIME',
}

export enum Days {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

export class CreateDoctorScheduleDto {
  @ApiProperty()
  @MinLength(1, { message: 'ID bác sĩ không được để trống' })
  doctor_id!: string;

  @ApiProperty({ enum: Days })
  @IsEnum(Days, { message: 'Ngày làm không hợp lệ' })
  day!: Days;

  @ApiProperty({ enum: ShiftType })
  @IsEnum(ShiftType, { message: 'Ca làm không hợp lệ' })
  shift!: ShiftType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  is_available?: boolean;

  @ApiProperty({ example: '2025-06-15' })
  @IsNotEmpty()
  @IsDateString()
  date!: string;

  @ApiProperty({ minimum: 1, maximum: 52 })
  @IsInt({ message: 'Số tuần phải là số nguyên' })
  @Min(1, { message: 'Số tuần phải từ 1 đến 52' })
  @Max(52, { message: 'Số tuần phải từ 1 đến 52' })
  @Type(() => Number)
  week_count!: number;
}

export class WeekDateQueryDto {
  @ApiProperty({ example: '2025-06-09' })
  @IsNotEmpty()
  @IsString()
  start_week!: string;

  @ApiProperty({ example: '2025-06-15' })
  @IsNotEmpty()
  @IsString()
  end_week!: string;
}
