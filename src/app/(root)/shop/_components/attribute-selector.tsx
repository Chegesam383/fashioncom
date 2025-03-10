"use client";

import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useQueryState, parseAsArrayOf, parseAsString } from "nuqs";

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

export const AttributeSelector = ({
  availableAttributes,
}: {
  availableAttributes: Record<string, string[]>;
}) => {
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
