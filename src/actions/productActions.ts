"use server";
import { db } from "@/db";
import { products, productCategories } from "@/db/schema";
import { Product } from "@/lib/types";
import { revalidatePath } from "next/cache";

import { eq, lt, gte, sql, SQL, and, ilike, or } from "drizzle-orm";

interface ProductFilters {
  categoryId: string;
  priceLt?: number;
  priceGte?: number;
}

export async function getProducts(
  filters: ProductFilters = { categoryId: "" }
) {
  try {
    const whereClauses: SQL<unknown>[] = [];

    if (filters.categoryId) {
      whereClauses.push(eq(products.categoryId, filters.categoryId));
    }

    if (filters.priceLt) {
      whereClauses.push(
        lt(sql<number>`CAST(${products.price} AS REAL)`, filters.priceLt)
      );
    }

    if (filters.priceGte) {
      whereClauses.push(
        gte(sql<number>`CAST(${products.price} AS REAL)`, filters.priceGte)
      );
    }

    let query = db.select().from(products);

    if (whereClauses.length > 0) {
      query = query.where(and(...whereClauses)) as typeof query;
    }

    return await query;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
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

export async function getProductsBySearchTerm(
  searchTerm: string
): Promise<Product[]> {
  try {
    const results = await db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        price: products.price,
        imageUrls: products.imageUrls,
        categoryId: products.categoryId,
        subcategories: products.subcategories,
        categorySlug: productCategories.slug,
        categoryImage: productCategories.imageUrl,
        categoryName: productCategories.name,
        attributes: products.attributes,
      })
      .from(products)
      .leftJoin(
        productCategories,
        eq(products.categoryId, productCategories.id)
      )
      .where(
        or(
          ilike(products.name, `%${searchTerm}%`),
          ilike(products.description, `%${searchTerm}%`)
        )
      )
      .limit(10);

    return results;
  } catch (error) {
    console.error("Error fetching products by search term:", error);
    return [];
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
