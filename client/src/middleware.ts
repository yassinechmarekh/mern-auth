import { NextRequest, NextResponse } from "next/server";
import { AuthPages, Routes } from "./lib/constants";
import { isLoggedinAction } from "./actions/auth.action";

const protectedRoutes = [`/${Routes.DASHBOARD}`];
const authRoutes = [
  `/${Routes.AUTH}/${AuthPages.LOGIN}`,
  `/${Routes.AUTH}/${AuthPages.REGISTER}`,
  `/${Routes.AUTH}/${AuthPages.FORGOT_PASSWORD}`,
  `/${Routes.AUTH}/${AuthPages.RESET_PASSWORD}`,
  `/${Routes.AUTH}/${AuthPages.VERIFY_EMAIL}`,
];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isAuthRoute = authRoutes.includes(path);

  const isAuthenticated: boolean = await isLoggedinAction();

  // Redirect to /auth/login if the user is not authenticated
  if (!isAuthenticated && isProtectedRoute) {
    return NextResponse.redirect(
      new URL(`/${Routes.AUTH}/${AuthPages.LOGIN}`, req.nextUrl)
    );
  }

  // Redirect to / if the user is authenticated
  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL(`${Routes.ROOT}`, req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
