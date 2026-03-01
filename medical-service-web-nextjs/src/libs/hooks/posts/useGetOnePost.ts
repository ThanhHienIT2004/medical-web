import { useState, useCallback } from 'react';
import { Post } from "@/types/posts";
import { apiClient } from "@/libs/api/apiClient";

export const useGetOnePost = () => {
    const [data, setData] = useState<Post | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const getPostById = useCallback(async (id: number) => {
        try {
            setLoading(true);
            setError(null);
            const result = await apiClient<Post>(`/blog-posts/${id}`);
            setData(result);
            return result;
        } catch (e: any) {
            setError(e);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        getPostById,
        data,
        loading,
        error,
    };
};
