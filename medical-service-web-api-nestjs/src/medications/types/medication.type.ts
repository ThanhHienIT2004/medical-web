import { Field, Float, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Decimal } from 'generated/prisma/runtime/library';
import { GraphQLDate } from 'graphql-scalars';
import { IsInt, IsNumber, IsString, Min, MinLength } from 'class-validator';
import { PaginatedResponse } from '../../common/types/pagination';

@ObjectType()
export class Medication {
  @Field(() => Int)
  id: number;

  @Field()
  acronym: string;

  @Field()
  name: string;

  @Field(() => Float)
  price: Decimal;

  @Field(() => Int)
  available_quantity: number;

  @Field(() => GraphQLDate)
  created_at: Date;

  @Field(() => GraphQLDate)
  updated_at: Date;
}

@ObjectType()
export class PaginatedMedications extends PaginatedResponse<Medication> {
  @Field(() => [Medication])
  declare items: Medication[];
}

@InputType()
export class SearchMedicationsInput {
  @Field()
  @IsString({ message: 'Từ khóa phải là chuỗi' })
  keyword: string;
}

@InputType()
export class GetMedicationByIdInput {
  @Field()
  @IsInt({ message: 'ID phải là số nguyên' })
  @Min(0, { message: 'ID phải lớn hơn 0 hoặc bằng 0' })
  id: number;
}

@InputType()
export class CreateMedicationInput {
  @Field()
    @IsString({ message: 'Mã viết tắt phải là chuỗi' })
    @MinLength(1, { message: 'Mã viết tắt không được để trống' })
    acronym: string;

    @Field()
    @IsString({ message: 'Tên phải là chuỗi' })
    @MinLength(1, { message: 'Tên không được để trống' })
    name: string;

    @Field(() => Float)
    @IsNumber({}, { message: 'Giá phải là số' })
    @Min(0, { message: 'Giá phải lớn hơn hoặc bằng 0' })
    price: number;

    @Field(() => Int) // Đổi sang Int vì số lượng thường là số nguyên
    @IsInt({ message: 'Số lượng phải là số nguyên' })
    @Min(0, { message: 'Số lượng phải lớn hơn hoặc bằng 0' })
    available_quantity: number;
}

@InputType()
export class UpdateMedicationInput {
  @Field({nullable: true})
  acronym?: string;

  @Field({nullable: true})
  name?: string;

  @Field(() => Float, {nullable: true})
  @IsInt({ message: 'Giá phải là số nguyên' })
  @Min(0, { message: 'Giá phải lớn hơn 0 hoặc bằng 0' })
  price?: number;

  @Field(() => Int, {nullable: true})
  available_quantity?: number;
}