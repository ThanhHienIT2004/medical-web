import { Field, InputType } from "@nestjs/graphql"
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { GraphQLDate } from 'graphql-scalars';
import { Role } from '../../role/role.enum';

@InputType()
export class RegisterDto {

  @Field(() => String)
  @IsString({ message: 'full_name phải là chuỗi' })
  @IsNotEmpty({ message: 'full_name không được để trống' })
  @MinLength(3, { message: 'full_name phải có ít nhất 3 ký tự' })
  full_name: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString({ message: 'phone phải là chuỗi' })
  phone?: string;

  @Field(() => String)
  @IsEmail({}, { message: 'email không đúng định dạng' })
  @IsNotEmpty({ message: 'email không được để trống' })
  email: string;

  @Field(() => String)
  @IsString({ message: 'password phải là chuỗi' })
  @IsNotEmpty({ message: 'password không được để trống' })
  password: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString({ message: 'address phải là chuỗi' })
  address?: string;

  @Field(() => String, { nullable: true, description: 'Avatar' })
  @IsOptional()
  @IsString()
  avatar?: string | null;

  @Field(() => String, { nullable: true, description: 'Role of the user', defaultValue: Role.USER })
  @IsString({ message: 'role phải là chuỗi' })
  @IsNotEmpty({ message: 'role không được để trống' })
  role: string;

  @Field(() => GraphQLDate, { nullable: true })
  @IsOptional({ message: 'date_of_birth là tùy chọn' })
  date_of_birth?: string;
}

@InputType()
export class LoginDto{
    @Field(() => String)
    @IsNotEmpty()
    @IsEmail()
    email: string

    @Field(() => String)
    @IsNotEmpty()
    @MinLength(6)
    password: string
}