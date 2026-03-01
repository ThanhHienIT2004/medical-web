import { jwtDecode } from "jwt-decode";
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from 'next-auth/providers/credentials';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api/v1';

const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
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

                    const data = await response.json();

                    if (data?.accessToken) {
                        const decoded: any = jwtDecode(data.accessToken);

                        return {
                            id: decoded.sub,
                            email: credentials.email,
                            accessToken: data.accessToken,
                            role: decoded.role,
                        };
                    }
                    return null;
                } catch (error: any) {
                    console.error("Login error:", error?.message);
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
