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
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import useScroll from "@/lib/usescroll";

export default function CategoryNav() {
  const { scrollDirection, scrollY } = useScroll();
  return (
    (scrollDirection == "up" || scrollY == 0) && (
      <nav className={`mt-4 pt-1 bg-slate-800`}>
        <div className={`flex px-4 lg:container  mx-auto rounded-lg`}>
          <div className="flex items-center">
            <ScrollArea className="w-[100vw] whitespace-nowrap mb-2 z-0">
              <div className="flex items-center">
                <CategoriesDropDown categories={categories} />
                {["Best Sellers", "Top rated", "Your history", "On offer"].map(
                  (item, index) => (
                    <Link
                      className="flex rounded-lg text-white text-center p-4 text-sm text-nowrap hover:bg-muted"
                      href={`/shop?category=${item}`}
                      key={index}
                    >
                      {item}
                    </Link>
                  )
                )}
              </div>

              <ScrollBar orientation="horizontal" className="sr-only" />
            </ScrollArea>
          </div>
        </div>
      </nav>
    )
  );
}

const RenderMenuItems = ({ items }: { items: category[] }) => {
  return items.map((item: category, index: number) =>
    item.subcategories ? (
      <DropdownMenuSub key={index}>
        <DropdownMenuSubTrigger className="hover:bg-muted">
          {item.name}
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent>
            <RenderMenuItems items={item.subcategories} />
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
    ) : (
      <DropdownMenuItem key={index} className="hover:bg-muted">
        {item.name}
      </DropdownMenuItem>
    )
  );
};

export function CategoriesDropDown({ categories }: { categories: category[] }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="bg-slate-900 text-white">
          All categories
          <LayoutGrid
            className="-me-1 ms-2 opacity-60 "
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
