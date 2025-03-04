"use server";

import { db } from "@/db";
import { asc, eq } from "drizzle-orm";
import { productCategories, productSubcategories } from "@/db/schema";
import { CategoryWithSubcategories, ProductCategory } from "@/lib/types";
import { ilike, or } from "drizzle-orm"; // Import 'or'

export async function getCategories(): Promise<ProductCategory[]> {
  try {
    const categories = await db.select().from(productCategories);
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function getCategoriesBySearchTerm(
  searchTerm: string
): Promise<ProductCategory[]> {
  try {
    const results = await db
      .select({
        id: productCategories.id,
        name: productCategories.name,
        slug: productCategories.slug,
        imageUrl: productCategories.imageUrl,
        description: productCategories.description, // Select description too
      })
      .from(productCategories)
      .where(
        or(
          ilike(productCategories.name, `%${searchTerm}%`),
          ilike(productCategories.description, `%${searchTerm}%`)
        )
      )
      .limit(10);

    return results as ProductCategory[];
  } catch (error) {
    console.error("Error fetching categories by search term:", error);
    return [];
  }
}

export async function getCategoryBySlug(
  slug: string
): Promise<ProductCategory | null> {
  try {
    const result = await db
      .select()
      .from(productCategories)
      .where(eq(productCategories.slug, slug))
      .limit(1)
      .then((rows) => rows[0] || null);
    return result;
  } catch (error) {
    console.error("Error fetching category by slug:", error);
    return null;
  }
}
export async function getCategoriesWithSubcategories(): Promise<
  CategoryWithSubcategories[]
> {
  try {
    const results = await db

      .select({
        category: productCategories,

        subcategory: productSubcategories,
      })

      .from(productCategories)

      .leftJoin(
        productSubcategories,

        eq(productCategories.id, productSubcategories.categoryId)
      )

      .orderBy(asc(productCategories.name), asc(productSubcategories.name));

    const categoryMap = new Map<string, CategoryWithSubcategories>();

    results.forEach((row) => {
      const category = row.category;

      const subcategory = row.subcategory;

      if (!categoryMap.has(category.id)) {
        categoryMap.set(category.id, {
          ...category,

          subcategories: subcategory ? [subcategory] : [],
        });
      } else if (subcategory) {
        const existingCategory = categoryMap.get(category.id)!;
        if (!existingCategory.subcategories) {
          existingCategory.subcategories = [];
        }

        existingCategory.subcategories = [
          ...existingCategory.subcategories,

          subcategory,
        ];
      }
    });

    return Array.from(categoryMap.values());
  } catch (error) {
    console.error("Error fetching categories with subcategories:", error);

    return [];
  }
}
