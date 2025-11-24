"use client";
import { ProfileListingTable } from "@/app/custom components/ProfileListingTable";
import { divIcon } from "leaflet";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function MyListings() {
  const { data: session } = useSession();
  const userId = session?.user?._id;
  const [myHomes, setMyHomes] = useState([]);
  const [loading, setLoading] = useState(false);
  const label = "My Listings";
  async function fetchMyHomesListings() {
    setLoading(true);
    try {
      const res = await fetch(`/api/home/get/${userId}`);
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
        setLoading(false);
        return;
      }
      console.log(data);
      setMyHomes(data.data);
    } catch (error: any) {
      toast.error(error.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    if (userId) fetchMyHomesListings();
    {
    }
  }, [userId]);
  async function handleDelete(homeId: string, photoUrl: string) {
    if (!userId) return toast.error("You are not authorized.");

    const confirm = window.confirm(
      "Are you sure you want to delete this listing?"
    );
    if (!confirm) return;

    try {
      const res = await fetch("/api/home/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ homeId, userId, photoUrl }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to delete listing.");
        return;
      }

      toast.success("Listing deleted successfully!");
      setMyHomes((prev) => prev.filter((home: any) => home._id !== homeId));
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  return (
    <>
      {label && (
        <div className="text-center py-2 text-sm font-medium bg-gray-100">
          {label}
        </div>
      )}
      <div className="container mx-auto px-5 lg:px-20">
        <ProfileListingTable
          myHomes={myHomes}
          handleDelete={handleDelete}
          loading={loading}
        />
      </div>
    </>
  );
}
