import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useQueryState, parseAsArrayOf, parseAsString } from "nuqs";

function AttributeFilter({
  attributes,
  attributeKey,
  buttons = false,
}: {
  attributes: string[];
  attributeKey: string;
  buttons?: boolean;
}) {
  const [selectedAttributes, setSelectedAttributes] = useQueryState(
    attributeKey,
    parseAsArrayOf(parseAsString, ",").withOptions({ shallow: false })
  );

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
      <h3 className="text-sm font-medium mb-2">
        {attributeKey === "sizes" ? "Size" : "Color"}
      </h3>
      <div className={buttons ? "grid grid-cols-3 gap-2" : "space-y-2"}>
        {attributes.map((attr) => {
          const key = attr;
          const label = attr;
          const isSelected =
            Array.isArray(selectedAttributes) &&
            selectedAttributes.some((item) => item === key);

          return (
            <div key={key} className="flex items-center">
              {buttons ? (
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

// Data
const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
const colors = ["red", "green", "indigo", "black"];

export const AttributeSelector = () => {
  return (
    <>
      <AttributeFilter attributes={sizes} attributeKey="sizes" buttons={true} />
      <AttributeFilter attributes={colors} attributeKey="colors" />
    </>
  );
};
