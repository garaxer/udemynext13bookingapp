import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import validator from "validator";
import * as jose from "jose";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const errors: string[] = [];
  const { email, password } = await request.json();

  const validationSchema = [
    {
      valid: validator.isEmail(email),
      errorMessage: "Email is invalid",
    },
    {
      valid: validator.isLength(password, { min: 1 }),
      errorMessage: "Password is invalid",
    },
  ];

  validationSchema.forEach((check) => {
    if (!check.valid) {
      errors.push(check.errorMessage);
    }
  });

  if (errors.length) {
    return NextResponse.json({
      errorMessage: errors[0],
    });
  }

  const userWithEmail = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!userWithEmail) {
    return NextResponse.json({
      errorMessage: "Email or password is invalid",
    });
  }

  const isMatch = await bcrypt.compare(password, userWithEmail.password);

  if (!isMatch) {
    return NextResponse.json({
      errorMessage: "Email or password is invalid.",
    });
  }

  const alg = "HS256";
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const token = await new jose.SignJWT({ email: userWithEmail.email })
    .setProtectedHeader({ alg })
    .setExpirationTime("24h")
    .sign(secret);

  return NextResponse.json({ user: userWithEmail, token });
}
