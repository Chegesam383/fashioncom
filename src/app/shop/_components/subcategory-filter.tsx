// src/components/filters/SubcategoryFilter.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useSearchParams, useRouter } from "next/navigation";
import { getCategoriesWithSubcategories } from "@/actions/categoryActions"; // Adjust path
import { CategoryWithSubcategories, ProductSubcategory } from "@/lib/types";

function SubcategoryFilter() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [categoriesWithSubcategories, setCategoriesWithSubcategories] =
    useState<CategoryWithSubcategories[]>([]);
  const [activeSubcategories, setActiveSubcategories] = useState<
    ProductSubcategory[]
  >([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const fetchedCategories = await getCategoriesWithSubcategories();
      setCategoriesWithSubcategories(fetchedCategories);
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const getSubcategoriesForSelectedCategory = () => {
      const selectedCategory = searchParams.get("category");

      if (!selectedCategory) {
        return [];
      }

      const selectedCategoryData = categoriesWithSubcategories.find(
        (cat) => cat.slug === selectedCategory
      );

      setActiveSubcategories(selectedCategoryData?.subcategories || []);
    };
    getSubcategoriesForSelectedCategory();
  }, [searchParams]);

  const handleSubcategoryChange = (subcategory: string) => {
    const currentSubcategories = searchParams.get("subcategories");
    let updatedSubcategories: string[] = [];

    if (currentSubcategories) {
      updatedSubcategories = currentSubcategories.split(",");
    }

    if (updatedSubcategories.includes(subcategory)) {
      updatedSubcategories = updatedSubcategories.filter(
        (item) => item !== subcategory
      );
    } else {
      updatedSubcategories.push(subcategory);
    }

    const params = new URLSearchParams(searchParams);
    if (updatedSubcategories.length > 0) {
      params.set("subcategories", updatedSubcategories.join(","));
    } else {
      params.delete("subcategories");
    }

    router.replace(`?${params.toString()}`);
  };

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams);
    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    params.delete("subcategories");

    router.replace(`?${params.toString()}`);
  };

  const renderCategoriesOrSubcategories = () => {
    const selectedCategory = searchParams.get("category");
    if (selectedCategory) {
      return activeSubcategories.map((sub) => {
        const key = sub.name;
        const label = sub.name;
        const isSelected = searchParams
          .get("subcategories")
          ?.split(",")
          .includes(sub.slug);

        return (
          <div key={key} className="flex items-center">
            <Checkbox
              id={`sub-${key}`}
              checked={isSelected}
              onCheckedChange={() => handleSubcategoryChange(sub.slug)}
            />
            <label htmlFor={`sub-${key}`} className="ml-2 text-sm">
              {label}
            </label>
          </div>
        );
      });
    } else {
      return categoriesWithSubcategories.map((cat) => {
        const key = cat.name;
        const label = cat.name;
        const isSelected = searchParams.get("category") === cat.slug;

        return (
          <div key={key} className="flex items-center">
            <Checkbox
              id={`cat-${key}`}
              checked={isSelected}
              onCheckedChange={() => handleCategoryChange(cat.slug)}
            />
            <label htmlFor={`cat-${key}`} className="ml-2 text-sm">
              {label}
            </label>
          </div>
        );
      });
    }
  };

  return (
    <div>
      <div className="space-y-2">{renderCategoriesOrSubcategories()}</div>
    </div>
  );
}

export default SubcategoryFilter;
