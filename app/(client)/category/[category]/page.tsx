"use client";

import { use, useEffect, useState } from "react";
import { ListingCard } from "@/app/custom components/ListingCard";
import { MapFilterItems } from "@/app/custom components/MapFilterItems";
import { Navbar } from "@/app/custom components/Navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getErrorMessage } from "@/lib/helperFunctions";
import toast from "react-hot-toast";

interface CategoryPageProps {
  params: Promise<{ category: string }>; // mark as promise
}

interface Home {
  _id: string;
  description: string;
  photo: string;
  country: string;
  price: number;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { category } = use(params); // unwrap promise safely
  const [homes, setHomes] = useState<Home[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomes = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/home/filter-category", {
          method: "POST",
          body: JSON.stringify({ category }),
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        setHomes(data.data || []);
      } catch (err) {
        console.error(err);
        toast.error(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchHomes();
  }, [category]);

  return (
    <>
      <Navbar label={`Category: ${category}`} />

      <div className="container mx-auto px-5 lg:px-10 mt-5">
        <MapFilterItems />

        <div className="flex border-b items-center justify-between mt-5 mb-5">
          <h2 className="text-lg  font-light capitalize text-gray-600">
            Category search : {category}
          </h2>
          <Link href="/">
            <Button className="cursor-pointer mb-1" size="sm">
              Clear Filter
            </Button>
          </Link>
        </div>

        {loading && (
          <div className="flex justify-center mt-10">
            <div className="w-8 h-8 border-4 border-rose-600 border-dashed rounded-full animate-spin"></div>
          </div>
        )}

        {!loading && homes.length === 0 && (
          <p className="text-center mt-10">No homes found.</p>
        )}

        {!loading && homes.length > 0 && (
          <div className="grid lg:grid-cols-4 sm:grid-cols-2 gap-8">
            {homes.map((home) => (
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
