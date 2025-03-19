import { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AttributeValue } from "./attributes-editor";

interface Variant {
  id: string;
  combination: Record<string, AttributeValue>;
  price: number;
  stock: number;
  sku: string;
}

interface ProductVariantsTableProps {
  variants: Variant[];
  onChange: (
    variantId: string,
    field: "price" | "stock" | "sku",
    value: number | string
  ) => void;
}

export function formatAttributesForSubmission(variants: Variant[]) {
  if (variants.length === 0) return null;

  // Initialize the structure
  const formattedData: {
    availableAttributes: Record<string, string[]>;
    attributeCombinations: Array<Record<string, string>>;
  } = {
    availableAttributes: {},
    attributeCombinations: [],
  };

  // Get all attribute names
  const attributeNames = new Set<string>();
  variants.forEach((variant) => {
    Object.keys(variant.combination).forEach((attrName) => {
      attributeNames.add(attrName);
    });
  });

  // Populate availableAttributes
  attributeNames.forEach((attrName) => {
    // Get all unique values for this attribute
    const values = new Set<string>();
    variants.forEach((variant) => {
      if (variant.combination[attrName]) {
        values.add(variant.combination[attrName].value);
      }
    });

    formattedData.availableAttributes[attrName] = Array.from(values);
  });

  // Populate attributeCombinations
  variants.forEach((variant) => {
    const combination: Record<string, string> = {
      price: variant.price.toString(),
      stock: variant.stock.toString(),
      sku: variant.sku,
    };

    // Add each attribute value to the combination
    Object.entries(variant.combination).forEach(([attrName, attrValue]) => {
      combination[attrName] = attrValue.value;
    });

    formattedData.attributeCombinations.push(combination);
  });

  return formattedData;
}

export function ProductVariantsTable({
  variants,
  onChange,
}: ProductVariantsTableProps) {
  // Get a unique list of all attribute names from all variant combinations
  const attributeNames = useMemo(() => {
    if (variants.length === 0) return [];

    const allAttributes = new Set<string>();

    variants.forEach((variant) => {
      Object.keys(variant.combination).forEach((attrName) => {
        allAttributes.add(attrName);
      });
    });

    return Array.from(allAttributes);
  }, [variants]);

  if (variants.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">No variants available.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {attributeNames.map((name) => (
              <TableHead key={name}>{name}</TableHead>
            ))}
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>SKU</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {variants.map((variant) => (
            <TableRow key={variant.id}>
              {attributeNames.map((attrName) => (
                <TableCell key={`${variant.id}-${attrName}`}>
                  {variant.combination[attrName] ? (
                    <Badge variant="outline">
                      {variant.combination[attrName].value}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
              ))}
              <TableCell>
                <Input
                  type="number"
                  value={variant.price}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (!isNaN(value)) {
                      onChange(variant.id, "price", value);
                    }
                  }}
                  className="w-24"
                  min="0"
                  step="0.01"
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={variant.stock}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (!isNaN(value) && value >= 0) {
                      onChange(variant.id, "stock", value);
                    }
                  }}
                  className="w-24"
                  min="0"
                />
              </TableCell>
              <TableCell>
                <Input
                  type="text"
                  value={variant.sku}
                  onChange={(e) => onChange(variant.id, "sku", e.target.value)}
                  className="w-40"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
