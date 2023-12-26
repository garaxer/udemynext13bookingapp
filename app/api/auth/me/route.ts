import { headers } from "next/headers";
import { NextResponse } from "next/server";
import * as jose from "jose";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET() {
  const headersList = headers();
  const bearerToken = headersList.get("authorization");

  if (!bearerToken) {
    return NextResponse.json({
      errorMessage: "No bearer",
    });
  }

  const token = bearerToken.split(" ")[1];

  if (!token) {
    return NextResponse.json({
      errorMessage: "No token",
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

  const decoded = jwt.decode(token) as {
    email: string;
    exp: number;
  };

  const data = await prisma.user.findUnique({
    where: {
      email: decoded.email,
    },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      city: true,
      email: true,
      phone: true,
    },
  });

  if (!data) {
    return NextResponse.json(
      {
        errorMessage: "Unauthorized request (user not found)",
      },
      { status: 500 }
    );
  }

  return NextResponse.json(data, { status: 200 });
}
