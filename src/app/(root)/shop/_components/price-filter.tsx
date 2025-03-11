"use client";

import React from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { useQueryState, parseAsFloat } from "nuqs";

interface PriceRangeFilterProps {
  minMaxPrices: {
    minPrice: number;
    maxPrice: number;
  };
}

function PriceRangeFilter({ minMaxPrices }: PriceRangeFilterProps) {
  const [minprice, setMinprice] = useQueryState(
    "minprice",
    parseAsFloat
      .withDefault(Math.floor(minMaxPrices.minPrice) || 0)
      .withOptions({ shallow: false, throttleMs: 100, history: "push" })
  );

  const [maxprice, setMaxprice] = useQueryState(
    "maxprice",
    parseAsFloat
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
    const value = e.target.value === "" ? "" : parseFloat(e.target.value);
    if (value === "" || isNaN(value)) {
      // @ts-expect-error: the library forces to use  null which doesnt allow me to achieve functionality i want
      setMinprice("");
    } else {
      setMinprice(value);
    }
  };

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === "" ? "" : parseFloat(e.target.value);
    if (value === "" || isNaN(value)) {
      // @ts-expect-error: the library forces to use null which doesnt allow me to achieve functionality i want
      setMaxprice("");
    } else {
      setMaxprice(value);
    }
  };

  return (
    <div>
      <h3 className="text-sm font-medium mb-2">PRICE RANGE</h3>
      <div className="space-y-4">
        <Slider
          value={[minprice, maxprice]}
          defaultValue={[
            Number(minMaxPrices.minPrice),
            Number(minMaxPrices.maxPrice),
          ]}
          min={Number(minMaxPrices.minPrice)}
          max={Number(minMaxPrices.maxPrice)}
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
            value={minprice || ""}
            // min={minMaxPrices.minPrice}
            // max={minMaxPrices.maxPrice}
          />

          <Input
            type="number"
            placeholder="Max"
            onChange={handleMaxInputChange}
            value={maxprice || ""}
            // min={minMaxPrices.minPrice}
            // max={minMaxPrices.maxPrice}
          />
        </div>
      </div>
    </div>
  );
}

export default PriceRangeFilter;
