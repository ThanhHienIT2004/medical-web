import { IsString, IsBoolean, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRegimenDto {
  @ApiProperty({ description: 'Giai đoạn chăm sóc', enum: ['PrEP', 'PEP', 'ARV'] })
  @IsString()
  care_stage: string;

  @ApiProperty({ description: 'Loại phác đồ', enum: ['STANDARD', 'CUSTOM'] })
  @IsString()
  regimen_type: string;

  @ApiProperty({ description: 'Danh sách thuốc', type: [String] })
  @IsArray()
  medication_list: string[];

  @ApiProperty({ description: 'Hướng dẫn sử dụng' })
  @IsString()
  user_guide: string;

  @ApiProperty({ description: 'Phác đồ mặc định?' })
  @IsBoolean()
  is_default: boolean;
}
