"use client";

import { CaegoryShowcase } from "@/app/custom components/CategoryShowcase";
import { HomeMap } from "@/app/custom components/HomeMap";
import { SelectCalendar } from "@/app/custom components/SelectCalendar";
import { Button } from "@/components/ui/button";
import { useCountries } from "@/lib/getCountries";
import { getDisabledDates, getErrorMessage } from "@/lib/helperFunctions";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
interface IReservation {
  userId: string;
  homeId: string;
  startDate: Date;
  endDate: Date;
}

export default function HomePage() {
  const { id: homeId } = useParams();
  const [home, setHome] = useState<any>(null);
  const [country, setCountry] = useState<any>(null);
  const [reservationDates, setReservationDates] = useState<{
    startDate: Date;
    endDate: Date;
  } | null>(null);
  const [reservedDates, setReservedDates] = useState<
    { startDate: string; endDate: string }[]
  >([]);
  const router = useRouter();
  const { getCountryByValue } = useCountries();

  const { data: session } = useSession();
  const user = session?.user;
  const disabledDates = getDisabledDates(reservedDates);

  console.log(disabledDates);
  // Fetch home details
  async function getHome() {
    try {
      const res = await fetch(`/api/home/single/${homeId}`);
      const json = await res.json();

      if (!res.ok) throw new Error(json.message);

      setHome(json.data[0]);

      if (json.data[0]?.country) {
        const locationData = getCountryByValue(json.data[0].country);
        setCountry(locationData);
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }
  async function createReservation({
    userId,
    homeId,
    startDate,
    endDate,
  }: IReservation) {
    try {
      const data = {
        userId,
        homeId,
        startDate,
        endDate,
      };
      const res = await fetch("/api/reservation/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message);
      }
      toast.success(result.message);
      router.push("/");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  async function fetchReservations() {
    try {
      const res = await fetch("/api/reservation/get-by-home", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ homeId }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }
      if (res.ok) setReservedDates(data.data);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  useEffect(() => {
    if (homeId) getHome();
    if (homeId) fetchReservations();
  }, [homeId]);

  if (!home) {
    return (
      <div className="flex justify-center mt-10">
        <div className="w-8 h-8 border-4 border-rose-600 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-[75%] mx-auto mt-10 mb-12">
      <h1 className="font-medium text-2xl mb-5">{home?.title}</h1>

      {/* Main Home Image */}
      <div className="relative h-[550px]">
        <Image
          alt="Image of Home"
          src={home?.photo}
          fill
          className="rounded-lg h-full object-cover w-full"
        />
      </div>

      <div className="flex justify-between gap-x-24 mt-8">
        {/* LEFT SIDE INFO */}
        <div className="w-2/3">
          <h3 className="text-xl font-medium">
            {country?.flag} {country?.label} / {country?.region}
          </h3>

          <div className="flex gap-x-2 text-muted-foreground">
            <p>{home?.guests} Guests</p> •<p>{home?.bedrooms} Bedrooms</p> •
            <p>{home?.bathrooms} Bathrooms</p>
          </div>

          {/* Host Info */}
          <div className="flex items-center mt-6">
            <img
              src={
                "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
              }
              alt="User Profile"
              className="w-11 h-11 rounded-full"
            />

            <div className="flex flex-col ml-4">
              <h3 className="font-medium">
                Hosted by {user?.name ?? "Unknown Host"}
              </h3>
              <p className="text-xs text-muted-foreground">
                Posted on{" "}
                {home?.createdAt
                  ? new Date(home.createdAt).toLocaleDateString()
                  : ""}
              </p>
            </div>
          </div>
          <hr className="my-7" />
          <CaegoryShowcase categoryName={home?.categoryName as string} />
          <hr className="my-7" />

          <p className="text-muted-foreground">{home?.description}</p>

          <hr className="my-7" />

          {/* Map */}
          {country?.value && <HomeMap locationValue={country.value} />}
        </div>
        <div>
          <SelectCalendar
            disabledDates={disabledDates}
            onDateChange={(startDate, endDate) =>
              setReservationDates({ startDate, endDate })
            }
          />

          {user?._id ? (
            <Button
              className="w-full hover:cursor-pointer"
              onClick={() => {
                if (
                  !user?._id ||
                  !home?._id ||
                  !reservationDates?.startDate ||
                  !reservationDates?.endDate
                ) {
                  toast.error("Missing required data");
                  return;
                }

                createReservation({
                  userId: user._id,
                  homeId: home._id,
                  startDate: reservationDates.startDate,
                  endDate: reservationDates.endDate,
                });
              }}
            >
              Make a Reservation
            </Button>
          ) : (
            <Button className="w-full" asChild>
              <Link href="/login">Make a Reservation</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
