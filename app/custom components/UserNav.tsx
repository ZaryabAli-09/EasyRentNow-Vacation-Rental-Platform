"use client";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";

import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";
import toast from "react-hot-toast";
import { divIcon } from "leaflet";
export function UserNav() {
  const { data: session } = useSession();
  const user = session?.user;
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    const toastId = toast.loading("Signing out...");

    try {
      await signOut();
      toast.success("Signed out successfully!", { id: toastId });
    } catch (error) {
      toast.error("Failed to sign out", { id: toastId });
    } finally {
      setIsLoggingOut(false);
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="rounded-full border px-2 py-2 lg:px-4 lg:py-2 flex items-center gap-x-3">
          <MenuIcon className="w-6 h-6 lg:w-5 lg:h-5" />
          {!user ? (
            <img
              src={
                "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
              }
              alt="Image of the user"
              className="rounded-full h-8 w-8 hidden lg:block"
            />
          ) : (
            <div className="bg-rose-600 p-2 w-8 h-8 font bold text-white  flex items-center justify-center rounded-full">
              Z
            </div>
          )}
        </div>
      </DropdownMenuTrigger>
      {!user ? (
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuItem>
            <Link href="/sign-in" className="w-full">
              Sign In
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      ) : (
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuItem>
            <Link href="/home/create" className="w-full">
              Airbnb your Home
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/profile/my-listings" className="w-full">
              My Listings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/favorites" className="w-full">
              My Favorites
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/reservations" className="w-full">
              My Reservations
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <div onClick={handleLogout} className={"w-full"}>
              Sign out
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
}
