import { jwtDecode } from "jwt-decode";
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from 'next-auth/providers/credentials';
import type { LoginResponse, JwtPayload } from '@/types/auth';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api/v1';

const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                try {
                    const response = await fetch(`${API_BASE_URL}/auth/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: credentials.email,
                            password: credentials.password,
                        }),
                    });

                    if (!response.ok) {
                        console.error("Login failed:", response.status);
                        return null;
                    }

                    const json = await response.json() as { data?: LoginResponse } | LoginResponse;

                    const payload: LoginResponse | null =
                        'data' in json && json.data
                            ? json.data
                            : (json as LoginResponse | null);

                    if (payload?.accessToken) {
                        const decoded = jwtDecode<JwtPayload>(payload.accessToken);

                        return {
                            id: decoded.sub,
                            email: credentials.email,
                            accessToken: payload.accessToken,
                            role: decoded.role,
                        };
                    }
                    return null;
                } catch (error: unknown) {
                    const message = error instanceof Error ? error.message : 'Unknown login error';
                    console.error("Login error:", message);
                    return null;
                }
            }
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/login'
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.accessToken = user.accessToken;
                token.role = user.role;
            }
            return token;
        },

        async session({ session, token }) {
            session.user = {
                id: token.id,
                email: token.email,
                accessToken: token.accessToken,
                role: token.role,
            };
            return session;
        },
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
