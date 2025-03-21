"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getCategoriesWithSubcategories } from "@/actions/categoryActions";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CategoryWithSubcategories } from "@/lib/types";

export default function CategoryDropdown({
  isNotOutline = false,
}: {
  isNotOutline?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [dropdownTop, setDropdownTop] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [categories, setCategories] = useState<
    CategoryWithSubcategories[] | []
  >([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      const categories = await getCategoriesWithSubcategories();

      setCategories(categories);
      setCategoriesLoading(false);
    };
    fetchCategories();
  }, []);

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

  const filteredCategories = useMemo(() => {
    return (
      categories?.filter((category) =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) || []
    );
  }, [categories, searchQuery]);

  const handleCategoryClick = (slug: string) => {
    router.push(`/shop?category=${slug}`);
    setIsOpen(false);
  };

  const handleSubcategoryClick = (
    categorySlug: string,
    subcategorySlug: string
  ) => {
    router.push(
      `/shop?category=${categorySlug}&subcategories=${subcategorySlug}`
    );
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button
        size={"sm"}
        ref={buttonRef}
        variant={isNotOutline ? "ghost" : "outline"}
        className="w-full justify-between px-2 py-0 text-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>All Categories</span>
        {isOpen ? (
          <ChevronUp className=" h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </Button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="border bg-muted fixed left-0 right-0 z-50 mt-[12px]  shadow-lg transition-all container lg:mx-auto ml-3 rounded-xl duration-200 ease-in-out text-current"
          style={{ top: `${dropdownTop}px` }}
        >
          <div>
            <div className="lg:flex">
              <div className="min-w-64 border-r bg-background rounded-l-xl rounded-r-xl lg:rounded-r-none">
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
                <ScrollArea className="h-[65vh]">
                  {categoriesLoading ? (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="animate-spin h-6 w-6" />
                    </div>
                  ) : filteredCategories.length > 0 ? (
                    <ul className="py-1 ">
                      {filteredCategories.map((category) => (
                        <li
                          key={category.id}
                          className={cn(
                            "group relative",
                            activeCategory === category.slug && "bg-muted"
                          )}
                          onMouseEnter={() => setActiveCategory(category.slug)}
                        >
                          <Button
                            variant="link"
                            className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/50"
                            onClick={() => handleCategoryClick(category.slug)}
                          >
                            <span>{category.name}</span>
                          </Button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="flex items-center justify-center p-4"></div>
                  )}
                </ScrollArea>
              </div>

              <div className="hidden lg:block min-h-[250px] w-full bg-background p-4 rounded-r-xl">
                <ScrollArea className="h-[45vh] lg:h-[65vh]">
                  {activeCategory && (
                    <div>
                      <h3 className="mb-2 text-lg font-semibold ">
                        {categories &&
                          categories.find((c) => c.slug === activeCategory)
                            ?.name}
                      </h3>
                      <div className="grid grid-cols-1 gap-2 md:grid-cols-3 overflow-x-auto">
                        {categories
                          ?.find((c) => c.slug === activeCategory)
                          ?.subcategories?.map((subcategory) => (
                            <div
                              key={subcategory.id}
                              className="rounded-md p-2 text-sm transition-colors hover:bg-muted"
                              onClick={() =>
                                handleSubcategoryClick(
                                  activeCategory,
                                  subcategory.slug
                                )
                              }
                            >
                              {subcategory.name}
                            </div>
                          ))}
                      </div>
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
