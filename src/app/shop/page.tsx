"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { SlidersHorizontal } from "lucide-react";
import Rating from "@/components/ratings";
import { products } from "@/lib/fakedata";
import ProductCard from "@/components/product-card";

const categories = [
  {
    id: 1,
    name: "Clothing",
    subcategories: ["T-Shirts", "Jeans", "Dresses", "Jackets"],
  },
  {
    id: 2,
    name: "Accessories",
    subcategories: ["Bags", "Jewelry", "Watches", "Belts"],
  },
  {
    id: 3,
    name: "Shoes",
    subcategories: ["Sneakers", "Boots", "Sandals", "Formal"],
  },
];

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
const colors = [
  { name: "Black", value: "black" },
  { name: "White", value: "white" },
  { name: "Red", value: "red" },
  { name: "Blue", value: "blue" },
  { name: "Green", value: "green" },
];

export default function ShopPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Mobile Filter Button */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px]">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>Adjust your product filters</SheetDescription>
              </SheetHeader>
              {/* Mobile Filters */}
              <div className="mt-4 space-y-6">
                {/* Category Filter */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Category</h3>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={"category.name"}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Subcategories */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Subcategories</h3>
                  <div className="space-y-2">
                    {categories[0].subcategories.map((sub) => (
                      <div key={sub} className="flex items-center">
                        <Checkbox id={`mobile-sub-${sub}`} />
                        <label
                          htmlFor={`mobile-sub-${sub}`}
                          className="ml-2 text-sm"
                        >
                          {sub}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Price Range</h3>
                  <div className="space-y-4">
                    <Slider
                      defaultValue={[0, 200]}
                      min={0}
                      max={200}
                      step={1}
                    />
                    <div className="flex gap-4">
                      <Input type="number" placeholder="Min" />
                      <Input type="number" placeholder="Max" />
                    </div>
                  </div>
                </div>

                {/* Size Filter */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Size</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {sizes.map((size) => (
                      <Button key={size} variant="outline" size="sm">
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Color Filter */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Color</h3>
                  <div className="space-y-2">
                    {colors.map((color) => (
                      <div key={color.value} className="flex items-center">
                        <Checkbox id={`mobile-color-${color.value}`} />
                        <label
                          htmlFor={`mobile-color-${color.value}`}
                          className="ml-2 text-sm"
                        >
                          {color.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rating Filter */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Minimum Rating</h3>
                  <div className="flex flex-col gap-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div className="flex gap-4 items-center" key={rating}>
                        <Rating long rating={rating} />{" "}
                        <small className="text-muted-foreground">
                          {rating} star
                        </small>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Filters */}
        <div className="hidden md:block w-64 space-y-6">
          {/* Category Filter */}
          <div>
            <h3 className="text-sm font-medium mb-2">Category</h3>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={"category.name"}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subcategories */}
          <div>
            <h3 className="text-sm font-medium mb-2">Subcategories</h3>
            <div className="space-y-2">
              {categories[0].subcategories.map((sub) => (
                <div key={sub} className="flex items-center">
                  <Checkbox id={`sub-${sub}`} />
                  <label htmlFor={`sub-${sub}`} className="ml-2 text-sm">
                    {sub}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="text-sm font-medium mb-2">Price Range</h3>
            <div className="space-y-4">
              <Slider defaultValue={[0, 200]} min={0} max={200} step={1} />
              <div className="flex gap-4">
                <Input type="number" placeholder="Min" />
                <Input type="number" placeholder="Max" />
              </div>
            </div>
          </div>

          {/* Size Filter */}
          <div>
            <h3 className="text-sm font-medium mb-2">Size</h3>
            <div className="grid grid-cols-3 gap-2">
              {sizes.map((size) => (
                <Button key={size} variant="outline" size="sm">
                  {size}
                </Button>
              ))}
            </div>
          </div>

          {/* Color Filter */}
          <div>
            <h3 className="text-sm font-medium mb-2">Color</h3>
            <div className="space-y-2">
              {colors.map((color) => (
                <div key={color.value} className="flex items-center">
                  <Checkbox id={`color-${color.value}`} />
                  <label
                    htmlFor={`color-${color.value}`}
                    className="ml-2 text-sm"
                  >
                    {color.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Rating Filter */}
          <div>
            <h3 className="text-sm font-medium mb-2">Minimum Rating</h3>
            <div className="flex flex-col gap-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div className="flex gap-4 items-center" key={rating}>
                  <Rating long rating={rating} />{" "}
                  <small className="text-muted-foreground">{rating} star</small>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold">Products</h2>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, i) => (
              <ProductCard product={product} key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
