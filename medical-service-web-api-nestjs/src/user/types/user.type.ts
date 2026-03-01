import { Field, ID, InputType, Int, ObjectType } from '@nestjs/graphql';
import { GraphQLDate } from 'graphql-scalars';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { Role } from '../../role/role.enum';

@ObjectType()
export class User {
  @Field(() => ID, { description: 'Unique identifier for the user' })
  id: string;

  @Field(() => String, { description: 'Full name of the user' })
  full_name: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;

  @Field(() => String, {
    nullable: true,
    description: 'Phone number of the user',
  })
  phone?: string | null;

  @Field(() => String, { nullable: true, description: 'Address of the user' })
  address?: string | null;

  @Field(() => String, { nullable: true, description: 'Avatar' })
  avatar?: string | null;

  @Field(() => GraphQLDate, {
    nullable: true,
    description: 'Date of birth of the user',
  })
  date_of_birth?: Date | null;

  @Field(() => String, {
    nullable: true,
    description: 'Role of the user',
    defaultValue: Role.USER,
  })
  role: string;

  @Field(() => GraphQLDate, { description: 'Creation date of the user record' })
  created_at: Date;

  @Field(() => GraphQLDate, {
    nullable: true,
    description: 'Last update date of the user record',
  })
  updated_at?: Date | null; //
}

@ObjectType()
export class UserPaginationResponse {
  @Field(() => [User])
  data: User[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  currentPage: number;

  @Field(() => Int)
  itemsPerPage: number;
}

@InputType()
export class PaginationInput {
  @Field(() => Int, { defaultValue: 1 })
  @IsInt({ message: 'page phải là số nguyên' })
  @Min(1, { message: 'page phải >= 1' })
  @IsOptional()
  page?: number = 1;

  @Field(() => Int, { defaultValue: 10 })
  @IsInt({ message: 'limit phải là số nguyên' })
  @Min(1, { message: 'limit phải >= 1' })
  @IsOptional()
  limit?: number = 10;
}

@InputType()
export class GetUsersEmailInput {
  @Field(() => String, { nullable: true })
  @IsEmail({}, { message: 'email không đúng định dạng' })
  @IsNotEmpty({ message: 'email không được để trống' })
  email: string;
}

@InputType()
export class GetUserByIdInput {
  @Field(() => ID, { description: 'ID of the user to retrieve' })
  @IsString({ message: 'ID phải là chuỗi' })
  @IsNotEmpty({ message: 'ID không được để trống' })
  id: string;
}

@InputType()
export class CreateUserInput {
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

  @Field(() => String, {
    nullable: true,
    description: 'Role of the user',
    defaultValue: Role.USER,
  })
  @IsString({ message: 'role phải là chuỗi' })
  @IsNotEmpty({ message: 'role không được để trống' })
  role: string;

  @Field(() => GraphQLDate, { nullable: true })
  @IsOptional({ message: 'date_of_birth là tùy chọn' })
  date_of_birth?: string;
}

@InputType()
export class UpdateUserInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString({ message: 'full_name phải là chuỗi' })
  @MinLength(3, { message: 'full_name phải có ít nhất 3 ký tự' })
  full_name?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString({ message: 'phone phải là chuỗi' })
  phone?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEmail({}, { message: 'email không đúng định dạng' })
  email?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString({ message: 'password phải là chuỗi' })
  password?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString({ message: 'address phải là chuỗi' })
  address?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString({ message: 'avatar phải là chuỗi' })
  avatar?: string;

  @Field(() => GraphQLDate, { nullable: true })
  @IsOptional()
  date_of_birth?: string;
}

@InputType()
export class ResetPasswordInput {
  @Field()
  email: string;

  @Field()
  otp: string;

  @Field()
  newPassword: string;
}
