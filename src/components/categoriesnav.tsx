"use client";

import React from "react";
import { categories } from "@/lib/fakedata";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LayoutGrid } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import useScroll from "@/lib/usescroll";

export default function CategoryNav() {
  const { scrollDirection } = useScroll();
  return (
    <div
      className={`${
        scrollDirection == "up" ? "block" : "hidden"
      }container mx-auto px-4 py-21 transition-all duration-300`}
    >
      {/* Large Screen Navigation */}
      <ScrollArea className="w-full whitespace-nowrap mb-2">
        <div className="flex items-center">
          <CategoriesDropDown />
          {categories.map((item, index) => (
            <div key={index} className="basis-1/7">
              <Link
                className=" rounded-lg text-center mx-2 text-sm text-nowrap"
                href={`/shop?category=${item.name}`}
              >
                {item.name}
              </Link>
            </div>
          ))}
        </div>

        <ScrollBar orientation="horizontal" className="invisible h-0 w-0" />
      </ScrollArea>
    </div>
  );
}

export function CategoriesDropDown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          All categories
          <LayoutGrid
            className="-me-1 ms-2 opacity-60"
            size={16}
            strokeWidth={2}
            aria-hidden="true"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-52">
        <DropdownMenuGroup>
          {categories.map((item, index) =>
            item.subcategories ? (
              <DropdownMenuSub key={index}>
                <DropdownMenuSubTrigger>{item.name}</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    {item.subcategories.map((sub, idx) => (
                      <DropdownMenuItem key={idx}>{sub.name}</DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            ) : (
              <DropdownMenuItem key={index}>{item.name}</DropdownMenuItem>
            )
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
