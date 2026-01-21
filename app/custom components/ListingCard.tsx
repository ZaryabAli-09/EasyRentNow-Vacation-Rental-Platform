import Image from "next/image";
import Link from "next/link";
import { useCountries } from "@/lib/getCountries";

interface IListCard {
  description: string;
  imagePath: string;
  location: string;
  price: number;
  homeId: string;
}

export function ListingCard({
  description,
  imagePath,
  location,
  price,
  homeId,
}: IListCard) {
  const { getCountryByValue } = useCountries();
  const country = getCountryByValue(location);

  return (
    <Link href={`/home/${homeId}`} className="flex flex-col cursor-pointer">
      <div className="relative h-72">
        <Image
          src={imagePath}
          alt="Image of House"
          fill
          className="rounded-lg h-full object-cover"
        />
      </div>

      <div className="mt-2">
        <h3 className="font-medium text-base">
          {country?.flag} {country?.label} / {country?.region}
        </h3>
        <p className="text-muted-foreground text-sm line-clamp-2">
          {description}
        </p>
        <p className="pt-2 text-muted-foreground">
          <span className="font-medium text-black">${price}</span> Night
        </p>
      </div>
    </Link>
  );
}
