"use client";

import { getErrorMessage } from "@/lib/helperFunctions";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MyReservationsTable } from "@/app/custom components/MyReservationTable";
interface ReservationWithHome {
  _id: string;
  startDate: string;
  endDate: string;
  homeId: {
    _id: string;
    title: string;
    photo: string;
    country: string;
    price: number;
  };
}

export default function MyReservations() {
  const { data: session } = useSession();
  const userId = session?.user?._id || "";
  const [reservations, setReservations] = useState<ReservationWithHome[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchReservations() {
    setLoading(true);
    try {
      const res = await fetch("/api/reservation/get-by-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();

      console.log(data);
      if (!res.ok) {
        toast.error(data.message);
        return;
      }

      setReservations(data.data || []);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (userId) fetchReservations();
  }, [userId]);

  return (
    <div>
      <div className="container mx-auto px-5 lg:px-20">
        <h2 className="text-3xl font-semibold my-6">My Reservations</h2>

        <MyReservationsTable
          reservations={reservations}
          loading={loading}
          userId={userId}
          fetchReservations={fetchReservations}
        />
      </div>
    </div>
  );
}
