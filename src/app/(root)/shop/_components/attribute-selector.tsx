"use client";

import React, { useEffect, useState } from "react";
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
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(5); // Initial items to show

  const ITEMS_PER_PAGE = 5; // Threshold for pagination

  useEffect(() => {
    if (allAttributes) {
      try {
        const parsedAttributes = JSON.parse(allAttributes) as Attributes;
        setSelectedAttributes(parsedAttributes[attributeKey] || []);
      } catch (e) {
        console.error("Error parsing attributes:", e);
        setSelectedAttributes([]);
      }
    } else {
      setSelectedAttributes([]);
    }
  }, [allAttributes, attributeKey]);

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

    Object.keys(currentAttributes).forEach((key) => {
      if (currentAttributes[key].length === 0) {
        delete currentAttributes[key];
      }
    });

    setAllAttributes(JSON.stringify(currentAttributes));
  };

  const getIsSelected = (attribute: string) => {
    return selectedAttributes.includes(attribute);
  };

  const renderAttributes = () => {
    const visibleAttributes = attributes.slice(0, visibleCount); // Limit to visibleCount

    return visibleAttributes.slice(0, 6).map((attr) => {
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
    });
  };

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  };

  const handleShowLess = () => {
    setVisibleCount((prev) => Math.max(ITEMS_PER_PAGE, prev - ITEMS_PER_PAGE));
  };

  const totalItems = attributes.length;
  const canShowMore = visibleCount < totalItems;
  const canShowLess = visibleCount > ITEMS_PER_PAGE;

  return (
    <div>
      <h3 className="text-sm font-medium mb-2">{attributeKey.toUpperCase()}</h3>
      <div className={asButtons ? "flex flex-wrap gap-2" : "space-y-2"}>
        {renderAttributes()}
      </div>
      {totalItems > ITEMS_PER_PAGE && (
        <div className="mt-4 flex gap-2 justify-start">
          {canShowMore && (
            <Button
              variant="ghost"
              size="sm"
              className="underline text-gray-700 hover:text-gray-900"
              onClick={handleShowMore}
            >
              Show More
            </Button>
          )}
          {canShowLess && (
            <Button
              variant="ghost"
              size="sm"
              className="underline text-gray-700 hover:text-gray-900"
              onClick={handleShowLess}
            >
              Show Less
            </Button>
          )}
        </div>
      )}
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
