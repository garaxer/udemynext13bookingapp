import { headers } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET() {
  const headersList = headers();
  const bearerToken = headersList.get("authorization")?.split(" ")[1] as string;

  const decoded = jwt.decode(bearerToken) as {
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
