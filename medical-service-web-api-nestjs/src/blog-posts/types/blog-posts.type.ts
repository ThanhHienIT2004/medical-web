// types/blog-posts.type.ts
import { Field, ID, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Doctor } from '../../doctors/type/doctors.model';

@ObjectType()
export class BlogPost{
  @Field(() => ID)
  id: number;

  @Field()
  title: string;

  @Field()
  content: string;

  @Field()
  author_id: string;

  @Field()
  category: string;

  @Field()
  created_at: Date;

  @Field(() => Date, { nullable: true })
  updated_at?: Date | null;

  @Field(() => Date, { nullable: true })
  publish_at?: Date | null;

  @Field(() => Doctor, { nullable: true })
  author: Doctor | null;

}

@InputType()
export class PaginationBlogInput {
  @Field(() => Int)
  page: number;

  @Field(() => Int)
  pageSize: number;
}

@ObjectType()
export class PaginatedBlogPosts {
  @Field(() => [BlogPost])
  items: BlogPost[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  pageSize: number;

  @Field(() => Int)
  totalPages: number;
}



@InputType()
export class CreateBlogPostInput {
  @Field()
  title: string;

  @Field()
  content: string;

  @Field()
  category: string;

  @Field()
  author_id: string;
}

@InputType()
export class UpdateBlogPostInput {

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  content?: string;

  @Field()
  category: string;

  @Field({nullable: true})
  updated_at?: Date;
}

@InputType()
export class GetBlogPostByIdInput {
  @Field(() => ID)
  id: number;
}
