import RestaurantNavBar from "../components/RestaurantNavBar";
import Menu from "../components/Menu";
import { Item, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const fetchMenuItems = async (slug: string): Promise<Item[]> => {
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug,
    },
    select: {
      items: true,
    },
  });

  if (!restaurant) {
    throw new Error("no menu items for this restaurant.");
  }

  return restaurant.items;
};

async function RestaurantMenu({ params }: { params: { slug: string } }) {
  console.log(params.slug);
  const menu = await fetchMenuItems(params.slug);
  console.log(menu);
  return (
    <div className="bg-white w-[100%] rounded p-3 shadow">
      <RestaurantNavBar slug={params.slug} />
      <Menu menu={menu} />
    </div>
  );
}

export default RestaurantMenu;
