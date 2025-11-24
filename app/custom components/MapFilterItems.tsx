"use client";

import { categoryItems } from "@/lib/categoryItems";
import Image from "next/image";
import Link from "next/link";

export function MapFilterItems() {
  return (
    <div className="flex gap-x-10 mt-5 w-full overflow-x-scroll no-scrollbar">
      {categoryItems.map((item) => (
        <Link
          key={item.id}
          href={`/category/${item.name}`}
          className="flex flex-col gap-y-3 items-center opacity-85 hover:opacity-100"
        >
          <Image src={item.imageUrl} width={24} height={24} alt={item.title} />
          <p className="text-xs font-medium">{item.title}</p>
        </Link>
      ))}
    </div>
  );
}
