import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;
  const { searchParams } = new URL(request.url);
  const day = searchParams.get("day");
  const time = searchParams.get("time");
  const partySize = searchParams.get("partySize");

  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug,
    },
  });

  if (!restaurant) {
    return new Response(
      JSON.stringify({ errorMessage: "Invalid data provided" }),
      {
        status: 400,
      }
    );
  }

  if (
    new Date(`${day}T${time}`) < new Date(`${day}T${restaurant.open_time}`) ||
    new Date(`${day}T${time}`) > new Date(`${day}T${restaurant.close_time}`)
  ) {
    return new Response(JSON.stringify({ errorMessage: "Restaurant closed" }), {
      status: 400,
    });
  }
  return NextResponse.json({ day, time, partySize, params });
}

//http://localhost:8069/api/restaurant/vivaan-fine-indian-cuisine-ottawa/reserve?day=2023-02-03&time=16:00:00.000Z&partySize=4
