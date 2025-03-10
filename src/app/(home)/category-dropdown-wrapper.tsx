"use client";

import CategoryDropdown from "@/components/shared/categories-dropdown";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export default function CategoryDropdownWrapper() {
  return (
    <NuqsAdapter>
      <CategoryDropdown />
    </NuqsAdapter>
  );
}
