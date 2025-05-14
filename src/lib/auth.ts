import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "./prisma";
import bcrypt from "bcryptjs";
import GoogleProvider from "next-auth/providers/google";
import crypto from "crypto";
import { sendPasswordResetEmail } from "./mail/sendPasswordResetEmail";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@gmail.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) {
          throw new Error("UserNotFound");
        }
        if (!user.email) throw new Error("Email missing");
        if (!user.password) {
          // await sendPasswordResetEmail(user.email);
          throw new Error("INCORRECT_PASSWORD");
        }
        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password,
        );
        if (!passwordMatch) {
          throw new Error("INCORRECT_PASSWORD");
        }
        return {
          id: user.id,
          name: user.username,
          email: user.email,
          role: user.role,
          image: user.image || null,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
    signOut: "/",
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      console.log("JWT CALLBACK- BEFORE", token);
      if (account?.provider === "google") {
        let existingUser = await prisma.user.findUnique({
          where: { email: profile?.email || "" },
        });
        if (!existingUser) {
          existingUser = await prisma.user.create({
            data: {
              email: profile?.email || "",
              username: profile?.name || "Google User",
              role: "USER",
            },
          });
        }
        token.sub = existingUser.id;
        token.role = existingUser.role;
      }
      if (user) {
        token.sub = user.id;
        token.role = user.role;
      }
      console.log("JWT CALLBACK - AFTER", token);
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role || "USER";
      } else {
        console.log("No user in session");
      }

      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url === "/login" || url === "/") {
        return `${baseUrl}/dashboard`;
      }

      if (url.startsWith(baseUrl)) return url;
      if (url.startsWith("/")) return `${baseUrl}${url}`;

      return baseUrl;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 2 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
};
