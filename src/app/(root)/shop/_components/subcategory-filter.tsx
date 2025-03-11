"use client";

import React, { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";
import { getCategoriesWithSubcategories } from "@/actions/categoryActions";
import { CategoryWithSubcategories, ProductSubcategory } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton"; // Assuming you have a Skeleton component

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

  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true); // Set loading to true
      const fetchedCategories = await getCategoriesWithSubcategories();
      setCategoriesWithSubcategories(fetchedCategories);
      setIsLoading(false); // Set loading to false after fetching
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (category && categoriesWithSubcategories) {
      const selectedcat = categoriesWithSubcategories.find(
        (item) => item.slug === category
      );
      setActiveSubcategories(selectedcat?.subcategories || []);
    }
  }, [category, categoriesWithSubcategories]);

  const handleItemChange = (slug: string) => {
    if (category) {
      if (subcategories?.includes(slug)) {
        setSubcategories(subcategories.filter((sub) => sub !== slug));
      } else {
        setSubcategories([...(subcategories || []), slug]);
      }
    } else {
      if (category === slug) {
      } else {
        setCategory(slug);
      }
    }
  };

  const renderItems = () => {
    const items = category ? activeSubcategories : categoriesWithSubcategories;
    return items?.map((item) => {
      const key = item.name;
      const label = item.name;
      const slug = item.slug;
      const isSelected = category
        ? subcategories?.includes(slug)
        : category === slug;

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

  return (
    <div>
      {isLoading ? (
        renderSkeleton()
      ) : (
        <div className="space-y-3">{renderItems()}</div>
      )}
    </div>
  );
}

export default SubcategoryFilter;
