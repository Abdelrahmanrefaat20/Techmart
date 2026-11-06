import apiServices from "@/services/apiServices";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "mail@example.com",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "**********",
        },
      },
      async authorize(credentials) {
        const response = await apiServices.signin(
          credentials?.email ?? "",
          credentials?.password ?? "",
        );

         if (response.message == "success" && response.user?.email && response.token) {
    return {
      ...response.user,
      token: response.token,
      id: response.user.email,
    };
  } else {
    return null;
  }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
});

export { handler as GET, handler as POST };
