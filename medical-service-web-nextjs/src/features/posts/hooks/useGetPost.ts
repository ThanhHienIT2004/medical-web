import { useState, useEffect, useCallback } from 'react';
import { PaginationBlogInput, Post } from "@/types/posts";
import { apiClient } from "@/libs/api/apiClient";

interface PaginatedPosts {
    items: Post[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export function useGetAllPost(input: PaginationBlogInput) {
    const [data, setData] = useState<PaginatedPosts | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchPosts = useCallback(async () => {
        try {
            setLoading(true);
            const result = await apiClient<PaginatedPosts>(
                `/blog-posts?page=${input.page}&pageSize=${input.pageSize}`
            );
            setData(result);
        } catch (e: any) {
            setError(e);
        } finally {
            setLoading(false);
        }
    }, [input.page, input.pageSize]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    return {
        posts: data?.items ?? [],
        total: data?.total ?? 0,
        page: data?.page ?? input.page,
        pageSize: data?.pageSize ?? input.pageSize,
        totalPages: data?.totalPages ?? 0,
        loading,
        error,
        refetch: fetchPosts,
    };
}
