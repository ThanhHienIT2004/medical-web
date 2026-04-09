import { useState } from 'react';
import { Post, UpdateBlogPostInput } from "@/types/posts";
import { apiClient } from "@/libs/api/apiClient";

export function useUpdatePost() {
    const [data, setData] = useState<Post | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const update = async (input: { id: number; data: UpdateBlogPostInput }) => {
        try {
            setLoading(true);
            setError(null);
            const result = await apiClient<Post>(`/blog-posts/${input.id}`, {
                method: 'PATCH',
                body: input.data,
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
        update,
        data,
        loading,
        error,
    };
}
