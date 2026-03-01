import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsInt, Min } from 'class-validator';

@ObjectType()
export class PaginatedResponse<T> {
  @Field(() => [Int])
  items!: T[];

  @Field(() => Int)
  total!: number;

  @Field(() => Int)
  page!: number;

  @Field(() => Int)
  pageSize!: number;

  @Field(() => Int)
  totalPages!: number;
}