import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    role: string;
    email: string;
    username?: string;
    image?: string | null;
  }

  interface Session {
    user: {
      id: string;
      name?: string;
      role: string;
      image?: string;
      email: string;
      username?: string;
    };
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    username?: string;
    accessToken?: string;
    refreshToken?: string;
  }
}
