import { PrismaClient } from "@prisma/client";
import Header from "./components/Header";
import RestaurantCard, {
  RestaurantCardType,
} from "./components/RestaurantCard";
import SearchSideBar from "./components/SearchSideBar";

const prisma = new PrismaClient();

const findRestaurants = async (
  city?: string
): Promise<RestaurantCardType[] | null> => {
  const select = {
    id: true,
    name: true,
    main_image: true,
    description: true,
    price: true,
    cuisine: true,
    location: true,
    slug: true,
  };
  if (!city) {
    return prisma.restaurant.findMany({
      select,
    });
  }
  const restaurants = await prisma.restaurant.findMany({
    where: {
      location: {
        name: { equals: city.toLowerCase() },
      },
    },
    select,
  });

  return restaurants;
};

async function Search({ searchParams }: { searchParams: { city?: string } }) {
  const restaurants = await findRestaurants(searchParams.city);

  return (
    <>
      <Header />
      <div className="flex py-4 m-auto w-2/3 justify-between items-start">
        <SearchSideBar />
        <div className="w-5/6">
          {!restaurants || !restaurants.length ? (
            <p>No restaurants found, please search again!</p>
          ) : (
            restaurants.map((r) => {
              return <RestaurantCard restaurant={r} key={r.id} />;
            })
          )}
        </div>
      </div>
    </>
  );
}

export default Search;
