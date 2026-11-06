import apiServices from "@/services/apiServices";
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
// import GoogleProvider from "next-auth/providers/google"


const handler = NextAuth({

    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. 'Sign in with...')
            name: 'credentials',
            // The credentials is used to generate a suitable form on the sign in page.
            // You can specify whatever fields you are expecting to be submitted.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                email: { label: "Email", type: "email", placeholder: "your-email@example.com" },
                password: { label: "Password", type: "password", placeholder: "******" }
            },
            async authorize(credentials) {

                const response = await apiServices.signin(credentials?.email ?? "", credentials?.password ?? "")
                if (response.message == "success") {
                    return { ...response.user, token: response.token, id: response.user?.email }
                    /** user
                     * name
                     * email
                     * token
                     * role
                     * id
                     */
                } else {
                    return null;
                }

            }
        }),
        // GoogleProvider({
        //     clientId: "",
        //     clientSecret: ""
        // })
    ],
    pages: {
        signIn: '/auth/signin'
    },
    callbacks: {
        async jwt({ token, user }) {

            if (user) {
                token.role = user.role ?? "";
                token.token = user.token ?? "";
                token.id = user.id ?? "";
            }

            return token
        },
        async session({ session, token }) {
            session.user.role = token.role;
            session.user.token = token.token;
            session.user.id = token.id;

            return session;
        }
    },
    secret: process.env.AUTH_SECRET,
    session: {
        strategy: "jwt"
    }
})

export { handler as GET, handler as POST }
