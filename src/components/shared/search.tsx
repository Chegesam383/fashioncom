"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { getProductsBySearchTerm } from "@/actions/productActions";
import { getCategoriesBySearchTerm } from "@/actions/categoryActions";
import { ProductCategory } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

export interface ProductWithCategory {
  id: string;
  name: string;
  description?: string | undefined | null;
  price: string;
  imageUrls: string[] | null;
  categoryId?: string;
  subcategories?: string[]; // Or whatever type your subcategories are
  categorySlug?: string;
  categoryImage?: string;
  categoryName?: string;
  attributes?: Record<string, string>;
  // ... other properties specific to your product
}

export default function SearchBox() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<ProductWithCategory[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const minProductsForCategory = 2;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    setIsDropdownOpen(term.length > 0);
  };

  useEffect(() => {
    if (searchTerm) {
      setIsSearching(true);

      async function fetchData() {
        try {
          const fetchedCategories = await getCategoriesBySearchTerm(searchTerm);
          setCategories(fetchedCategories);

          if (fetchedCategories.length === 0) {
            const fetchedProducts = await getProductsBySearchTerm(searchTerm);
            setProducts(fetchedProducts);
          } else {
            setProducts([]);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          setProducts([]);
          setCategories([]);
        } finally {
          setIsSearching(false);
        }
      }

      fetchData();
    } else {
      setProducts([]);
      setCategories([]);
      setIsSearching(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <Input
        className="peer pe-9 ps-9 border shadow-none rounded-lg text-white"
        placeholder="I am looking for..."
        type="search"
        value={searchTerm}
        onChange={handleInputChange}
      />
      <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
        <Search size={16} strokeWidth={2} />
      </div>
      {isDropdownOpen && (
        <div
          ref={dropdownRef}
          className="absolute left-0 right-0 mt-1 bg-muted border rounded-md shadow-md z-10"
        >
          <ScrollArea className="max-h-[60vh]">
            {isSearching && (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="animate-spin h-6 w-6 text-white" />
              </div>
            )}
            {searchTerm && !isSearching && (
              <div>
                {categories.length > 0 ? (
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground p-3">
                      Categories
                    </h3>
                    <div className="">
                      {categories.map((category) => (
                        <Link
                          key={category.slug}
                          href={`/category/${category.slug}`}
                          className="flex items-center space-x-2 p-2 m-1 rounded-md hover:bg-muted-foreground/10"
                        >
                          {category.imageUrl && (
                            <Image
                              src={category.imageUrl || "/placeholder.png"}
                              alt={`Category ${category.name} image`} // Added alt attribute
                              width={30}
                              height={30}
                              className="rounded-md object-cover"
                            />
                          )}
                          <span className="text-white text-sm">
                            {searchTerm}{" "}
                            <span className="text-muted-foreground">
                              in {category.name}
                            </span>
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : products.length > 0 ? (
                  <div>
                    {products.length >= minProductsForCategory ? (
                      <div>
                        {Array.from(
                          new Set(products.map((product) => product.categoryId))
                        ).map((categoryId) => {
                          const category = products.find(
                            (product) => product.categoryId === categoryId
                          );
                          if (!category) return null;

                          return (
                            <Link
                              key={categoryId}
                              href={`category/${category.categoryId}?q=${searchTerm}`}
                              className="flex items-center space-x-4 p-3 cursor-pointer hover:bg-muted-foreground/10 rounded-md"
                            >
                              <Image
                                src={
                                  category.categoryImage
                                    ? category.categoryImage
                                    : "/placeholder.png"
                                }
                                alt={`Category ${category.categoryName} image`} // Added alt attribute
                                width={50}
                                height={50}
                                className="rounded-md object-cover"
                              />
                              <div className="flex flex-col">
                                <span className="text-white">
                                  {category.categoryName}
                                </span>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    ) : (
                      <div>
                        {products.map((product) => (
                          <Link
                            key={product.id}
                            href={`product/${product.id}`}
                            className="flex items-center space-x-4 p-3 cursor-pointer hover:bg-muted-foreground/10 rounded-md"
                          >
                            <Image
                              src={
                                product.imageUrls
                                  ? product.imageUrls[0]
                                  : "/placeholder-image.jpg"
                              }
                              alt={`Product ${product.name} image`} // Added alt attribute
                              width={50}
                              height={50}
                              className="rounded-md object-cover"
                            />
                            <div className="flex flex-col">
                              <span className="text-white">
                                {product.name}
                                <span className="text-muted-foreground">
                                  &nbsp; in {product.categorySlug}
                                </span>
                              </span>
                              <span className="text-sm text-muted-foreground">
                                ${product.price}
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            )}
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
