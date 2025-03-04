import React from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { useQueryStates, parseAsFloat } from "nuqs";

function PriceRangeFilter() {
  const [pricerange, setpricerange] = useQueryStates(
    {
      minprice: parseAsFloat.withDefault(0),
      maxprice: parseAsFloat.withDefault(100),
    },
    {
      shallow: false,
      history: "push",
    }
  );

  const { minprice, maxprice } = pricerange;

  const handleSliderChange = (values: number[]) => {
    if (values && values.length === 2) {
      setpricerange({ minprice: values[0], maxprice: values[1] });
    }
  };

  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setpricerange({ minprice: value });
  };

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setpricerange({ maxprice: value });
  };

  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Price Range</h3>
      <div className="space-y-4">
        <Slider
          value={[minprice, maxprice]}
          defaultValue={[0, 100]}
          min={0}
          max={100}
          step={1}
          minStepsBetweenThumbs={10}
          className="w-full"
          onValueChange={handleSliderChange}
        />
        <div className="flex gap-4">
          <Input
            type="number"
            placeholder="Min"
            onChange={handleMinInputChange}
            value={minprice}
          />
          <Input
            type="number"
            placeholder="Max"
            onChange={handleMaxInputChange}
            value={maxprice}
          />
        </div>
      </div>
    </div>
  );
}

export default PriceRangeFilter;
