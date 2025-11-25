"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ListingCard } from "@/app/custom components/ListingCard";
import { Navbar } from "@/app/custom components/Navbar";
import { NoItems } from "./NoItem";

interface Home {
  _id: string;
  description: string;
  photo: string;
  country: string;
  price: number;
}

export default function SearchHomes() {
  const searchParams = useSearchParams();
  const [homes, setHomes] = useState<Home[]>([]);
  const [loading, setLoading] = useState(true);

  const filters = {
    country: searchParams.get("country") || "",
    guest: searchParams.get("guest") || "",
    room: searchParams.get("room") || "",
    bathroom: searchParams.get("bathroom") || "",
  };

  useEffect(() => {
    async function fetchSearchHomes() {
      setLoading(true);
      try {
        const res = await fetch("/api/home/search", {
          method: "POST",
          body: JSON.stringify(filters),
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();
        setHomes(data.data || []);
      } catch (err) {
        console.error("Error fetching homes:", err);
        setHomes([]);
      } finally {
        setLoading(false);
      }
    }

    fetchSearchHomes();
  }, [filters.country, filters.guest, filters.room, filters.bathroom]);

  return (
    <>
      <Navbar />

      <div className="container mx-auto px-5 lg:px-10 mt-5">
        <h2 className="text-3xl font-semibold my-6">Search Results</h2>

        {loading && <p>Loading...</p>}
        {!loading && homes.length === 0 && (
          <NoItems
            description="Please search other category or create your own listing!"
            title="Sorry no listing found"
          />
        )}

        <div className="grid lg:grid-cols-4 sm:grid-cols-2 gap-8">
          {homes.map((home: Home) => (
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
      </div>
    </>
  );
}
