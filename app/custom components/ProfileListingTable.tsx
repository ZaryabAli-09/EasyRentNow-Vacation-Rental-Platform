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

interface Home {
  _id: string;
  photo: string;
  country: string;
  price: number;
}

interface IListTable {
  myHomes: Home[];
  loading: boolean;
  handleDelete: (homeId: string, imagePath: string) => void;
}

export function ProfileListingTable({
  myHomes,
  loading,
  handleDelete,
}: IListTable) {
  const { getCountryByValue } = useCountries();

  return (
    <div className="container mx-auto px-5 lg:px-20 py-10">
      {loading && (
        <div className="flex justify-center mt-10">
          <div className="w-8 h-8 border-4 border-rose-600 border-dashed rounded-full animate-spin"></div>
        </div>
      )}
      {!loading && myHomes.length === 0 && (
        <p className="text-center mt-10">No homes found.</p>
      )}

      {!loading && myHomes.length > 0 && (
        <div className="overflow-x-auto">
          <Table className="min-w-full border border-gray-200 rounded-lg ">
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead>Image</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Price / Night</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myHomes.map((home: Home) => {
                const country = getCountryByValue(home.country);

                return (
                  <TableRow
                    key={home._id}
                    className="hover:bg-gray-50 transition-colors "
                  >
                    {/* Image */}
                    <TableCell className="w-28 h-20 relative">
                      <Image
                        src={home.photo}
                        alt="House Image"
                        fill
                        className="rounded-lg object-cover"
                      />
                    </TableCell>

                    {/* Location */}
                    <TableCell className="font-medium">
                      {country?.flag} {country?.label} / {country?.region}
                    </TableCell>

                    {/* Price */}
                    <TableCell className="font-semibold text-gray-900">
                      ${home.price}
                    </TableCell>

                    {/* Actions */}
                    <TableCell>
                      <div className="flex gap-2">
                        <Link href={`/home/${home._id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(home._id, home.photo)}
                        >
                          Delete
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
