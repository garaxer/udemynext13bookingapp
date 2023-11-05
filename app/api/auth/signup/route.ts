import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import validator from "validator";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
export async function GET(request: Request) {
  return NextResponse.json({ hello: "There" }, { status: 200 });
}

export async function POST(request: Request) {
  const { firstName, lastName, email, phone, city, password } =
    await request.json();

  const errros: string[] = [];

  const validationSchema = [
    {
      valid: validator.isLength(firstName, {
        min: 1,
        max: 25,
      }),
      errorMessage: "Not long enough",
    },
    {
      valid: validator.isLength(lastName, {
        min: 1,
        max: 25,
      }),
      errorMessage: "Not long enough",
    },
    {
      valid: validator.isLength(city, {
        min: 1,
      }),
      errorMessage: "City is invalid",
    },
    {
      valid: validator.isEmail(email),
      errorMessage: "Not valid email",
    },
    {
      valid: validator.isMobilePhone(phone),
      errorMessage: "Not phone",
    },
    {
      valid: validator.isStrongPassword(password),
      errorMessage: "Not a strong password",
    },
  ];

  validationSchema.forEach((check) => {
    if (!check.valid) {
      errros.push(check.errorMessage);
    }
  });
  if (errros.length) {
    return NextResponse.json({ errorMessage: errros[0] });
  }

  const userWithEmail = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  const hashedPassword = await bcrypt.hash(password, 10);

  if (userWithEmail) {
    return NextResponse.json({
      errorMessage: "Email already exists on another account",
    });
  }
  const user = await prisma.user.create({
    data: {
      first_name: firstName,
      last_name: lastName,
      email,
      password: hashedPassword,
      phone,
      city,
    },
  });
  return NextResponse.json(user);
}
