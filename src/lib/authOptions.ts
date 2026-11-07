import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import apiServices from "@/services/apiServices";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "your-email@example.com",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "******",
        },
      },
      async authorize(credentials) {
        const response = await apiServices.signin(
          credentials?.email ?? "",
          credentials?.password ?? "",
        );

        if (response.message === "success") {
          return {
            ...response.user,
            token: response.token,
            id: response.user?.email,
          };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role ?? "";
        token.token = user.token ?? "";
        token.id = user.id ?? "";
      }

      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      session.user.token = token.token;
      session.user.id = token.id;

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
};
