import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useQueryState, parseAsString } from "nuqs";

function RatingFilter() {
  const [selectedRating, setSelectedRating] = useQueryState(
    "rating",
    parseAsString.withOptions({ shallow: false }).withDefault("all")
  );

  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Minimum Rating</h3>
      <div className="flex flex-col gap-2">
        <RadioGroup value={selectedRating} onValueChange={setSelectedRating}>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="all" id="all" />
            <label htmlFor="all" className="flex items-center gap-1">
              All reviews{" "}
              <span className="text-muted-foreground text-xs">(12,921)</span>
            </label>
          </div>
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center gap-2">
              <RadioGroupItem value={`${star}`} id={`${star}-stars`} />
              <label
                htmlFor={`${star}-stars`}
                className="flex items-center gap-1"
              >
                {Array.from({ length: 5 }, (_, i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 ms-1"
                    xmlns="http://www.w3.org/2000/svg"
                    fill={i < star ? "currentColor" : "gray"}
                    viewBox="0 0 22 20"
                  >
                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                  </svg>
                ))}
                <span className="text-muted-foreground text-xs">
                  ({star * 1000})
                </span>
              </label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}

export default RatingFilter;
