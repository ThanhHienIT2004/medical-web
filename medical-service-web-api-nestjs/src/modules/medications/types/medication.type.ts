import { Field, Float, InputType, Int, ID, ObjectType } from '@nestjs/graphql';
import { GraphQLDate } from 'graphql-scalars';
import { IsInt, IsNumber, IsString, Min, MinLength } from 'class-validator';

@ObjectType()
export class Medication {
  @Field(() => ID)
  id: string;

  @Field()
  acronym: string;

  @Field()
  name: string;

  @Field(() => Float)
  price: number;

  @Field(() => Int)
  available_quantity: number;

  @Field(() => GraphQLDate)
  created_at: Date;

  @Field(() => GraphQLDate)
  updated_at: Date;
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
  id: string;
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

@ObjectType()
export class PaginatedMedications {
  @Field(() => [Medication])
  items: Medication[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  pageSize: number;

  @Field(() => Int)
  totalPages: number;
}