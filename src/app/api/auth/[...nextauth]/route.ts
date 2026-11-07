import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";
import apiServices from "@/services/apiServices";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
