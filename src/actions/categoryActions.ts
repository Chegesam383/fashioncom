"use server";
import { db } from "@/db/index";
import { productCategories } from "@/db/schema";
import { Category } from "@/lib/types";
export async function getCategories(): Promise<Category[]> {
  try {
    const categories = await db.select().from(productCategories);
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}
