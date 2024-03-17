import { NextResponse } from "next/server";
import { findAvailableTables } from "@/services/restaurant/findAvailableTables";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { searchParams } = new URL(request.url);
  const day = searchParams.get("day");
  const time = searchParams.get("time");
  const partySize = searchParams.get("partySize");

  if (!day || !time || !partySize || !params.slug) {
    return new Response(
      JSON.stringify({ errorMessage: "Invalid data provided." }),
      {
        status: 500,
      }
    );
  }

  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug: params.slug,
    },
    select: {
      tables: true,
      open_time: true,
      close_time: true,
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

  console.log({ restaurant: JSON.stringify(restaurant, null, 2) });

  const searchTimesWithTable = await findAvailableTables({
    slug: params.slug,
    time,
    day,
    restaurant,
  });

  if (searchTimesWithTable instanceof Response) {
    return searchTimesWithTable;
  }

  const availabilities = searchTimesWithTable
    .map((t) => {
      const sumSeats = t.tables.reduce((sum, tables) => sum + tables.seats, 0);
      return {
        time: t.time,
        available: sumSeats >= parseInt(partySize),
      };
    })
    .filter((availability) => {
      const timeIsAfterOpeningHour =
        new Date(`${day}T${availability.time}`) >=
        new Date(`${day}T${restaurant.open_time}`);
      const timeIsBeforeClosingHour =
        new Date(`${day}T${availability.time}`) <=
        new Date(`${day}T${restaurant.close_time}`);
      return timeIsAfterOpeningHour && timeIsBeforeClosingHour;
    });

  // return NextResponse.json({
  //   searchTimes: searchTimes.searchTimes,
  //   bookings,
  //   bookingTablesObj,
  //   tables,
  //   searchTimesWithTable,
  //   availabilities,
  //   restaurant,
  // });
  return NextResponse.json({ availabilities });
}

// http://localhost:8069/api/restaurant/vivaan-fine-indian-cuisine-ottawa/availability?day=2023-01-01&time=20:00:00.000Z&partySize=4
// http://localhost:8069/api/restaurant/vivaan-fine-indian-cuisine-ottawa/availability?day=2023-02-03&time=14:00:00.000Z&partySize=4
