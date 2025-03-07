"use client";

import React, { useMemo } from "react";
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
import { useSearchParams } from "next/navigation";

interface FiltersProps {
  initialProducts: Product;
}

export const Filters = ({ initialProducts }: FiltersProps) => {
  const searchParams = useSearchParams();
  // Calculate minMaxPrices using useMemo
  const minMaxPrices = useMemo(() => {
    if (!Array.isArray(initialProducts) || initialProducts.length === 0) {
      return { minPrice: 0, maxPrice: 500 }; // Default values
    }

    let minPrice = Infinity;
    let maxPrice = -Infinity;

    for (const product of initialProducts) {
      if (product && product.price !== undefined) {
        const price = Number(product.price);
        if (!isNaN(price)) {
          minPrice = Math.min(minPrice, price);
          maxPrice = Math.max(maxPrice, price);
        }
      }
    }

    return {
      minPrice: minPrice === Infinity ? 0 : minPrice,
      maxPrice: maxPrice === -Infinity ? 500 : maxPrice, // Or a reasonable default
    };
  }, [searchParams.get("category"), searchParams.get("subcategory")]);

  // Calculate availableAttributes using useMemo
  const availableAttributes = useMemo(() => {
    if (!Array.isArray(initialProducts) || initialProducts.length === 0) {
      return {}; // Default empty object
    }

    const allAvailableAttributes: { [key: string]: string[] } = {};

    for (const product of initialProducts) {
      if (
        product &&
        product.attributes &&
        product.attributes.availableAttributes
      ) {
        Object.entries(product.attributes.availableAttributes).forEach(
          ([key, values]) => {
            if (!allAvailableAttributes[key]) {
              allAvailableAttributes[key] = [];
            }
            if (Array.isArray(values)) {
              values.forEach((value) => {
                if (!allAvailableAttributes[key].includes(value)) {
                  allAvailableAttributes[key].push(value);
                }
              });
            }
          }
        );
      }
    }

    return allAvailableAttributes;
  }, [searchParams.get("category"), searchParams.get("subcategory")]);

  return (
    <div className="w-56 space-y-6 pt-2 ">
      <SubcategoryFilter />
      <PriceRangeFilter minMaxPrices={minMaxPrices} />
      <AttributeSelector availableAttributes={availableAttributes} />
      <RatingFilter />
    </div>
  );
};

export const MobileFilters = ({
  initialProducts,
}: {
  initialProducts: Product;
}) => (
  <div className="lg:hidden">
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
        {/* Pass initialProducts here */}
        <Filters initialProducts={initialProducts} />
      </SheetContent>
    </Sheet>
  </div>
);
