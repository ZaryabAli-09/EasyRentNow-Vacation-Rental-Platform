"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { SelectCategory } from "@/app/custom components/SelectedCategory";
import { Counter } from "@/app/custom components/Counter";
import { useCountries } from "@/lib/getCountries";
import { Card, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { ArrowBigLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getErrorMessage } from "@/lib/helperFunctions";
export default function FullHomeCreationPage() {
  const { data: session } = useSession();
  const userid = session?.user?._id;
  const [step, setStep] = useState(1);

  const router = useRouter();
  // FORM STATES
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const [guest, setGuest] = useState(1);
  const [room, setRoom] = useState(1);
  const [bathroom, setBathroom] = useState(1);
  const [countryValue, setCountryValue] = useState("");

  const [loading, setLoading] = useState(false);
  const { getAllCountries } = useCountries();

  const LazyMap = dynamic(() => import("@/app/custom components/Map"), {
    ssr: false,
    loading: () => <Skeleton className="h-[50vh] w-full" />,
  });

  const handleSubmit = async () => {
    const formData = new FormData();

    formData.append("category", category);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);

    if (image) formData.append("image", image);

    formData.append("guest", guest.toString());
    formData.append("room", room.toString());
    formData.append("bathroom", bathroom.toString());
    formData.append("countryValue", countryValue);

    try {
      setLoading(true);
      const response = await fetch(`/api/home/create/${userid}`, {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (response.ok) {
        toast.success(result.message);
        setLoading(false);
        router.push("/");
      }
      if (!response.ok) {
        toast.error(result.message);
        setLoading(false);
      }
    } catch (err: unknown) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="p-2 fixed">
        <Button>
          <Link href={"/"}>
            <ArrowBigLeft />
          </Link>
        </Button>
      </div>
      <div className="w-full max-w-3xl mx-auto px-4 py-5 space-y-16">
        {step === 1 && (
          <section>
            <h2 className="text-3xl text-gray-600 font-serif tracking-tight transition-colors">
              Which of these best describe your Home?
            </h2>

            <SelectCategory
              value={category}
              onSelect={(value: string) => setCategory(value)}
            />

            <div className="flex justify-end mt-10">
              <Button
                className="cursor-pointer"
                disabled={!category}
                onClick={() => setStep(2)}
              >
                Next
              </Button>
            </div>
          </section>
        )}

        {/* STEP 2 — DESCRIPTION */}
        {step === 2 && (
          <section>
            <h2 className="text-2xl text-gray-600 md:text-3xl font-serif">
              Please describe your home!
            </h2>

            <div className="mt-10 flex flex-col gap-y-5">
              <div>
                <Label>Title</Label>
                <Input
                  type="text"
                  placeholder="Short and simple..."
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  placeholder="Please describe your home..."
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div>
                <Label>Price</Label>
                <Input
                  type="number"
                  placeholder="Price per Night in USD"
                  min={10}
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              <div>
                <Label>Image</Label>
                <Input
                  type="file"
                  required
                  onChange={(e) => setImage(e.target.files?.[0] || null)}
                />
              </div>

              {/* COUNTERS */}
              <Card>
                <CardHeader className="flex flex-col gap-y-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="underline font-medium">Guests</h3>
                      <p className="text-muted-foreground text-sm">
                        How many guests?
                      </p>
                    </div>
                    <Counter name="guest" value={guest} onChange={setGuest} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="underline font-medium">Rooms</h3>
                      <p className="text-muted-foreground text-sm">
                        How many rooms?
                      </p>
                    </div>
                    <Counter name="room" value={room} onChange={setRoom} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="underline font-medium">Bathrooms</h3>
                      <p className="text-muted-foreground text-sm">
                        How many bathrooms?
                      </p>
                    </div>
                    <Counter
                      name="bathroom"
                      value={bathroom}
                      onChange={setBathroom}
                    />
                  </div>
                </CardHeader>
              </Card>
            </div>

            <div className="flex justify-between mt-10">
              <Button
                variant={"outline"}
                className="cursor-pointer"
                onClick={() => setStep(1)}
              >
                Back{" "}
              </Button>
              <Button className="cursor-pointer" onClick={() => setStep(3)}>
                Next
              </Button>
            </div>
          </section>
        )}

        {step === 3 && (
          <section>
            <h2 className="text-2xl md:text-3xl font-serif text-gray-600 mb-10">
              Where is your Home located?
            </h2>

            <Select onValueChange={(value) => setCountryValue(value)} required>
              <SelectTrigger>
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

            <div className="mt-5">
              <LazyMap locationValue={countryValue} />
            </div>

            {/* FINAL BUTTONS */}
            <div className="flex justify-between mt-10">
              <Button
                variant={"outline"}
                className="cursor-pointer"
                onClick={() => setStep(2)}
              >
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? "Listing..." : " List Home"}
              </Button>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
