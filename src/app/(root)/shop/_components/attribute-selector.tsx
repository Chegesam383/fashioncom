"use client";

import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useQueryState, parseAsString } from "nuqs";

interface Attributes {
  [key: string]: string[];
}

function AttributeFilter({
  attributeKey,
  asButtons = true,
  availableAttributes,
}: {
  attributeKey: string;
  asButtons?: boolean;
  availableAttributes: Attributes;
}) {
  const [allAttributes, setAllAttributes] = useQueryState(
    "attributes",
    parseAsString.withOptions({ shallow: false, throttleMs: 10 })
  );

  const attributes = availableAttributes[attributeKey] || [];

  const handleAttributeChange = (attribute: string) => {
    let currentAttributes: Attributes = {};

    if (allAttributes) {
      try {
        currentAttributes = JSON.parse(allAttributes) as Attributes;
      } catch (e) {
        console.error("Error parsing attributes:", e);
      }
    }

    const attributeValue = attribute;

    if (!currentAttributes[attributeKey]) {
      currentAttributes[attributeKey] = [];
    }

    if (currentAttributes[attributeKey].includes(attributeValue)) {
      currentAttributes[attributeKey] = currentAttributes[attributeKey].filter(
        (item: string) => item !== attributeValue
      );
    } else {
      currentAttributes[attributeKey].push(attributeValue);
    }

    // Remove empty arrays from the attributes object
    Object.keys(currentAttributes).forEach((key) => {
      if (currentAttributes[key].length === 0) {
        delete currentAttributes[key];
      }
    });

    setAllAttributes(JSON.stringify(currentAttributes));
  };

  const getIsSelected = (attribute: string) => {
    if (allAttributes) {
      try {
        const parsedAttributes = JSON.parse(allAttributes) as Attributes;
        return (
          parsedAttributes[attributeKey] &&
          parsedAttributes[attributeKey].includes(attribute)
        );
      } catch (e) {
        console.error("Error parsing attributes:", e);
        return false;
      }
    }
    return false;
  };

  return (
    <div>
      <h3 className="text-sm font-medium mb-2">{attributeKey.toUpperCase()}</h3>
      <div className={asButtons ? "flex flex-wrap gap-2" : "space-y-2"}>
        {attributes.map((attr) => {
          const key = attr;
          const label = attr;
          const isSelected = getIsSelected(attr);

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
  availableAttributes: Attributes;
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
