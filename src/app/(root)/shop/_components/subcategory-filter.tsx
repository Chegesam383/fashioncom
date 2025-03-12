"use client";

import React, { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";
import { getCategoriesWithSubcategories } from "@/actions/categoryActions";
import { CategoryWithSubcategories, ProductSubcategory } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button"; // Shadcn Button

function SubcategoryFilter() {
  const [category, setCategory] = useQueryState(
    "category",
    parseAsString.withOptions({ shallow: false })
  );
  const [subcategories, setSubcategories] = useQueryState(
    "subcategories",
    parseAsArrayOf(parseAsString).withOptions({ shallow: false })
  );

  const [categoriesWithSubcategories, setCategoriesWithSubcategories] =
    useState<CategoryWithSubcategories[]>([]);
  const [activeSubcategories, setActiveSubcategories] = useState<
    ProductSubcategory[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(15); // Initial items to show

  const ITEMS_PER_PAGE = 15; // Threshold for pagination

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      const fetchedCategories = await getCategoriesWithSubcategories();
      setCategoriesWithSubcategories(fetchedCategories);
      setIsLoading(false);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (category && categoriesWithSubcategories) {
      const selectedCat = categoriesWithSubcategories.find(
        (item) => item.slug === category
      );
      setActiveSubcategories(selectedCat?.subcategories || []);
    }
  }, [category, categoriesWithSubcategories]);

  const handleItemChange = (slug: string) => {
    if (category) {
      setSubcategories((prevSubcategories) =>
        prevSubcategories?.includes(slug)
          ? prevSubcategories.filter((sub) => sub !== slug)
          : [...(prevSubcategories || []), slug]
      );
    } else {
      if (category !== slug) {
        setCategory(slug);
      }
    }
  };

  const renderItems = () => {
    const items = category ? activeSubcategories : categoriesWithSubcategories;
    const visibleItems = items.slice(0, visibleCount);

    return visibleItems.map((item) => {
      const key = item.name;
      const label = item.name;
      const slug = item.slug;
      let isSelected = false;

      if (category) {
        if (subcategories && subcategories.length > 0) {
          isSelected = subcategories.includes(slug);
        }
      } else {
        isSelected = category === slug;
      }

      return (
        <div key={key} className="flex items-center">
          <Checkbox
            id={`item-${key}`}
            checked={isSelected}
            onCheckedChange={() => handleItemChange(slug)}
          />
          <label htmlFor={`item-${key}`} className="ml-2 text-sm">
            {label}
          </label>
        </div>
      );
    });
  };

  const renderSkeleton = () => {
    return (
      <div className="space-y-4 w-full">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="flex items-center">
            <Skeleton className="h-4 w-5 rounded-full" />
            <Skeleton className="ml-2 h-4 w-full" />
          </div>
        ))}
      </div>
    );
  };

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  };

  const handleShowLess = () => {
    setVisibleCount((prev) => Math.max(ITEMS_PER_PAGE, prev - ITEMS_PER_PAGE));
  };

  const items = category ? activeSubcategories : categoriesWithSubcategories;
  const totalItems = items.length;
  const canShowMore = visibleCount < totalItems;
  const canShowLess = visibleCount > ITEMS_PER_PAGE;

  return (
    <div>
      {isLoading ? (
        renderSkeleton()
      ) : (
        <div>
          <div className="space-y-3">{renderItems()}</div>
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
                  onClick={handleShowLess}
                  className="underline text-gray-700 hover:text-gray-900"
                >
                  Show Less
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SubcategoryFilter;
