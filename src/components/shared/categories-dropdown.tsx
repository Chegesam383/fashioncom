"use client";
import { getCategories } from "@/actions/categoryActions";
import { ProductCategory, ProductSubcategory } from "@/lib/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { getSubcategoryById } from "@/actions/subCategoryActions";

export const CategoriesDropDown = () => {
  const [categories, setCategories] = useState<ProductCategory[] | undefined>(
    undefined
  );
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [subcategories, setSubcategories] = useState<
    ProductSubcategory[] | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const allCategories = await getCategories();
        setCategories(allCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  });

  const handleCategoryHover = async (categoryId: string) => {
    setActiveCategory(categoryId);

    // Fetch subcategories using the server action
    try {
      const fetchedSubcategories = await getSubcategoryById(categoryId);
      if (fetchedSubcategories) {
        setSubcategories([fetchedSubcategories]);
      } else {
        setSubcategories([]);
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  const handleCategoryLeave = () => {
    setActiveCategory(null);
    setSubcategories(undefined); // Clear subcategories when leaving
  };

  if (isLoading) {
    return (
      <Button variant="outline" className="text-white bg-slate-900">
        Loading...
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="text-white bg-slate-900">
          Categories
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 max-h-[70vh] overflow-y-auto flex">
        <div>
          {categories &&
            categories.map((category: ProductCategory) => (
              <div
                key={category.id}
                onMouseEnter={() => handleCategoryHover(category.id)}
                onMouseLeave={handleCategoryLeave}
              >
                <DropdownMenuItem>
                  <Link
                    href={`shop?subcategory=${category.slug}`}
                    className="w-full"
                  >
                    {category.name}
                  </Link>
                </DropdownMenuItem>
              </div>
            ))}
        </div>

        <div>
          {subcategories &&
            subcategories.map((subcategory: ProductSubcategory) => (
              <DropdownMenuItem key={subcategory.id}>
                <Link
                  href={`shop?subcategory=${
                    categories?.find(
                      (category) => category.id === activeCategory
                    )?.slug
                  }/${subcategory.slug}`}
                  className="w-full"
                >
                  {subcategory.name}
                </Link>
              </DropdownMenuItem>
            ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
