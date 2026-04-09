import { useState } from 'react';
import { apiClient } from "@/libs/api/apiClient";

export function useDeletePost() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const remove = async (id: number) => {
        try {
            setLoading(true);
            setError(null);
            const result = await apiClient(`/blog-posts/${id}`, { method: 'DELETE' });
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
        delete: remove,
        data,
        loading,
        error,
    };
}
