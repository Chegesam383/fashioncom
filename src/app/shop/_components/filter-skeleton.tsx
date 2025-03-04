"use client";

import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export const FiltersSkeleton = () => {
  return (
    <div className="w-56 space-y-6 pt-2">
      {/* Subcategories/Categories Skeleton */}
      <div>
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-center">
              <Skeleton className="h-4 w-4 rounded-sm" />
              <Skeleton className="ml-2 h-4 w-20" />
            </div>
          ))}
        </div>
      </div>

      {/* Price Range Skeleton */}
      <div>
        <h3 className="text-sm font-medium mb-2">
          <Skeleton className="h-4 w-24" />
        </h3>
        <div className="space-y-4">
          <Skeleton className="h-6 w-full" />
          <div className="flex gap-4">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </div>

      {/* Attributes Skeleton */}
      <div>
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index}>
            <h3 className="text-sm font-medium mb-2">
              <Skeleton className="h-4 w-20" />
            </h3>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 4 }).map((__, buttonIndex) => (
                <Skeleton key={buttonIndex} className="h-8 w-16 rounded-md" />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Rating Filter Skeleton */}
      <div>
        <h3 className="text-sm font-medium mb-2">
          <Skeleton className="h-4 w-32" />
        </h3>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-full" />
        </div>
      </div>
    </div>
  );
};
