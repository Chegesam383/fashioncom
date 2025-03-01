// actions/cart-actions.ts
"use server";

import { db } from "@/db";
import { cart } from "@/db/schema";
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

  try {
    await db
      .insert(cart)
      .values({
        userId: userId,
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
          eq(cart.userId, userId),
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
          eq(cart.userId, userId),
          eq(cart.productId, productId),
          eq(cart.attributes, attributes)
        )
      );
    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.error("Error removing cart item:", error);
    return { success: false, error: "Failed to remove cart item" };
  }
}

export async function getCartItemsAction() {
  const { userId } = await auth();
  if (!userId) {
    return null;
  }
  try {
    const items = await db.select().from(cart).where(eq(cart.userId, userId));
    return items;
  } catch (error) {
    console.error("Error getting cart items:", error);
    return null;
  }
}

export async function clearCartAction() {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await db.delete(cart).where(eq(cart.userId, userId));
    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.error("Error clearing cart:", error);
    return { success: false, error: "Failed to clear cart" };
  }
}
