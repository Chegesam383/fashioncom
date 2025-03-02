// actions/cart-actions.ts
"use server";

import { db } from "@/db";
import { cart, products } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { eq, and } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

export async function addToCartAction(
  productId: string,
  attributes: Record<string, string>,
  quantity: number
) {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  //user_2tcPVO1OWHLtqUuDFSxHDe8m532

  try {
    await db
      .insert(cart)
      .values({
        userId: "3c7f70a0-3d18-451b-aa1c-e15f805dfdd7",
        productId: productId,
        attributes: attributes,
        quantity: quantity,
      })
      .onConflictDoUpdate({
        target: [cart.userId, cart.productId, cart.attributes],
        set: { quantity: quantity },
      });
    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.error("Error adding to cart:", error);
    return { success: false, error: "Failed to add to cart" };
  }
}

export async function updateCartItemAction(
  productId: string,
  attributes: Record<string, string>,
  quantity: number
) {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await db
      .update(cart)
      .set({ quantity: quantity })
      .where(
        and(
          eq(cart.userId, "3c7f70a0-3d18-451b-aa1c-e15f805dfdd7"),
          eq(cart.productId, productId),
          eq(cart.attributes, attributes)
        )
      );
    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.error("Error updating cart item:", error);
    return { success: false, error: "Failed to update cart item" };
  }
}

export async function removeFromCartAction(
  productId: string,
  attributes: Record<string, string>
) {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await db
      .delete(cart)
      .where(
        and(
          eq(cart.userId, "3c7f70a0-3d18-451b-aa1c-e15f805dfdd7"),
          eq(cart.productId, productId),
          eq(cart.attributes, attributes)
        )
      );
    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.error("Error removing cart item:", error);
    return { success: false, error: "Failed to remove cart item" + error };
  }
}

export async function getCartItemsAction() {
  const { userId } = await auth();
  if (!userId) {
    return null;
  }

  try {
    const cartWithProducts = await db
      .select({
        productId: cart.productId,
        attributes: cart.attributes,
        quantity: cart.quantity,

        name: products.name,
        price: products.price,
        imageUrls: products.imageUrls,
      })
      .from(cart)
      .leftJoin(products, eq(cart.productId, products.id))
      .where(eq(cart.userId, userId));

    const cartItemsWithProducts = cartWithProducts.map((item) => ({
      productId: item.productId,
      attributes: item.attributes,
      quantity: item.quantity,
      name: item.name,
      price: item.price,
      imageUrls: item.imageUrls,
    }));

    return cartItemsWithProducts;
  } catch (error) {
    console.error("Error getting cart items with products:", error);
    return null;
  }
}

export async function clearCartAction() {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await db
      .delete(cart)
      .where(eq(cart.userId, "3c7f70a0-3d18-451b-aa1c-e15f805dfdd7"));
    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.error("Error clearing cart:", error);
    return { success: false, error: "Failed to clear cart" };
  }
}
