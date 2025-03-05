"use client";

import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useQueryState, parseAsArrayOf, parseAsString } from "nuqs";
import { Skeleton } from "@/components/ui/skeleton";
import { useProductFiltersData } from "../useProductFilterData";

function AttributeFilter({
  attributeKey,
  asButtons = true,
  availableAttributes,
}: {
  attributeKey: string;
  asButtons?: boolean;
  availableAttributes: { [key: string]: string[] };
}) {
  const [selectedAttributes, setSelectedAttributes] = useQueryState(
    attributeKey,
    parseAsArrayOf(parseAsString, ",").withOptions({ shallow: false })
  );

  const attributes = availableAttributes[attributeKey] || [];

  const handleAttributeChange = (attribute: string) => {
    const attributeValue = attribute;
    setSelectedAttributes((prev) => {
      if (!Array.isArray(prev)) {
        return [attributeValue];
      }
      if (prev.includes(attributeValue)) {
        return prev.filter((item) => item !== attributeValue);
      } else {
        return [...prev, attributeValue];
      }
    });
  };

  return (
    <div>
      <h3 className="text-sm font-medium mb-2">{attributeKey.toUpperCase()}</h3>
      <div className={asButtons ? "flex flex-wrap gap-2" : "space-y-2"}>
        {attributes.map((attr) => {
          const key = attr;
          const label = attr;
          const isSelected =
            Array.isArray(selectedAttributes) &&
            selectedAttributes.some((item) => item === key);

          return (
            <div key={key} className="flex items-center">
              {asButtons ? (
                <Button
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleAttributeChange(attr)}
                >
                  {label}
                </Button>
              ) : (
                <>
                  <Checkbox
                    id={`attr-${key}`}
                    checked={isSelected}
                    onCheckedChange={() => handleAttributeChange(attr)}
                  />
                  <label htmlFor={`attr-${key}`} className="ml-2 text-sm">
                    {label}
                  </label>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const AttributeSelector = ({}) => {
  const { availableAttributes, isLoading } = useProductFiltersData();

  const AttributeSkeleton = () => {
    return (
      <>
        <Skeleton className="w-32 h-8 mb-4" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="w-16 h-8 rounded-md" />
          ))}
        </div>
      </>
    );
  };

  if (isLoading) {
    return (
      <>
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="mb-6">
            <AttributeSkeleton />
          </div>
        ))}
      </>
    );
  }

  return (
    <>
      {Object.keys(availableAttributes).map((key) => (
        <AttributeFilter
          key={key}
          attributeKey={key}
          asButtons
          availableAttributes={availableAttributes}
        />
      ))}
    </>
  );
};
