"use server";
import { db } from "@/db";
import { productSubcategories } from "@/db/schema";
import { ProductSubcategory } from "@/lib/types";
import { eq } from "drizzle-orm";
export async function getsubCategories(): Promise<ProductSubcategory[]> {
  try {
    const subCategories = await db.select().from(productSubcategories);
    return subCategories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}
export async function getSubcategoryById(id: string) {
  try {
    const subcategory = await db
      .select()
      .from(productSubcategories)
      .where(eq(productSubcategories.id, id))
      .limit(1);

    if (subcategory.length > 0) {
      return subcategory[0];
    } else {
      return undefined;
    }
  } catch (error) {
    console.error("Error fetching subcategory by ID:", error);
    return undefined;
  }
}

export async function getSubcategoriesByCategoryId(categoryId: string) {
  try {
    const subcategory = await db
      .select()
      .from(productSubcategories)
      .where(eq(productSubcategories.categoryId, categoryId));

    if (subcategory.length > 0) {
      return subcategory;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching subcategory by ID:", error);
    return undefined;
  }
}

export async function getSubcategoryBySlug(
  slug: string
): Promise<ProductSubcategory | null> {
  try {
    const result = await db
      .select()
      .from(productSubcategories)
      .where(eq(productSubcategories.slug, slug))
      .limit(1)
      .then((rows) => rows[0] || null);
    return result;
  } catch (error) {
    console.error("Error fetching subcategory by slug:", error);
    return null;
  }
}
