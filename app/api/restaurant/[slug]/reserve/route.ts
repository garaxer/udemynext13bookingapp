import { findAvailableTables } from "@/services/restaurant/findAvailableTables";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;
  const { searchParams } = new URL(request.url);
  const day = searchParams.get("day");
  const time = searchParams.get("time");
  const partySize = searchParams.get("partySize");

  const body = await request.json();
  const {
    bookerEmail,
    bookerPhone,
    bookerFirstName,
    bookerLastName,
    bookerOccasion,
    bookerRequest,
  } = body;

  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug,
    },
    select: {
      tables: true,
      open_time: true,
      id: true,
      close_time: true,
    },
  });

  if (!restaurant || !day || !time || !partySize) {
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

  const searchTimesWithTables = await findAvailableTables({
    slug: params.slug,
    time,
    day,
    restaurant,
  });

  if (searchTimesWithTables instanceof Response) {
    return searchTimesWithTables;
  }

  const searchTimeWithTables = searchTimesWithTables.find((t) => {
    return t.date.toISOString() === new Date(`${day}T${time}`).toISOString();
  });

  if (!searchTimeWithTables) {
    return new Response(
      JSON.stringify({ errorMessage: "Cannot book, no availability" }),
      {
        status: 400,
      }
    );
  }

  const tablesCount: { 2: number[]; 4: number[] } = {
    2: [],
    4: [],
  };

  searchTimeWithTables.tables.forEach((table) => {
    if (table.seats === 2) {
      tablesCount[2].push(table.id);
    } else {
      tablesCount[4].push(table.id);
    }
  });

  const tablesToBooks: number[] = [];
  let seatsRemaining = parseInt(partySize);

  while (seatsRemaining > 0) {
    if (seatsRemaining >= 3) {
      if (tablesCount[4].length) {
        tablesToBooks.push(tablesCount[4][0]);
        tablesCount[4].shift();
        seatsRemaining = seatsRemaining - 4;
      } else {
        tablesToBooks.push(tablesCount[2][0]);
        tablesCount[2].shift();
        seatsRemaining = seatsRemaining - 2;
      }
    } else {
      if (tablesCount[2].length) {
        tablesToBooks.push(tablesCount[2][0]);
        tablesCount[2].shift();
        seatsRemaining = seatsRemaining - 2;
      } else {
        tablesToBooks.push(tablesCount[4][0]);
        tablesCount[4].shift();
        seatsRemaining = seatsRemaining - 4;
      }
    }
  }

  const booking = await prisma.booking.create({
    data: {
      number_of_people: parseInt(partySize),
      booking_time: new Date(`${day}T${time}`),
      booker_email: bookerEmail,
      booker_phone: bookerPhone,
      booker_first_name: bookerFirstName,
      booker_last_name: bookerLastName,
      restaurant_id: restaurant.id,
      booker_occasion: bookerOccasion,
      booker_request: bookerRequest,
    },
  });

  const bookingsOnTablesData = tablesToBooks.map((table_id) => {
    return {
      table_id,
      booking_id: booking.id,
    };
  });
  await prisma.bookingsOnTables.createMany({
    data: bookingsOnTablesData,
  });

  return NextResponse.json(booking);
}

//http://localhost:8069/api/restaurant/vivaan-fine-indian-cuisine-ottawa/reserve?day=2023-02-03&time=16:00:00.000Z&partySize=4
// {
//   "bookerEmail": "gbagna@gmail.com",
//   "bookerPhone": "2323333",
//   "bookerFirstName": "g",
//   "bookerLastName": "g",
//   "bookerOccasion": "g",
//   "bookerRequest": "g"
// }
