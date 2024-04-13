import Header from "./components/Header";
import Form from "./components/Form";
import { Metadata } from "next";
import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Reserve",
  description: "Reserve a trailer",
};

const prisma = new PrismaClient();

const fetchRestaurantBySlug = async (slug: string) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug,
    },
  });

  if (!restaurant) {
    notFound();
  }

  return restaurant;
};

async function Reserve({
  params: { slug },
  searchParams: { date, partySize },
}: {
  params: { slug: string };
  searchParams: { date: string; partySize: string;  };
}) {
  const restaurant = await fetchRestaurantBySlug(slug);
  return (
    <div className="border-t h-screen">
      <div className="py-9 w-3/5 m-auto">
        <Header
          image={restaurant.main_image}
          name={restaurant.name}
          date={date}
          partySize={partySize}
        />
        <Form
          slug={slug}
          date={date}
          partySize={partySize}
        />
      </div>
    </div>
  );
}

export default Reserve;
