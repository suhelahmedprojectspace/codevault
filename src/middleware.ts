// middleware.ts
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const PROTECTED_ROUTES = [
  "/dashboard",
  "/settings",
  "/profile",
  "/recommedation",
];
const AUTH_ROUTES = ["/login", "/register"];
const PUBLIC_ROUTES = ["/"];

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const { pathname } = req.nextUrl;

  console.log("Token in middleware:", token);
  console.log("Current path:", pathname);

  if (token && AUTH_ROUTES.includes(pathname)) {
    console.log("User is logged in, redirecting to dashboard...");
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("from", req.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  // if (token && PUBLIC_ROUTES.includes(pathname)) {
  //   return NextResponse.redirect(new URL("/dashboard", req.url));
  // }
  return NextResponse.next();
}
