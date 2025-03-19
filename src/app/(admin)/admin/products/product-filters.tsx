"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  useQueryState,
  parseAsString,
  parseAsArrayOf,
  parseAsInteger,
} from "nuqs";
import { CategoryWithSubcategories, ProductSubcategory } from "@/lib/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

const ProductPageFilters = ({
  categories,
}: {
  categories: CategoryWithSubcategories[];
}) => {
  const params = useSearchParams();
  const [q, setQ] = useQueryState(
    "q",
    parseAsString.withOptions({ shallow: false, history: "push" })
  );

  const [category, setCategory] = useQueryState(
    "category",
    parseAsString.withOptions({
      shallow: false,
      history: "push",
    })
  );

  const [subcategories, setSubcategories] = useQueryState(
    "subcategories",
    parseAsArrayOf(parseAsString).withOptions({
      shallow: false,
      history: "push",
    })
  );

  const [minStock, setMinStock] = useQueryState(
    "minstock",
    parseAsInteger.withOptions({
      shallow: false,
      history: "push",
    })
  );

  const [maxStock, setMaxStock] = useQueryState(
    "maxstock",
    parseAsInteger.withOptions({
      shallow: false,
      history: "push",
    })
  );

  const [availableSubcategories, setAvailableSubcategories] = useState<
    ProductSubcategory[]
  >([]);

  useEffect(() => {
    if (!category || category === "all") {
      setAvailableSubcategories([]);
      setSubcategories(null); // Clear subcategories when no category is selected
    } else {
      const selectedCategory = categories.find((cat) => cat.slug === category);
      const newSubcategories = selectedCategory?.subcategories || [];
      setAvailableSubcategories(newSubcategories);
      // Only keep selected subcategories that are still valid
      if (subcategories) {
        const validSubcategories = subcategories.filter((sub) =>
          newSubcategories.some((item) => item.slug === sub)
        );
        setSubcategories(
          validSubcategories.length > 0 ? validSubcategories : null
        );
      }
    }
  }, [params.get("category")]);

  const handleSubcategoryChange = (slug: string, checked: boolean) => {
    const currentSubs = subcategories || [];
    if (checked) {
      setSubcategories([...currentSubs, slug]);
    } else {
      const updatedSubs = currentSubs.filter((sub) => sub !== slug);
      setSubcategories(updatedSubs.length > 0 ? updatedSubs : null);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={q || ""}
            onChange={(e) => setQ(e.target.value || null)}
            className="w-full pl-8 sm:w-[300px]"
          />
        </div>

        {/* Category Filter */}
        <Select
          value={category || "all"}
          onValueChange={(value) => setCategory(value === "all" ? null : value)}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.slug} value={cat.slug}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Subcategory Multi-Select */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full sm:w-[180px] justify-start text-left",
                subcategories &&
                  subcategories.length > 0 &&
                  "text-muted-foreground"
              )}
              disabled={!category || category === "all"}
            >
              {subcategories && subcategories.length > 0
                ? `${subcategories.length} selected`
                : "Filter by subcategory"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <div className="p-4 space-y-2">
              {availableSubcategories.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No subcategories available
                </p>
              ) : (
                availableSubcategories.map((sub) => (
                  <div key={sub.slug} className="flex items-center space-x-2">
                    <Checkbox
                      id={`sub-${sub.slug}`}
                      checked={subcategories?.includes(sub.slug) || false}
                      onCheckedChange={(checked) =>
                        handleSubcategoryChange(sub.slug, checked as boolean)
                      }
                    />
                    <Label htmlFor={`sub-${sub.slug}`} className="text-sm">
                      {sub.name}
                    </Label>
                  </div>
                ))
              )}
            </div>
          </PopoverContent>
        </Popover>

        {/* Stock Min Input */}
        <div className="relative">
          <Input
            type="number"
            placeholder="Min Stock"
            value={minStock ?? ""}
            onChange={(e) =>
              setMinStock(e.target.value === "" ? null : Number(e.target.value))
            }
            className="w-full sm:w-[120px]"
            min={0}
          />
        </div>

        {/* Stock Max Input */}
        <div className="relative">
          <Input
            type="number"
            placeholder="Max Stock"
            value={maxStock ?? ""}
            onChange={(e) =>
              setMaxStock(e.target.value === "" ? null : Number(e.target.value))
            }
            className="w-full sm:w-[120px]"
            min={0}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductPageFilters;
