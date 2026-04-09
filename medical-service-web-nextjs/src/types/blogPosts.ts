export type BlogPost = {
  id: string;
  title: string;
  content: string;
  author_id: string;
  category: string;
  created_at: string | Date;
  updated_at?: string | Date | null;
  publish_at?: string | Date | null;
  author?: {
    user?: {
      full_name?: string;
      email?: string;
      avatar?: string;
    };
  } | null;
};

export type PaginatedBlogPosts = {
  items: BlogPost[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type CreateBlogPostInput = {
  title: string;
  content: string;
  category: string;
  author_id: string;
};

export type UpdateBlogPostInput = Partial<Omit<CreateBlogPostInput, "author_id">> & {
  updated_at?: string;
};

