"use client";

import { category } from "@/lib/fakedata";
import Link from "next/link";
import {
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";

import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import useScroll from "@/lib/hooks/usescroll";
import CategoriesDropDown from "./categories-dropdown";

export default function CategoryNav() {
  const { scrollDirection, scrollY } = useScroll();
  return (
    (scrollDirection == "up" || scrollY == 0) && (
      <nav className={`mt-4 pt-1 bg-slate-800`}>
        <div className={`flex  lg:container  mx-auto rounded-lg`}>
          <div className="flex items-center">
            <ScrollArea className="w-[100vw] whitespace-nowrap mb-2 z-0">
              <div className="flex items-center">
                <CategoriesDropDown />
                {["Best Sellers", "Top rated", "Your history", "On offer"].map(
                  (item, index) => (
                    <Link
                      className="flex rounded-lg text-white text-center opacity-75 px-4 text-sm text-nowrap hover:opacity-100"
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
