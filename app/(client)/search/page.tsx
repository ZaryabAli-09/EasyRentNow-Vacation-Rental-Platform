"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ListingCard } from "@/app/custom components/ListingCard";
import { Navbar } from "@/app/custom components/Navbar";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [homes, setHomes] = useState([]);
  const [loading, setLoading] = useState(true);

  const filters = {
    country: searchParams.get("country"),
    guest: searchParams.get("guest"),
    room: searchParams.get("room"),
    bathroom: searchParams.get("bathroom"),
  };

  async function fetchSearchHomes() {
    try {
      const res = await fetch("/api/home/search", {
        method: "POST",
        body: JSON.stringify(filters),
      });

      const data = await res.json();
      setHomes(data.data || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSearchHomes();
  }, []);

  return (
    <>
      <Navbar label={`Search: ${filters.country || "Results"}`} />

      <div className="container mx-auto px-5 lg:px-10 mt-5">
        <h2 className="text-lg font-semibold mb-5">Search Results</h2>

        {loading && <p>Loading...</p>}
        {!loading && homes.length === 0 && <p>No homes found.</p>}

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
      </div>
    </>
  );
}
