"use client";

import React from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { useQueryState, parseAsInteger } from "nuqs";
//import { Skeleton } from "@/components/ui/skeleton";
import { useProductFiltersData } from "../useProductFilterData";

function PriceRangeFilter() {
  const { minMaxPrices } = useProductFiltersData();

  const [minprice, setMinprice] = useQueryState(
    "minprice",
    parseAsInteger
      .withDefault(Math.floor(minMaxPrices.minPrice) || 0)
      .withOptions({ shallow: false, throttleMs: 100, history: "push" })
  );

  const [maxprice, setMaxprice] = useQueryState(
    "maxprice",
    parseAsInteger
      .withDefault(Math.round(minMaxPrices.maxPrice) || 500)
      .withOptions({ shallow: false, throttleMs: 100, history: "push" })
  );

  const handleSliderChange = (values: number[]) => {
    if (values && values.length === 2) {
      setMinprice(values[0]);
      setMaxprice(values[1]);
    }
  };

  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseFloat(e.target.value);
    if (isNaN(value)) {
      value = minMaxPrices.minPrice;
    }
    setMinprice(value);
  };

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseFloat(e.target.value);
    if (isNaN(value)) {
      value = minMaxPrices.maxPrice;
    }
    setMaxprice(value);
  };

  // if (isLoading) {
  //   return (
  //     <div>
  //       <h3 className="text-sm font-medium mb-2">PRICE RANGE</h3>
  //       <div className="space-y-4">
  //         <Skeleton className="w-full h-8 rounded-md" />
  //         <div className="flex gap-4">
  //           <Skeleton className="w-1/2 h-8 rounded-md" />
  //           <Skeleton className="w-1/2 h-8 rounded-md" />
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div>
      <h3 className="text-sm font-medium mb-2">PRICE RANGE</h3>
      <div className="space-y-4">
        <Slider
          value={[minprice, maxprice]}
          defaultValue={[minMaxPrices.minPrice, minMaxPrices.maxPrice]}
          min={minMaxPrices.minPrice}
          max={minMaxPrices.maxPrice}
          step={1}
          minStepsBetweenThumbs={1}
          className="w-full"
          onValueChange={handleSliderChange}
        />
        <div className="flex gap-4">
          <Input
            type="number"
            placeholder="Min"
            onChange={handleMinInputChange}
            value={minprice}
            min={minMaxPrices.minPrice}
            max={minMaxPrices.maxPrice}
          />
          <Input
            type="number"
            placeholder="Max"
            onChange={handleMaxInputChange}
            value={maxprice}
            min={minMaxPrices.minPrice}
            max={minMaxPrices.maxPrice}
          />
        </div>
      </div>
    </div>
  );
}

export default PriceRangeFilter;
