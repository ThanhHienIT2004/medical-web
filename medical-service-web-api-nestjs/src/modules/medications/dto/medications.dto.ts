import { IsString, IsInt, IsNumber, IsOptional, Min, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateMedicationDto {
  @ApiProperty({ description: 'Mã viết tắt' })
  @IsString()
  @MinLength(1)
  acronym: string;

  @ApiProperty({ description: 'Tên thuốc' })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({ description: 'Giá', minimum: 0 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price: number;

  @ApiProperty({ description: 'Số lượng có sẵn', minimum: 0 })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  available_quantity: number;
}

export class UpdateMedicationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  acronym?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  available_quantity?: number;
}
