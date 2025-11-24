"use client";
import { Navbar } from "./custom components/Navbar";
import { ListingCard } from "./custom components/ListingCard";
import { useEffect, useState } from "react";
import { MapFilterItems } from "./custom components/MapFilterItems";
import toast from "react-hot-toast";

interface Home {
  _id: string;
  description: string;
  photo: string;
  country: string;
  price: number;
}

export default function App() {
  const [homes, setHomes] = useState<Home[]>([]);
  const [loading, setLoading] = useState(true);

  async function getHomesListing() {
    try {
      setLoading(true);
      const res = await fetch("/api/home/all");
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message);
        return;
      }

      setHomes(data.data || []);
    } catch (error: any) {
      toast.error(error.message);
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    getHomesListing();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-5 lg:px-10">
        <MapFilterItems />
        {loading && (
          <div className="flex justify-center mt-10">
            <div className="w-8 h-8 border-4 border-rose-600 border-dashed rounded-full animate-spin"></div>
          </div>
        )}
        {!loading && homes.length === 0 && (
          <p className="text-center mt-10">No homes found.</p>
        )}

        <div className="grid lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8">
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
      </div>
    </>
  );
}
