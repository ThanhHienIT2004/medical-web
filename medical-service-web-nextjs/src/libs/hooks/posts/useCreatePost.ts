import { useState } from 'react';
import { CreateBlogPostInput, Post } from "@/types/posts";
import { apiClient } from "@/libs/api/apiClient";

export function useCreatePost() {
    const [data, setData] = useState<Post | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const create = async (input: CreateBlogPostInput) => {
        try {
            setLoading(true);
            setError(null);
            const result = await apiClient<Post>('/blog-posts', {
                method: 'POST',
                body: input,
            });
            setData(result);
            return result;
        } catch (e: any) {
            setError(e);
            throw e;
        } finally {
            setLoading(false);
        }
    };

    return {
        create,
        data,
        loading,
        error,
    };
}
