"use client";

import type React from "react";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Loader2, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getProductsBySearchTerm } from "@/actions/productActions";
import { getCategoriesBySearchTerm } from "@/actions/categoryActions";
import type { ProductCategory } from "@/lib/types";
import Image from "next/image";
import { debounce } from "lodash";
import { Input } from "@/components/ui/input";

import {
  Command,
  CommandEmpty,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useRouter } from "next/navigation";

export interface ProductWithCategory {
  id: string;
  name: string;
  description?: string | undefined | null;
  price: string;
  imageUrls: string[] | null;
  categoryId?: string;
  subcategories?: string[];
  categorySlug?: string;
  categoryImage?: string;
  categoryName?: string;
  attributes?: Record<string, string>;
}

export default function SearchWithDropdown() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<ProductWithCategory[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();
  // const minProductsForCategory = 2;

  const debouncedSearch = useCallback(
    debounce(async (term: string) => {
      if (term) {
        setIsSearching(true);
        try {
          const fetchedCategories = await getCategoriesBySearchTerm(term);
          setCategories(fetchedCategories);

          if (fetchedCategories.length === 0) {
            const fetchedProducts = await getProductsBySearchTerm(term);
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
      } else {
        setProducts([]);
        setCategories([]);
        setIsSearching(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm, debouncedSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (url: string) => {
    router.push(url);
    setShowDropdown(false);
  };

  const renderResults = () => {
    if (isSearching) {
      return (
        <div className="flex items-center justify-center p-4">
          <Loader2 className="animate-spin h-6 w-6 text-white" />
        </div>
      );
    }

    if (!searchTerm) return null;

    if (categories.length > 0) {
      return categories.map((category) => (
        <CommandItem
          key={category.slug}
          onSelect={() =>
            handleSelect(`shop?category=${category.slug}&q=${searchTerm}`)
          }
          className="flex items-center space-x-2 p-2 m-1 rounded-md hover:bg-muted-foreground/10"
        >
          {category.imageUrl && (
            <Image
              src={category.imageUrl || "/placeholder.png"}
              alt={`Category ${category.name} image`}
              width={30}
              height={30}
              className="rounded-md object-cover"
            />
          )}
          <span className="text-white text-sm">
            &quot;{searchTerm}&quot;
            <span className="text-muted-foreground">
              &nbsp; in &nbsp;{category.name}
            </span>
          </span>
        </CommandItem>
      ));
    }

    if (products.length > 0) {
      return products.map((product) => (
        <CommandItem
          key={product.id}
          onSelect={() => handleSelect(`product/${product.id}`)}
          className="flex items-center space-x-4 p-3 cursor-pointer hover:bg-muted-foreground/10 rounded-md"
        >
          <Image
            src={
              product.imageUrls && product.imageUrls.length > 0
                ? product.imageUrls[0]
                : "/placeholder.png"
            }
            alt={`Product ${product.name} image`}
            width={50}
            height={50}
            className="rounded-md object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.png";
            }}
          />
          <div className="flex flex-col">
            <span className="text-white">{product.name}</span>
            <span className="text-sm text-muted-foreground">
              ${product.price}
            </span>
          </div>
        </CommandItem>
      ));
    }

    if (
      searchTerm &&
      !isSearching &&
      categories.length === 0 &&
      products.length === 0
    ) {
      return (
        <div className="p-4 text-center text-muted-foreground">
          No results found for &quot;{searchTerm}&quot;
        </div>
      );
    }

    return null;
  };

  return (
    <div className="relative w-full max-w-md mx-auto" ref={dropdownRef}>
      <div className="relative">
        <Input
          className="bg-muted peer pe-9 ps-9 border shadow-none rounded-lg text-white"
          placeholder="I am looking for..."
          type="search"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowDropdown(e.target.value.length > 0);
          }}
          aria-expanded={showDropdown}
          aria-controls="search-results"
          aria-autocomplete="list"
        />
        <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
          <Search size={16} strokeWidth={2} />
        </div>
        {searchTerm && (
          <button
            type="button"
            onClick={() => {
              setSearchTerm("");
              setShowDropdown(false);
            }}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground/80 hover:text-muted-foreground"
            aria-label="Clear search"
          >
            <X size={16} strokeWidth={2} />
          </button>
        )}
      </div>

      {showDropdown && (
        <div
          className="absolute left-0 right-0 z-10 mt-1 bg-muted border rounded-md shadow-md max-h-[60vh] overflow-hidden"
          id="search-results"
        >
          <Command>
            <CommandList>
              <ScrollArea className="max-h-[55vh]">
                {renderResults()}
              </ScrollArea>
              <CommandEmpty>No results found.</CommandEmpty>
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
}
