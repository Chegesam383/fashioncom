"use client";

import React from "react";
import { categories, category } from "@/lib/fakedata";
import Link from "next/link";
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
import { Button } from "@/components/ui/button";
import { LayoutGrid } from "lucide-react";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import useScroll from "@/lib/usescroll";

export default function CategoryNav() {
  const { scrollDirection, scrollY } = useScroll();
  return (
    (scrollDirection == "up" || scrollY == 0) && (
      <div className={`p-4 lg:container mx-auto  transition-all duration-300`}>
        <div className="flex items-center">
          <ScrollArea className="w-full whitespace-nowrap mb-2 z-0">
            <div className="flex items-center">
              <CategoriesDropDown categories={categories} />
              {[...categories, ...categories]
                .slice(0, 12)
                .map((item, index) => (
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
      </div>
    )
  );
}

const RenderMenuItems = ({ items }: { items: category[] }) => {
  return items.map((item: category, index: number) =>
    item.subcategories ? (
      <DropdownMenuSub key={index}>
        <DropdownMenuSubTrigger className="hover:bg-gray-200">
          {item.name}
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent>
            <RenderMenuItems items={item.subcategories} />
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
    ) : (
      <DropdownMenuItem key={index} className="hover:bg-gray-200">
        {item.name}
      </DropdownMenuItem>
    )
  );
};

export function CategoriesDropDown({ categories }: { categories: category[] }) {
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
          <RenderMenuItems items={categories} />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
