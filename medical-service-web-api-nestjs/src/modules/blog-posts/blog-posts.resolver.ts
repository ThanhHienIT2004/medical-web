// blog-posts.resolver.ts
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import {
  BlogPost,
  CreateBlogPostInput,
  UpdateBlogPostInput,
  GetBlogPostByIdInput,
  PaginatedBlogPosts, PaginationBlogInput,
} from './types/blog-posts.type';
import { BlogPostsService } from './blog-posts.service';

@Resolver(() => BlogPost)
export class BlogPostsResolver {
  constructor(private readonly blogPostsService: BlogPostsService) {}

  @Mutation(() => BlogPost)
  createBlogPost(@Args('input') input: CreateBlogPostInput) {
    return this.blogPostsService.create(input);
  }

  @Query(() => PaginatedBlogPosts)
  posts(@Args('input') input: PaginationBlogInput) {
    return this.blogPostsService.findAll(input.page, input.pageSize);
  }

  @Query(() => BlogPost)
  findOneBlogPost(@Args('id',{ type: () => String }) id: string) {
    return this.blogPostsService.findOne(id);
  }

  @Mutation(() => BlogPost)
  updateBlogPost(
    @Args('id', { type: () => String }) id: string,
    @Args('input') input: UpdateBlogPostInput
  ) {
    return this.blogPostsService.update(id, input);
  }


  @Mutation(() => Boolean)
  deleteBlogPost(@Args('id', { type: () => String }) id: string) {
    return this.blogPostsService.remove(id);
  }

}