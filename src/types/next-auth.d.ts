import NextAuth from "next-auth"

declare module "next-auth" {

    interface User {
        token?: string;
        role?: string;
        name?: string;
        id?: string
    }


    interface Session {
        user: {
            role: string;
            token: string;
            id: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
        }
    }

}


declare module "next-auth/jwt" {
    interface JWT {
        role: string;
        token: string;
        id: string
    }
}