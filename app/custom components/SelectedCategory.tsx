"use client";

import { Card, CardHeader } from "@/components/ui/card";
import { categoryItems } from "@/lib/categoryItems";
import Image from "next/image";

interface SelectCategoryProps {
  value: string;
  onSelect: (value: string) => void;
}

export function SelectCategory({ value, onSelect }: SelectCategoryProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-10 mx-auto mb-10">
      {categoryItems.map((item) => (
        <div key={item.id} className="cursor-pointer">
          <Card
            onClick={() => onSelect(item.name)}
            className={`
              transition-all duration-200
              ${
                value === item.name
                  ? "border-2 border-black shadow-md"
                  : "border"
              }
            `}
          >
            <CardHeader className="flex flex-col items-center gap-3 p-2">
              <Image
                src={item.imageUrl}
                alt={item.name}
                height={32}
                width={32}
                className="w-8 h-8"
              />
              <h3 className="font-medium text-center">{item.title}</h3>
            </CardHeader>
          </Card>
        </div>
      ))}
    </div>
  );
}
