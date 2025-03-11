/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";

import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueryState } from "nuqs";
import { parseAsInteger, parseAsString, parseAsJson } from "nuqs";
import { ChevronDown, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const attributesSchema = z.record(z.array(z.string()));

interface FilterBadgesProps {
  activeFilters: { key: string; label: any }[]; // Change label type to any
  removeFilter: (filterKey: string) => void;
  itemCount: number;
}

const FilterControls = () => {
  const [itemsPerPage, setItemsPerPage] = useQueryState(
    "limit",
    parseAsInteger.withDefault(10).withOptions({ shallow: false })
  );
  const [priceSort, setPriceSort] = useQueryState(
    "sort",
    parseAsString.withOptions({ shallow: false })
  );
  const [rating, setRating] = useQueryState(
    "rating",
    parseAsInteger.withOptions({ shallow: false })
  );
  const [minPrice, setMinPrice] = useQueryState(
    "minprice",
    parseAsString.withOptions({ shallow: false })
  );
  const [maxPrice, setMaxPrice] = useQueryState(
    "maxprice",
    parseAsString.withOptions({ shallow: false })
  );
  const [category, setCategory] = useQueryState(
    "category",
    parseAsString.withOptions({ shallow: false })
  );
  const [subcategories, setSubcategories] = useQueryState(
    "subcategories",
    parseAsString
  );
  const [attributes, setAttributes] = useQueryState(
    "attributes",
    parseAsJson((value) => attributesSchema.parse(value)).withDefault({})
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [page, setPage] = useQueryState("page", parseAsInteger);

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value, 10));
    setPage(null);
  };

  const handlePriceSortChange = (value: string | undefined) => {
    if (value === "default") {
      setPriceSort(null);
    } else {
      setPriceSort(value || null);
    }
    setPage(null);
  };

  const removeFilter = (filterKey: string) => {
    switch (filterKey) {
      case "rating":
        setRating(null);
        break;
      case "minprice":
        setMinPrice(null);
        break;
      case "maxprice":
        setMaxPrice(null);
        break;
      case "category":
        setCategory(null);
        break;
      case "subcategories":
        setSubcategories(null);
        break;
      case "attributes":
        setAttributes(null);
        break;
      default:
        break;
    }
    setPage(null);
  };

  const clearAllFilters = () => {
    setRating(null);
    setMinPrice(null);
    setMaxPrice(null);
    setCategory(null);
    setSubcategories(null);
    setAttributes(null);
    setPage(null);
  };

  const getSubcategoriesArray = () => {
    return subcategories
      ? typeof subcategories === "string"
        ? subcategories.split(",")
        : subcategories
      : [];
  };

  const formatAttributes = () => {
    const atr =
      attributes && typeof attributes === "string"
        ? JSON.parse(attributes)
        : {};

    return Object.entries(atr).map(([key, values]) => ({
      key,
      values,
    }));
  };

  const countActiveFilters = () => {
    let count = 0;

    if (rating) count++;
    if (minPrice && maxPrice) count++;
    if (category) count++;
    if (getSubcategoriesArray().length > 0) count++;
    if (Object.keys(attributes).length > 0) count++;

    return count;
  };

  const renderActiveFilters = (items = 3, items2 = 2) => {
    const subcategoriesArray = getSubcategoriesArray();
    const attributesArray = formatAttributes();

    const activeFilters = [
      rating && { key: "rating", label: `Rating: ${rating}` },
      minPrice &&
        maxPrice && {
          key: "minprice",
          label: `Price: ${minPrice} - ${maxPrice}`,
        },
      category && { key: "category", label: category },
      subcategoriesArray.length > 0 && {
        key: "subcategories",
        label: (
          <>
            {subcategoriesArray.length > items ? (
              <>
                {subcategoriesArray.slice(0, items).join(", ")} +
                {subcategoriesArray.length - items}
              </>
            ) : (
              subcategoriesArray.join(", ")
            )}
          </>
        ),
      },
      ...attributesArray.map((attr: any) => ({
        key: "attributes",
        label: `${attr.key}: ${
          attr.values.length > 3
            ? `${attr.values.slice(0, items).join(", ")} +${
                attr.values.length - items
              }`
            : attr.values.join(", ")
        }`,
      })),
    ].filter((item): item is { key: string; label: any } => {
      // change label type to any
      return (
        typeof item === "object" &&
        item !== null &&
        "key" in item &&
        "label" in item
      );
    });

    return (
      <div className="flex">
        <div className="">
          <div className="flex flex-wrap gap-2">
            <FilterBadges
              activeFilters={activeFilters}
              removeFilter={removeFilter}
              itemCount={items2}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex justify-between mb-2">
      {countActiveFilters() > 1 && (
        <p
          className=" text-sm cursor-pointer underline text-muted-foreground text-nowrap"
          onClick={clearAllFilters}
        >
          Clear all filters
        </p>
      )}
      <div className="inline-block lg:hidden flex-1 mr-4">
        {renderActiveFilters(1, 1)}
      </div>

      <div className="hidden lg:inline-block xl:hidden flex-1 mr-4">
        {renderActiveFilters(2, 2)}
      </div>
      <div className="hidden xl:inline-block flex-1 mr-4">
        {renderActiveFilters(3, 3)}
      </div>
      <div className="flex gap-2">
        <Select
          value={String(itemsPerPage)}
          onValueChange={handleItemsPerPageChange}
        >
          <SelectTrigger className="">
            <SelectValue placeholder="Items per page" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10 per page</SelectItem>
            <SelectItem value="20">20 per page</SelectItem>
            <SelectItem value="30">30 per page</SelectItem>
            <SelectItem value="50">50 per page</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priceSort || ""} onValueChange={handlePriceSortChange}>
          <SelectTrigger className="">
            <SelectValue placeholder="Sort by price" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="asc">Price: Low to High</SelectItem>
            <SelectItem value="desc">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default FilterControls;

const RemoveFilterButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      className="focus-visible:border-ring focus-visible:ring-ring/50 text-primary-foreground/60 hover:text-primary-foreground -my-px -ms-px -me-1.5 inline-flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-[inherit] p-0 transition-[color,box-shadow] outline-none focus-visible:ring-[3px]"
      onClick={onClick}
    >
      <X size={12} className="text-slate-700" />
    </button>
  );
};

const FilterBadges: React.FC<FilterBadgesProps> = ({
  activeFilters,
  removeFilter,
  itemCount,
}) => {
  if (!activeFilters || activeFilters.length === 0) {
    return null;
  }

  const visibleCount = Math.min(itemCount, activeFilters.length);
  return (
    <div className="flex flex-wrap gap-2">
      {activeFilters.slice(0, visibleCount).map((filter, index) => (
        <Badge
          key={index}
          variant="secondary"
          className="cursor-pointer h-5 text-nowrap"
        >
          {typeof filter.label === "string" ? (
            <span dangerouslySetInnerHTML={{ __html: filter.label }} />
          ) : (
            filter.label
          )}
          <RemoveFilterButton onClick={() => removeFilter(filter.key)} />
        </Badge>
      ))}

      {activeFilters.length > visibleCount && (
        <DropdownMenu>
          <DropdownMenuTrigger className="text-sm cursor-pointer">
            +{activeFilters.length - visibleCount}{" "}
            <ChevronDown className="inline h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {activeFilters.slice(visibleCount).map((filter, index) => (
              <DropdownMenuItem
                key={index + visibleCount}
                onClick={() => removeFilter(filter.key)}
              >
                {typeof filter.label === "string" ? (
                  <span dangerouslySetInnerHTML={{ __html: filter.label }} />
                ) : (
                  filter.label
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};
