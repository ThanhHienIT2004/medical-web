"use client";

import useAuth from "@/features/auth/hooks/useAuth";
import { ReactNode } from "react";

const ProtectedLayout = ({ children }: { children: ReactNode }) => {
    const {session, status} = useAuth({ requiredRole: 'ADMIN' });

    if(status === "loading"){
        return <div></div>
    }
    if(!session) {
        return null;
    }

    return (
        <div className='bg-gray-100  items-center justify-center'>
            {children}
        </div>
    )
}

export default ProtectedLayout;