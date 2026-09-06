import { NextRequest, NextResponse } from "next/server";

const AUTH_ROUTES = ["/login", "/register"];
const PUBLIC_ROUTES = ["/"];
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if(!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined in the env")
}

// Simple Edge-compatible JWT decoder
function parseJwt(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

async function refreshTokenMiddleware(refreshToken: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.data; // our backend returns { data: { accessToken, refreshToken } }
  } catch (error) {
    console.error("Error refreshing token in proxy:", error);
    return null;
  }
}

export async function proxy(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;
    const pathWithQuery = `${pathname}${request.nextUrl.search}`;

    let accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;

    let isValidAccessToken = false;
    let isExpiringSoon = false;

    if (accessToken) {
      const decoded = parseJwt(accessToken);
      if (decoded && decoded.exp) {
        const currentTime = Math.floor(Date.now() / 1000);
        isValidAccessToken = decoded.exp > currentTime;
        // If it expires in less than 5 minutes (300 seconds), it's expiring soon
        isExpiringSoon = decoded.exp - currentTime < 300;
      }
    }

    const isAuth = AUTH_ROUTES.includes(pathname);
    const isPublic =
      PUBLIC_ROUTES.includes(pathname) ||
      pathname.startsWith("/about") ||
      pathname.startsWith("/pricing") ||
      pathname.startsWith("/blog");

    let response = NextResponse.next();

    // PROACTIVE REFRESH: If token is valid but expiring soon, refresh it in the middleware!
    if (
      (isValidAccessToken && isExpiringSoon && refreshToken) ||
      (!isValidAccessToken && refreshToken)
    ) {
      const refreshedTokens = await refreshTokenMiddleware(refreshToken);

      if (refreshedTokens && refreshedTokens.accessToken) {
        // Create a new response to attach the cookies to
        response = NextResponse.next();

        // Update the cookies on the user's browser
        response.cookies.set("accessToken", refreshedTokens.accessToken, {
          path: "/",
          maxAge: 900,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
        });
        if (refreshedTokens.refreshToken) {
          response.cookies.set("refreshToken", refreshedTokens.refreshToken, {
            path: "/",
            maxAge: 604800,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
          });
        }

        // Update the request headers so Server Components down the line see the new token!
        request.headers.set(
          "Authorization",
          `Bearer ${refreshedTokens.accessToken}`,
        );

        // Mark as valid since we just refreshed it
        isValidAccessToken = true;
        accessToken = refreshedTokens.accessToken;
      }
    }

    // Rule 1: Logged-in users should not access auth pages
    if (isAuth && isValidAccessToken) {
      // Redirect to the dashboard since they are already logged in
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Rule 2: Unauthenticated users trying to access protected route -> redirect to login
    // If it's not an auth route AND not a public route, it must be a protected dashboard route
    if (!isAuth && !isPublic && !isValidAccessToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathWithQuery);
      return NextResponse.redirect(loginUrl);
    }

    // Pass along the modified response (which might contain new freshly baked cookies!)
    return response;
  } catch (error) {
    console.error("Error in proxy middleware:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)",
  ],
};
