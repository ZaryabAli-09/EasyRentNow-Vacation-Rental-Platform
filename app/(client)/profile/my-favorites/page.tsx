"use client";
import { ListingCard } from "@/app/custom components/ListingCard";
import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/lib/helperFunctions";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Home {
  _id: string;
  description: string;
  photo: string;
  country: string;
  price: number;
}

export default function MyFavorites() {
  const [homes, setHomes] = useState<Home[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = async (homeId: string) => {
    try {
      const res = await fetch("/api/home/favorites/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ homeId }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message);
      console.log(data);
      // Update favorites list
      if (data.data.added) {
        console.log("added");
        setFavorites((prev) => [...prev, homeId]);
      } else if (data.data.removed) {
        console.log("removed");

        setFavorites((prev) => prev.filter((id) => id !== homeId));
        // Remove from homes array to update UI immediately
        setHomes((prev) => prev.filter((home) => home._id !== homeId));
      }

      toast.success(data.message);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err));
    }
  };

  const loadFavorites = async () => {
    try {
      const [favoritesRes, homesRes] = await Promise.all([
        fetch("/api/home/favorites/get-ids"),
        fetch("/api/home/favorites/get"),
      ]);

      const [favoritesData, homesData] = await Promise.all([
        favoritesRes.json(),
        homesRes.json(),
      ]);

      if (!favoritesRes.ok) throw new Error(favoritesData.message);
      if (!homesRes.ok) throw new Error(homesData.message);

      setFavorites(favoritesData.data || []);
      setHomes(homesData.data || []);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };
  console.log("favourite homes :", homes);
  useEffect(() => {
    loadFavorites();
  }, []);

  return (
    <div className="container mx-auto px-5 lg:px-10">
      <h2 className="text-3xl font-semibold my-6">Your Favourites</h2>

      {loading && (
        <div className="flex justify-center mt-10">
          <div className="w-8 h-8 border-4 border-rose-600 border-dashed rounded-full animate-spin" />
        </div>
      )}

      {!loading && homes.length === 0 && (
        <p className="text-center mt-10 text-gray-500">
          No favorite homes yet. Start exploring and add some!
        </p>
      )}

      {!loading && homes.length > 0 && (
        <div className="grid lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8">
          {homes.map((home) => (
            <div key={home._id} className="relative">
              <Button
                onClick={() => toggleFavorite(home._id)}
                variant="outline"
                size="icon"
                className="absolute top-2 right-2 z-10"
                aria-label="Toggle favorite"
              >
                <Heart
                  className={
                    favorites.includes(home._id)
                      ? "text-red-500"
                      : "text-gray-400"
                  }
                  fill={favorites.includes(home._id) ? "currentColor" : "none"}
                />
              </Button>

              <ListingCard
                description={home.description}
                imagePath={home.photo}
                location={home.country}
                price={home.price}
                homeId={home._id}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
