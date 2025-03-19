"use client";

import React, { useEffect, useState, useRef } from "react";
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
  // Query state for URL persistence
  const [minprice, setMinprice] = useQueryState(
    "minprice",
    parseAsFloat
      .withDefault(Math.floor(minMaxPrices.minPrice) || 0)
      .withOptions({ shallow: false, throttleMs: 100, history: "push" })
  );

  const [maxprice, setMaxprice] = useQueryState(
    "maxprice",
    parseAsFloat
      .withDefault(Math.ceil(minMaxPrices.maxPrice) || 500)
      .withOptions({ shallow: false, throttleMs: 100, history: "push" })
  );

  // Local state for input fields, initialized based on query state
  const [localMinPrice, setLocalMinPrice] = useState<string | number>(
    minprice ?? ""
  );
  const [localMaxPrice, setLocalMaxPrice] = useState<string | number>(
    maxprice ?? ""
  );

  // Track user-initiated changes to prevent useEffect overrides
  const isUserTypingMin = useRef(false);
  const isUserTypingMax = useRef(false);

  // Sync local state with query state, but skip if user is typing
  useEffect(() => {
    if (!isUserTypingMin.current) {
      setLocalMinPrice(minprice ?? "");
    }
  }, [minprice]);

  useEffect(() => {
    if (!isUserTypingMax.current) {
      setLocalMaxPrice(maxprice ?? "");
    }
  }, [maxprice]);

  // Handle slider changes, flooring minPrice
  const handleSliderChange = (values: number[]) => {
    if (values && values.length === 2) {
      const newMin = Math.floor(values[0]); // Floor minPrice
      const newMax = values[1]; // Keep maxPrice as is
      setMinprice(newMin);
      setMaxprice(newMax);
    }
  };

  // Handle min input changes
  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    isUserTypingMin.current = true; // Mark as user-initiated
    setLocalMinPrice(value); // Allow empty string

    if (value === "") {
      setMinprice(null); // Clear query state
    } else {
      const parsedValue = parseFloat(value);
      if (!isNaN(parsedValue)) {
        const flooredValue = Math.floor(parsedValue); // Floor the value
        setMinprice(flooredValue);
      }
    }

    // Reset typing flag after update
    setTimeout(() => {
      isUserTypingMin.current = false;
    }, 0);
  };

  // Handle max input changes
  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    isUserTypingMax.current = true; // Mark as user-initiated
    setLocalMaxPrice(value); // Allow empty string

    if (value === "") {
      setMaxprice(null); // Clear query state
    } else {
      const parsedValue = parseFloat(value);
      if (!isNaN(parsedValue)) {
        setMaxprice(parsedValue); // No flooring/ceiling for maxPrice
      }
    }

    // Reset typing flag after update
    setTimeout(() => {
      isUserTypingMax.current = false;
    }, 0);
  };

  // Slider values with fallback to minMaxPrices when inputs are empty
  const sliderMinValue =
    localMinPrice === "" || isNaN(Number(localMinPrice))
      ? Math.floor(minMaxPrices.minPrice)
      : Number(localMinPrice);
  const sliderMaxValue =
    localMaxPrice === "" || isNaN(Number(localMaxPrice))
      ? Math.ceil(minMaxPrices.maxPrice)
      : Number(localMaxPrice);

  return (
    <div>
      <h3 className="text-sm font-medium mb-2">PRICE RANGE</h3>
      <div className="space-y-4">
        <Slider
          value={[sliderMinValue, sliderMaxValue]}
          defaultValue={[
            Math.floor(minMaxPrices.minPrice),
            Math.ceil(minMaxPrices.maxPrice),
          ]}
          min={Math.floor(minMaxPrices.minPrice)}
          max={Math.ceil(minMaxPrices.maxPrice)}
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
            value={localMinPrice}
          />
          <Input
            type="number"
            placeholder="Max"
            onChange={handleMaxInputChange}
            value={localMaxPrice}
          />
        </div>
      </div>
    </div>
  );
}

export default PriceRangeFilter;
