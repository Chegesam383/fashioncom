"use server";
import { db } from "@/db";
import { productCategories } from "@/db/schema";
import { ProductCategory } from "@/lib/types";
export async function getCategories(): Promise<ProductCategory[]> {
  try {
    const categories = await db.select().from(productCategories);
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}
