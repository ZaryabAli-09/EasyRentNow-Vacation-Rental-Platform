"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Search } from "lucide-react";
import { useState } from "react";
import { useCountries } from "@/lib/getCountries";
import { HomeMap } from "./HomeMap";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Counter } from "./Counter";
import { useRouter } from "next/navigation";

export function SearchModalCompnent() {
  const [step, setStep] = useState(1);
  const [locationValue, setLocationValue] = useState("");
  const [guest, setGuest] = useState(1);
  const [room, setRoom] = useState(1);
  const [bathroom, setBathroom] = useState(1);

  const { getAllCountries } = useCountries();
  const router = useRouter();

  function submitSearch() {
    const query = new URLSearchParams({
      country: locationValue,
      guest: guest.toString(),
      room: room.toString(),
      bathroom: bathroom.toString(),
    }).toString();

    router.push(`/search?${query}`);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="rounded-full py-2 px-5 border flex items-center cursor-pointer">
          <div className="sm:flex h-full divide-x font-medium hidden sm:visible">
            <p className="px-4">Anywhere</p>
            <p className="px-4">Any Week</p>
            <p className="px-4">Add Guests</p>
          </div>
          <Search className="bg-primary text-white p-1 h-8 w-8 rounded-full" />
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <form className="gap-4 flex flex-col">
          {step === 1 ? (
            <>
              <DialogHeader>
                <DialogTitle>Select a Country</DialogTitle>
                <DialogDescription>
                  Select where you want to stay
                </DialogDescription>
              </DialogHeader>

              <Select
                required
                onValueChange={(value) => setLocationValue(value)}
                value={locationValue}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a Country" />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Countries</SelectLabel>
                    {getAllCountries().map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.flag} {item.label} / {item.region}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <HomeMap locationValue={locationValue} />

              <DialogFooter>
                <Button type="button" onClick={() => setStep(2)}>
                  Next
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Enter Additional Details</DialogTitle>
              </DialogHeader>

              <Card>
                <CardHeader className="flex flex-col gap-y-6">
                  {/* Guests */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <h3 className="font-medium underline">Guests</h3>
                      <p className="text-sm text-muted-foreground">
                        How many guests?
                      </p>
                    </div>
                    <Counter name="Guests" value={guest} onChange={setGuest} />
                  </div>

                  {/* Rooms */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <h3 className="font-medium underline">Rooms</h3>
                      <p className="text-sm text-muted-foreground">
                        How many rooms?
                      </p>
                    </div>
                    <Counter name="Rooms" value={room} onChange={setRoom} />
                  </div>

                  {/* Bathrooms */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <h3 className="font-medium underline">Bathrooms</h3>
                      <p className="text-sm text-muted-foreground">
                        How many bathrooms?
                      </p>
                    </div>
                    <Counter
                      name="Bathrooms"
                      value={bathroom}
                      onChange={setBathroom}
                    />
                  </div>
                </CardHeader>
              </Card>

              <DialogFooter>
                <Button type="button" onClick={submitSearch}>
                  Search
                </Button>
              </DialogFooter>
            </>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
