"use server";
import { db } from "@/db";
import { products, productCategories } from "@/db/schema";
import { Product } from "@/lib/types";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getProducts() {
  try {
    return db
      .select({
        id: products.id,
        name: products.name,
        price: products.price,
        description: products.description,
        imageUrls: products.imageUrls,
        category: productCategories.name,
        rating: products.rating,
        attributes: products.attributes,
      })
      .from(products)
      .leftJoin(
        productCategories,
        eq(products.categoryId, productCategories.id)
      );
  } catch (error) {
    console.log("Error fetching products:", error);
    return undefined;
  }
}

export async function getProductById(id: string): Promise<Product | undefined> {
  try {
    const product = await db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        price: products.price,
        imageUrls: products.imageUrls,
        category: productCategories.name,
        subcategories: products.subcategories,
        brand: products.brand,
        stock: products.stock,
        rating: products.rating,
        isActive: products.isActive,
        attributes: products.attributes,
      })
      .from(products)
      .leftJoin(
        productCategories,
        eq(products.categoryId, productCategories.id)
      )
      .where(eq(products.id, id))
      .limit(1);

    if (product.length > 0) {
      return {
        ...product[0],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        attributes: product[0].attributes as Record<string, any>,
      };
    } else {
      return undefined; // Product not found
    }
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return undefined; // Return undefined on error
  }
}

export async function addProduct(formData: FormData) {
  const name = formData.get("name") as string;
  const price = formData.get("price") as string;
  const imageUrls = formData.get("imageUrls") as string;

  await db.insert(products).values({
    name,
    price,
    imageUrls: imageUrls.split(","),
  });

  revalidatePath("/products");
}
