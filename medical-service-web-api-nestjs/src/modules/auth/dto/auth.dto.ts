import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ description: 'Họ tên đầy đủ', example: 'Nguyễn Văn A' })
  @IsString({ message: 'full_name phải là chuỗi' })
  @IsNotEmpty({ message: 'full_name không được để trống' })
  @MinLength(3, { message: 'full_name phải có ít nhất 3 ký tự' })
  full_name: string;

  @ApiPropertyOptional({ description: 'Số điện thoại', example: '0909090909' })
  @IsOptional()
  @IsString({ message: 'phone phải là chuỗi' })
  phone?: string;

  @ApiProperty({ description: 'Email', example: 'user0@gmail.com' })
  @IsEmail({}, { message: 'email không đúng định dạng' })
  @IsNotEmpty({ message: 'email không được để trống' })
  email: string;

  @ApiProperty({ description: 'Mật khẩu', example: '123456' })
  @IsString({ message: 'password phải là chuỗi' })
  @IsNotEmpty({ message: 'password không được để trống' })
  password: string;

  @ApiPropertyOptional({ description: 'Địa chỉ' })
  @IsOptional()
  @IsString({ message: 'address phải là chuỗi' })
  address?: string;

  @ApiPropertyOptional({ description: 'Avatar URL', example: 'https://example.com/avatar.png' })
  @IsOptional()
  @IsString()
  avatar?: string | null;

  @ApiPropertyOptional({ description: 'Vai trò', default: 'USER', enum: ['USER', 'ADMIN', 'DOCTOR', 'GUEST'] })
  @IsString({ message: 'role phải là chuỗi' })
  @IsNotEmpty({ message: 'role không được để trống' })
  role: string;

  @ApiPropertyOptional({ description: 'Ngày sinh', example: '1990-01-01' })
  @IsOptional({ message: 'date_of_birth là tùy chọn' })
  date_of_birth?: string;
}

export class LoginDto {
  @ApiProperty({ description: 'Email', example: 'user0@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Mật khẩu', example: '123456' })
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}