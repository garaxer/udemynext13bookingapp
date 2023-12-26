import { headers } from "next/headers";
import { NextResponse } from "next/server";
import * as jose from "jose";

// This function can be marked `async` if using `await` inside
export async function middleware(request: Request) {
  console.log("middleware called");
  const bearerToken = request.headers.get("authorization");

  if (!bearerToken) {
    return NextResponse.json({
      errorMessage: "Unauthorized request No bearer",
    });
  }

  const token = bearerToken.split(" ")[1];

  if (!token) {
    return NextResponse.json({
      errorMessage: "Unauthorized request No token",
    });
  }

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  try {
    await jose.jwtVerify(token, secret);
  } catch (error) {
    return NextResponse.json(
      {
        errorMessage: "Unauthorized request (Token invalid)",
      },
      { status: 500 }
    );
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/api/auth/me"],
};
