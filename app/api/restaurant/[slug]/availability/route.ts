import { NextResponse } from "next/server";
import { times } from "../../../../../data";
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

  const searchTimes = times.find((t) => {
    return t.time === time;
  });

  if (!searchTimes) {
    return new Response(
      JSON.stringify({ errorMessage: "Invalid time provided" }),
      {
        status: 400,
      }
    );
  }

  const bookings = await prisma.booking.findMany({
    where: {
      booking_time: {
        gte: new Date(`${day}T${searchTimes.searchTimes[0] || time}`),
        lte: new Date(`${day}T${searchTimes.searchTimes.at(-1) || time}`),
      },
    },
    select: {
      number_of_people: true,
      booking_time: true,
      tables: true,
    },
  });

  const bookingTablesObj: { [key: string]: { [key: number]: true } } = {};

  bookings.forEach((booking) => {
    bookingTablesObj[booking.booking_time.toISOString()] =
      booking.tables.reduce(
        (a, c) => ({
          ...a,
          [c.table_id]: true,
        }),
        {}
      );
  });

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

  const tables = restaurant.tables;

  const searchTimesWithTable = searchTimes.searchTimes.map((searchTime) => ({
    date: new Date(`${day}T${searchTime}`),
    time: searchTime,
    tables,
  }));

  searchTimesWithTable.forEach((t) => {
    t.tables = t.tables.filter((table) => {
      return bookingTablesObj?.[t.date.toISOString()]?.[table.id]
        ? false
        : true;
    });
  });

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
