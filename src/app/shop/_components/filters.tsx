"use client";
import React from "react";
import PriceRangeFilter from "./price-filter";

import { AttributeSelector } from "./attribute-selector";
import SubcategoryFilter from "./subcategory-filter";
import { SlidersHorizontal } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import RatingFilter from "./rating-filter";

export const Filters = () => {
  return (
    <div className=" w-56 space-y-6 pt-2 ">
      <SubcategoryFilter />
      <PriceRangeFilter />
      <AttributeSelector />
      <RatingFilter />
    </div>
  );
};

export const MobileFilters = () => (
  <div className="md:hidden">
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full">
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px]">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>Adjust your product filters</SheetDescription>
        </SheetHeader>

        <Filters />
      </SheetContent>
    </Sheet>
  </div>
);
