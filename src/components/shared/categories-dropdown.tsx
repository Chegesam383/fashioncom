"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, Search } from "lucide-react"; // Import Search icon

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getCategories } from "@/actions/categoryActions";
import { ProductCategory, ProductSubcategory } from "@/lib/types";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input"; // Import Input component
import { getSubcategoriesByCategoryId } from "@/actions/subCategoryActions";

export default function CategoryDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [dropdownTop, setDropdownTop] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [categories, setCategories] = useState<ProductCategory[] | null>(null);
  const [subCategories, setSubCategories] = useState<
    ProductSubcategory[] | undefined
  >(undefined);

  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [subCategoriesLoading, setSubCategoriesLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState(""); // Add search query state

  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      const categories = await getCategories();
      setCategories(categories);
      setCategoriesLoading(false);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!activeCategory) {
      setSubCategories(undefined);
      return;
    }

    const fetchsubCategories = async () => {
      setSubCategoriesLoading(true);
      const subCategory = await getSubcategoriesByCategoryId(activeCategory);
      setSubCategories(subCategory || undefined);
      setSubCategoriesLoading(false);
    };
    fetchsubCategories();
  }, [activeCategory]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownTop(rect.bottom);
    }
  }, [isOpen]);

  const filteredCategories =
    categories?.filter((category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || []; // Filter categories based on search query

  return (
    <div className="relative">
      <Button
        ref={buttonRef}
        variant="outline"
        className="w-full justify-between bg-slate-900 text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>All Categories</span>
        {isOpen ? (
          <ChevronUp className="ml-2 h-4 w-4" />
        ) : (
          <ChevronDown className="ml-2 h-4 w-4" />
        )}
      </Button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="fixed left-0 right-0 z-50 bg-background shadow-lg transition-all lg:container mx-auto p-2 lg:p-6 rounded-2xl duration-200 ease-in-out text-white"
          style={{ top: `${dropdownTop}px` }}
        >
          <div className="mx-auto max-w-7xl">
            <div className="flex">
              <div className="w-64 border-r bg-background">
                <div className="p-2">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Search categories..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pr-10"
                    />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <ScrollArea className="h-[45vh]">
                  {categoriesLoading ? (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="animate-spin h-6 w-6" />
                    </div>
                  ) : filteredCategories.length > 0 ? ( // Use filteredCategories
                    <ul className="py-1">
                      {filteredCategories.map(
                        (
                          category // Use filteredCategories
                        ) => (
                          <li
                            key={category.id}
                            className={cn(
                              "group relative",
                              activeCategory === category.id && "bg-muted"
                            )}
                            onMouseEnter={() => setActiveCategory(category.id)}
                          >
                            <Link
                              href={"shop?category=" + category.slug}
                              className="flex items-center justify-between px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/50"
                            >
                              <span>{category.name}</span>
                            </Link>
                          </li>
                        )
                      )}
                    </ul>
                  ) : (
                    <div className="flex items-center justify-center p-4">
                      No categories found.
                    </div>
                  )}
                </ScrollArea>
              </div>

              <div className="min-h-[250px] w-full bg-background p-4">
                <ScrollArea className="h-[45vh]">
                  {subCategoriesLoading ? (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="animate-spin h-6 w-6" />
                    </div>
                  ) : activeCategory !== null &&
                    subCategories &&
                    subCategories.length > 0 ? (
                    <div>
                      <h3 className="mb-2 text-lg font-semibold">
                        {categories &&
                          categories.find((c) => c.id === activeCategory)?.name}
                      </h3>
                      <div className="grid grid-cols-1 gap-2 md:grid-cols-3 overflow-x-auto">
                        {subCategories &&
                          subCategories?.map((subcategory) => (
                            <Link
                              key={subcategory.id}
                              href={"shop?subcategory=" + subcategory.slug}
                              className="rounded-md p-2 text-sm transition-colors hover:bg-muted"
                            >
                              {subcategory.name}
                            </Link>
                          ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center p-4">
                      {activeCategory && "No subcategories found."}
                    </div>
                  )}
                </ScrollArea>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
