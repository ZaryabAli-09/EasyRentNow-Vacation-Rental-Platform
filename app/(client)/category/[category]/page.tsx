import { ListingCard } from "@/app/custom components/ListingCard";
import { MapFilterItems } from "@/app/custom components/MapFilterItems";
import { Navbar } from "@/app/custom components/Navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface CategoryPageProps {
  params: { category: string };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = params;

  // Fetch homes for this category
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/home/filter-category`,
    {
      method: "POST",
      body: JSON.stringify({ category }),
      headers: { "Content-Type": "application/json" },
    }
  );

  const data = await res.json();
  const homes = data.data || [];

  return (
    <>
      <Navbar label={`Category: ${category}`} />

      <div className="container mx-auto px-5 lg:px-10 mt-5">
        <MapFilterItems />

        <div className="flex items-center justify-between mt-5 mb-5">
          <h2 className="text-lg font-semibold capitalize">
            Category: {category}
          </h2>
          {/* Clear Filter Button */}
          <Link href="/">
            <Button className="cursor-pointer" size="sm">
              Clear Filter
            </Button>
          </Link>
        </div>

        {homes.length === 0 ? (
          <p>No homes found.</p>
        ) : (
          <div className="grid lg:grid-cols-4 sm:grid-cols-2 gap-8">
            {homes.map((home: any) => (
              <ListingCard
                key={home._id}
                description={home.description}
                imagePath={home.photo}
                location={home.country}
                price={home.price}
                homeId={home._id}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
