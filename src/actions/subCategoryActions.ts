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
