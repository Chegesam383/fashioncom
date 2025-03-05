"use client";

import React, { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";
import { getCategoriesWithSubcategories } from "@/actions/categoryActions"; // Assuming you have these
import { CategoryWithSubcategories, ProductSubcategory } from "@/lib/types";

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

  useEffect(() => {
    //fetch categories
    const fetchCategories = async () => {
      const fetchedCategories = await getCategoriesWithSubcategories();
      setCategoriesWithSubcategories(fetchedCategories);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    //fetch subcategories of selected category
    if (category && categoriesWithSubcategories) {
      const selectedcat = categoriesWithSubcategories.find(
        (item) => item.slug === category
      );
      setActiveSubcategories(selectedcat?.subcategories || []);
    }
  }, [category, categoriesWithSubcategories]);

  const handleItemChange = (slug: string) => {
    if (category) {
      // Handle subcategory change
      if (subcategories?.includes(slug)) {
        setSubcategories(subcategories.filter((sub) => sub !== slug));
      } else {
        setSubcategories([...(subcategories || []), slug]);
      }
    } else {
      // Handle category change
      if (category === slug) {
        // setCategory(undefined);
        // setSubcategories(undefined);
      } else {
        setCategory(slug);
        // setSubcategories(undefined);
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

  return (
    <div>
      <div className="space-y-2">{renderItems()}</div>
    </div>
  );
}

export default SubcategoryFilter;
