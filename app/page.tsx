"use client";
import { Navbar } from "./custom components/Navbar";
import { ListingCard } from "./custom components/ListingCard";
import { useEffect, useState } from "react";
import { MapFilterItems } from "./custom components/MapFilterItems";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/lib/helperFunctions";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

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
  const [favorites, setFavorites] = useState<string[]>([]);
  async function handleFavoriteButton(homeId: string) {
    try {
      const res = await fetch("/api/home/favorites/toggle", {
        method: "POST",
        body: JSON.stringify({ homeId }),
      });

      const data = await res.json();

      // Update favorites state
      if (data.added) {
        setFavorites((prev) => [...prev, homeId]);
      } else if (data.removed) {
        setFavorites((prev) => prev.filter((id) => id !== homeId.toString()));
      }
      fetchFavorites();

      toast.success(data.message);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err));
    }
  }
  async function fetchFavorites() {
    try {
      const res = await fetch("/api/home/favorites/get-ids");
      const data = await res.json();

      console.log(data);
      if (!res.ok) {
        throw new Error(data.message);
      }
      console.log(data);
      setFavorites(data.data || []); // fallback to empty array
    } catch (err: unknown) {
      toast.error(getErrorMessage(err));
    }
  }

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
    } catch (err: unknown) {
      toast.error(getErrorMessage(err));
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getHomesListing();
    fetchFavorites();
  }, []);

  // console.log(favorites);
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
          {homes.map((home) => {
            const isFav = favorites.includes(home._id);
            return (
              <div key={home._id} className="relative ">
                <Button
                  onClick={() => handleFavoriteButton(home._id)}
                  variant={"outline"}
                  className="absolute top-2 right-2 z-10 hover:cursor-pointer"
                >
                  <Heart
                    className={
                      favorites.includes(home._id)
                        ? "text-red-500"
                        : "text-gray-400"
                    }
                    fill={
                      favorites.includes(home._id) ? "currentColor" : "none"
                    }
                  />
                </Button>
                <ListingCard
                  key={home._id}
                  description={home.description}
                  imagePath={home.photo}
                  location={home.country}
                  price={home.price}
                  homeId={home._id}
                />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
