import { IsString, IsInt, Min, IsOptional, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDoctorDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  qualifications: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  specialty: string;

  @ApiPropertyOptional()
  @IsInt()
  @Min(0)
  @IsOptional()
  work_seniority: number;

  @ApiPropertyOptional()
  @IsString()
  hospital: string;

  @ApiPropertyOptional({ default: 0 })
  @IsNumber()
  @IsOptional()
  default_fee?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  titles?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  positions?: string;

  @ApiPropertyOptional({ default: 0 })
  @IsNumber()
  @IsOptional()
  rating?: number;

  @ApiPropertyOptional({ enum: ['MALE', 'FEMALE', 'OTHER'] })
  @IsOptional()
  @IsString()
  gender: string;
}

export class RegisterDoctorDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ default: 'DOCTOR' })
  @IsString()
  @IsNotEmpty()
  role: string;

  @ApiProperty({ enum: ['MALE', 'FEMALE', 'OTHER'] })
  @IsString()
  @IsNotEmpty()
  gender: string;
}

export class UpdateDoctorDto {
  @ApiPropertyOptional()
  @IsOptional()
  full_name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  gender?: string;

  @ApiPropertyOptional()
  @IsOptional()
  qualifications?: string;

  @ApiPropertyOptional()
  @IsOptional()
  work_seniority?: number;

  @ApiPropertyOptional()
  @IsOptional()
  specialty?: string;

  @ApiPropertyOptional()
  @IsOptional()
  hospital?: string;

  @ApiPropertyOptional()
  @IsOptional()
  default_fee?: number;

  @ApiPropertyOptional()
  @IsOptional()
  titles?: string;

  @ApiPropertyOptional()
  @IsOptional()
  positions?: string;

  @ApiPropertyOptional()
  @IsOptional()
  rating?: number;
}
