import { times } from "@/data/times";
import { PrismaClient, Table } from "@prisma/client";

const prisma = new PrismaClient();

export const findAvailableTables = async ({
  time,
  slug,
  day,
  restaurant,
}: {
  time: string;
  slug: string;
  day: string;
  restaurant: {
    tables: Table[];
    open_time: string;
    close_time: string;
  };
}) => {
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

  return searchTimesWithTable;
};
