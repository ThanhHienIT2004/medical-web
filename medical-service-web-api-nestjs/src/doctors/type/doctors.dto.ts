import { IsString, IsInt, Min, IsOptional, IsNotEmpty, IsNumber } from 'class-validator';
import { Field, InputType, Int, Float } from '@nestjs/graphql';


@InputType()
export class CreateDoctorDto {
  @Field(() => String)
  @IsString()
  id: string;

  @Field(() => String,{nullable: true})
  @IsString()
  @IsOptional()
  qualifications: string;

  @Field(() => String)
  @IsString()
  @IsOptional()
  specialty: string;

  @Field(() => Int)
  @IsInt()
  @Min(0)
  @IsOptional()
  work_seniority: number;

  @Field(() => String)
  @IsString()
  hospital: string;

  @Field(() => Float, { defaultValue: 0 })
  @IsNumber()
  @IsOptional()
  default_fee?: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  titles?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  positions?: string;

  @Field(() => Float, { defaultValue: 0 })
  @IsNumber()
  @IsOptional()
  rating?: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString({ message: 'gender phải là chuỗi' })
  @IsNotEmpty({ message: 'gender không được để trống' })
  gender: string;

}

@InputType()
export class RegisterDoctorInput {
  @Field() full_name: string;
  @Field() email: string;
  @Field() password: string;
  @Field() role: string;
  @Field() gender: string;
}

@InputType()
export class UpdateDoctorInput {
  @Field({ nullable: true }) full_name: string;
  @Field({ nullable: true }) email: string;
  @Field({ nullable: true }) gender: string;
  @Field({ nullable: true }) qualifications?: string;
  @Field({ nullable: true }) work_seniority?: number;
  @Field({ nullable: true }) specialty?: string;
  @Field({ nullable: true }) hospital?: string;
  @Field({ nullable: true }) default_fee?: number;
  @Field({ nullable: true }) titles?: string;
  @Field({ nullable: true }) positions?: string;
  @Field({ nullable: true }) rating?: number;
}
