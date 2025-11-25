"use client";
import { ProfileListingTable } from "@/app/custom components/ProfileListingTable";
import { getErrorMessage } from "@/lib/helperFunctions";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Home {
  _id: string;
  description: string;
  photo: string;
  country: string;
  price: number;
}

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
    } catch (err: unknown) {
      toast.error(getErrorMessage(err));
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    if (userId) fetchMyHomesListings();
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
      setMyHomes((prev) => prev.filter((home: Home) => home._id !== homeId));
    } catch (err: unknown) {
      toast.error(getErrorMessage(err));
    }
  }

  return (
    <>
      <div className="container mx-auto px-5 lg:px-20">
        <h2 className="text-3xl font-semibold my-6">My Listings</h2>

        <ProfileListingTable
          myHomes={myHomes}
          handleDelete={handleDelete}
          loading={loading}
        />
      </div>
    </>
  );
}
