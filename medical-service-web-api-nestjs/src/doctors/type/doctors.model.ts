import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { GraphQLDate } from 'graphql-scalars';
import { User } from '../../user/types/user.type';

@ObjectType()
export class Doctor {
  @Field(() => String)
  id: string;

  @Field(() => String, { nullable: true })
  qualifications?: string | null;

  @Field(() => String, { nullable: true })
  specialty?: string | null;

  @Field(() => Int, { nullable: true })
  work_seniority: number | null;

  @Field(() => String, { nullable: true })
  hospital: string | null;

  @Field(() => Float, { defaultValue: 0 })
  default_fee: number | null;

  @Field(() => String, { nullable: true })
  titles?: string | null;

  @Field(() => String, { nullable: true })
  positions?: string | null;

  @Field(() => Float, { defaultValue: 0 })
  rating: number | null;

  @Field(() => String, { nullable: true })
  gender: string | null;

  @Field(() => GraphQLDate, {
    description: 'Creation date of the doctor record',
  })
  created_at: Date | null;

  @Field(() => GraphQLDate, {
    nullable: true,
    description: 'Last update date of the doctor record',
  })
  updated_at: Date | null;

  // 👇 Quan hệ đến bảng users
  @Field(() => User, { description: 'Related user information' })
  user: User;
}
