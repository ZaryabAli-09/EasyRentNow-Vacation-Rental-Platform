import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { dbConnect } from "./db";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import { getErrorMessage } from "./helperFunctions";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "email@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      async authorize(credentials: any): Promise<any> {
        try {
          await dbConnect();

          const user = await User.findOne({ email: credentials.email });

          if (!user) {
            throw new Error("No user found with this email");
          }

          if (!user.isVerified) {
            throw new Error("Please verify your account first");
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password,
          );

          if (!isPasswordValid) {
            throw new Error("Invalid credentials");
          }

          return {
            _id: user._id.toString(),
            email: user.email,
            role: user.role,
            name: user.username,
          };
        } catch (err: unknown) {
          throw new Error(getErrorMessage(err));
        }
      },
    }),
  ],

  callbacks: {
    async redirect({ baseUrl }) {
      return `${baseUrl}`;
    },

    async jwt({ token, user }) {
      // On sign in
      if (user) {
        token._id = user._id;
        token.role = user.role;
        token.email = user.email;
        token.name = user.name;
      }
      // Token is always returned, even if user is not present
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user._id = token._id;
        session.user.role = token.role;
      }
      return session;
    },
  },

  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
