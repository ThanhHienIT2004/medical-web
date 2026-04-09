import { useSession } from "next-auth/react"
import { useEffect } from "react";
import { useRouter } from "next/navigation";

type UseAuthOptions = {
    requiredRole?: string;
    redirectTo?: string;
    unauthorizedTo?: string;
};

const useAuth = (options: UseAuthOptions = {}) => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const {
        requiredRole,
        redirectTo = '/login',
        unauthorizedTo = '/403',
    } = options;

    useEffect(() => {
        if (status === "loading") return;

        if (!session) {
            router.push(redirectTo);
            return;
        }

        if (requiredRole && session.user?.role !== requiredRole) {
            router.push(unauthorizedTo);
        }
    },[status, session, router, requiredRole, redirectTo, unauthorizedTo])

    return { session, status }
}

export default useAuth;