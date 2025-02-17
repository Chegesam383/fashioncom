"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LayoutGrid } from "lucide-react";
import { categories } from "@/lib/fakedata";
import Link from "next/link";

export default function CategoryNav() {
  return (
    <div className="container gap-4 flex mx-auto px-4 py-2">
      <nav className="flex items-center gap-4 text-sm xl:gap-6">
        {categories.slice(0, 6).map((item, index) => (
          <Link
            key={index}
            className="transition-colors hover:text-foreground/80 text-foreground/80"
            href="/docs"
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export function CategoriesDropDown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          Categories
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
          {categories.map((item, index) => {
            return item.subcategories ? (
              <DropdownMenuSub key={index}>
                <DropdownMenuSubTrigger>{item.name}</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    {item.subcategories?.map((sub, index) => (
                      <DropdownMenuItem key={index}>
                        {sub.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            ) : (
              <DropdownMenuItem key={index}>
                <span>{item.name}</span>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
