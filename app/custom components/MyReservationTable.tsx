"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import Link from "next/link";
import { useCountries } from "@/lib/getCountries";
import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/lib/helperFunctions";
import toast from "react-hot-toast";

interface Reservation {
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

interface MyReservationsTableProps {
  reservations: Reservation[];
  loading: boolean;
  userId: string;
  fetchReservations: () => void; // callback to refresh after delete
}

export function MyReservationsTable({
  reservations,
  loading,
  userId,
  fetchReservations,
}: MyReservationsTableProps) {
  const { getCountryByValue } = useCountries();

  async function handleDelete(reservationId: string) {
    const confirm = window.confirm(
      "Are you sure you want to cancel this reservation?"
    );
    if (!confirm) return;

    try {
      const res = await fetch("/api/reservation/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reservationId, userId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success(data.message);
      fetchReservations();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  return (
    <div className="container mx-auto px-5 lg:px-20 py-10">
      {loading && (
        <div className="flex justify-center mt-10">
          <div className="w-8 h-8 border-4 border-rose-600 border-dashed rounded-full animate-spin"></div>
        </div>
      )}
      {!loading && reservations.length === 0 && (
        <p className="text-center mt-10">No reservations found.</p>
      )}

      {!loading && reservations.length > 0 && (
        <div className="overflow-x-auto">
          <Table className="min-w-full border border-gray-200 rounded-lg">
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead>Home</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Price / Night</TableHead>
                <TableHead>Reserved Dates</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {reservations.map((resv) => {
                const country = getCountryByValue(resv.homeId.country);

                return (
                  <TableRow
                    key={resv._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="w-28 h-20 relative">
                      <Image
                        src={resv.homeId.photo}
                        alt={resv.homeId.title}
                        fill
                        className="rounded-lg object-cover"
                      />
                    </TableCell>

                    <TableCell className="font-medium">
                      {country?.flag} {country?.label} / {country?.region}
                    </TableCell>

                    <TableCell className="font-semibold text-gray-900">
                      ${resv.homeId.price}
                    </TableCell>

                    <TableCell className="text-sm">
                      {new Date(resv.startDate).toLocaleDateString()} -{" "}
                      {new Date(resv.endDate).toLocaleDateString()}
                    </TableCell>

                    <TableCell>
                      <div className="flex gap-2">
                        <Link href={`/home/${resv.homeId._id}`}>
                          <Button variant="outline" size="sm">
                            View Home
                          </Button>
                        </Link>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(resv._id)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
