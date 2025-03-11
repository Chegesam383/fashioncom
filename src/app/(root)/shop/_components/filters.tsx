"use client";

import React from "react";
import PriceRangeFilter from "./price-filter";
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
import { Product } from "@/lib/types";
import { AttributeSelector } from "./attribute-selector";

interface FiltersProps {
  initialProducts: Product[]; // Corrected type to array of Product
  filtersData: {
    availableAttributes: { [key: string]: string[] };
    minMaxPrices: { minPrice: number; maxPrice: number };
  };
}

export const Filters = ({ filtersData }: FiltersProps) => {
  const { availableAttributes, minMaxPrices } = filtersData;

  return (
    <div className=" w-52 lg:w-56 space-y-6 pt-2 ">
      <SubcategoryFilter />
      <PriceRangeFilter minMaxPrices={minMaxPrices} />
      <AttributeSelector availableAttributes={availableAttributes} />
      <RatingFilter />
    </div>
  );
};

interface MobileFiltersProps {
  initialProducts: Product[]; // Corrected type to array of Product
  filtersData: {
    availableAttributes: { [key: string]: string[] };
    minMaxPrices: { minPrice: number; maxPrice: number };
  };
}

export const MobileFilters = ({
  initialProducts,
  filtersData,
}: MobileFiltersProps) => (
  <div className="">
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full">
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[400px] max-h-screen overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>Adjust your product filters</SheetDescription>
        </SheetHeader>
        <div>
          <Filters
            initialProducts={initialProducts}
            filtersData={filtersData}
          />
          {/* <ScrollBar orientation="vertical" /> */}
        </div>
      </SheetContent>
    </Sheet>
  </div>
);
