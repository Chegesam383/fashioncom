// "use client";

// import { Slider } from "@/components/ui/slider";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Button } from "@/components/ui/button";
// import {
//   Sheet,
//   SheetContent,
//   SheetDescription,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/components/ui/sheet";
// import { Input } from "@/components/ui/input";
// import { SlidersHorizontal } from "lucide-react";
// import RatingFilter from "@/components/rating/rating-filter";
// import React, { useState, useMemo } from "react";
// import { Product } from "@/lib/types";

// export const Filters = ({ products }: { products: Product[] | undefined }) => {
//   const [range, setRange] = useState<number[]>([0, 100]);
//   const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
//   const [selectedColors, setSelectedColors] = useState<string[]>([]);
//   const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
//   const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(
//     []
//   );
//   const [minRating, setMinRating] = useState(0);

//   const availableSizes = useMemo(() => {
//     if (!products) return [];
//     const allSizes = products.flatMap((p) => p.sizes || []);
//     return [...new Set(allSizes)].sort();
//   }, [products]);

//   const availableColors = useMemo(() => {
//     if (!products) return [];
//     const allColors = products.map((p) => p.color).filter(Boolean) as string[];
//     return [...new Set(allColors)].sort();
//   }, [products]);

//   const availableCategories = useMemo(() => {
//     if (!products) return [];
//     const allCategories = products
//       .map((p) => p.category.name)
//       .filter(Boolean) as string[];
//     return [...new Set(allCategories)].sort();
//   }, [products]);

//   const availableSubcategories = useMemo(() => {
//     if (!products) return [];
//     const allSubcategories = products
//       .map((p) => p.subcategory?.name)
//       .filter(Boolean) as string[];
//     return [...new Set(allSubcategories)].sort();
//   }, [products]);

//   const handleSizeToggle = (size: string) => {
//     setSelectedSizes((prev) =>
//       prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
//     );
//   };

//   const handleColorToggle = (color: string) => {
//     setSelectedColors((prev) =>
//       prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
//     );
//   };
//   const handleCategoryToggle = (category: string) => {
//     setSelectedCategories((prev) =>
//       prev.includes(category)
//         ? prev.filter((c) => c !== category)
//         : [...prev, category]
//     );
//   };
//   const handleSubcategoryToggle = (subcategory: string) => {
//     setSelectedSubcategories((prev) =>
//       prev.includes(subcategory)
//         ? prev.filter((c) => c !== subcategory)
//         : [...prev, subcategory]
//     );
//   };

//   const handleRatingChange = (rating: number) => {
//     setMinRating(rating);
//   };

//   if (!products) {
//     return <div>Loading filters...</div>;
//   }

//   const minPrice = Math.min(...products.map((p) => p.price));
//   const maxPrice = Math.max(...products.map((p) => p.price));

//   useEffect(() => {
//     setRange([minPrice, maxPrice]);
//   }, [products]);

//   return (
//     <div className="w-56 space-y-6 pt-2">
//       {/* Categories */}
//       <div>
//         <h3 className="text-sm font-medium mb-2">Categories</h3>
//         <div className="space-y-2">
//           {availableCategories.map((category) => (
//             <div key={category} className="flex items-center">
//               <Checkbox
//                 id={`cat-${category}`}
//                 checked={selectedCategories.includes(category)}
//                 onCheckedChange={() => handleCategoryToggle(category)}
//               />
//               <label htmlFor={`cat-${category}`} className="ml-2 text-sm">
//                 {category}
//               </label>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Subcategories */}
//       <div>
//         <h3 className="text-sm font-medium mb-2">Subcategories</h3>
//         <div className="space-y-2">
//           {availableSubcategories.map((subcategory) => (
//             <div key={subcategory} className="flex items-center">
//               <Checkbox
//                 id={`sub-${subcategory}`}
//                 checked={selectedSubcategories.includes(subcategory)}
//                 onCheckedChange={() => handleSubcategoryToggle(subcategory)}
//               />
//               <label htmlFor={`sub-${subcategory}`} className="ml-2 text-sm">
//                 {subcategory}
//               </label>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Price Range */}
//       <div>
//         <h3 className="text-sm font-medium mb-2">Price Range</h3>
//         <div className="space-y-4">
//           <Slider
//             value={range}
//             min={minPrice}
//             max={maxPrice}
//             step={1}
//             minStepsBetweenThumbs={1}
//             className="w-full"
//             onValueChange={setRange}
//           />
//           <div className="flex gap-4">
//             <Input
//               type="number"
//               placeholder="Min"
//               onChange={(e) => setRange([Number(e.target.value), range[1]])}
//               value={range[0]}
//             />
//             <Input
//               type="number"
//               placeholder="Max"
//               onChange={(e) => setRange([range[0], Number(e.target.value)])}
//               value={range[1]}
//             />
//           </div>
//         </div>
//       </div>

//       {/* Size Filter */}
//       <div>
//         <h3 className="text-sm font-medium mb-2">Size</h3>
//         <div className="grid grid-cols-3 gap-2">
//           {availableSizes.map((size) => (
//             <Button
//               key={size}
//               variant="outline"
//               size="sm"
//               onClick={() => handleSizeToggle(size)}
//               className={selectedSizes.includes(size) ? "bg-muted" : ""}
//             >
//               {size}
//             </Button>
//           ))}
//         </div>
//       </div>

//       {/* Color Filter */}
//       <div>
//         <h3 className="text-sm font-medium mb-2">Color</h3>
//         <div className="space-y-2">
//           {availableColors.map((color) => (
//             <div key={color} className="flex items-center">
//               <Checkbox
//                 id={`color-${color}`}
//                 checked={selectedColors.includes(color)}
//                 onCheckedChange={() => handleColorToggle(color)}
//               />
//               <label htmlFor={`color-${color}`} className="ml-2 text-sm">
//                 {color}
//               </label>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Rating Filter */}
//       <div>
//         <h3 className="text-sm font-medium mb-2">Minimum Rating</h3>
//         <div className="flex flex-col gap-2">
//           <RatingFilter onRatingChange={handleRatingChange} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export const MobileFilters = ({
//   products,
// }: {
//   products: Product[] | undefined;
// }) => (
//   <div className="md:hidden">
//     <Sheet>
//       <SheetTrigger asChild>
//         <Button variant="outline" className="w-full">
//           <SlidersHorizontal className="mr-2 h-4 w-4" />
//           Filters
//         </Button>
//       </SheetTrigger>
//       <SheetContent side="left" className="w-[300px]">
//         <SheetHeader>
//           <SheetTitle>Filters</SheetTitle>
//           <SheetDescription>Adjust your product filters</SheetDescription>
//         </SheetHeader>

//         {products && <Filters products={products} />}
//       </SheetContent>
//     </Sheet>
//   </div>
// );
