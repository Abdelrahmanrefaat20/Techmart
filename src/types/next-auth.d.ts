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
            id: string
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