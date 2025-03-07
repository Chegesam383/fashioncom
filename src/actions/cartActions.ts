/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { db } from "@/db";
import { cart, products, users } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { eq, and, sql } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { CartProduct } from "@/lib/types";

export async function addToCartAction(
  productId: string,
  attributes: Record<string, string>, // Allow any type for flexibility
  quantity: number
) {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  const user = await db.query.users.findFirst({
    where: eq(users.clerkId, userId),
    columns: {
      id: true,
    },
  });

  if (!user) {
    return { success: false, error: "User not found" };
  }

  try {
    await db
      .insert(cart)
      .values({
        userId: user.id,
        productId,
        attributes,
        quantity,
      })
      .onConflictDoUpdate({
        target: [cart.userId, cart.productId, cart.attributes],
        set: { quantity: sql`${cart.quantity} + ${quantity}` },
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

  const user = await db.query.users.findFirst({
    where: eq(users.clerkId, userId),
    columns: {
      id: true,
    },
  });

  if (!user) {
    return { success: false, error: "User not found" };
  }

  try {
    await db
      .update(cart)
      .set({ quantity: quantity })
      .where(
        and(
          eq(cart.userId, user.id),
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

  const user = await db.query.users.findFirst({
    where: eq(users.clerkId, userId),
    columns: {
      id: true,
    },
  });

  if (!user) {
    return { success: false, error: "User not found" };
  }

  try {
    await db
      .delete(cart)
      .where(
        and(
          eq(cart.userId, user.id),
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

  const user = await db.query.users.findFirst({
    where: eq(users.clerkId, userId),
    columns: {
      id: true,
    },
  });

  if (!user) {
    return { success: false, error: "User not found" };
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
      .where(eq(cart.userId, user.id));

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

  const user = await db.query.users.findFirst({
    where: eq(users.clerkId, userId),
    columns: {
      id: true,
    },
  });

  if (!user) {
    return { success: false, error: "User not found" };
  }

  try {
    await db.delete(cart).where(eq(cart.userId, user.id)); // Use userId here
    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.error("Error clearing cart:", error);
    return { success: false, error: "Failed to clear cart" };
  }
}

export async function syncCartToDatabase(cartItems: CartProduct[]) {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // Check if user exists
    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, clerkId),
    });

    // Return error if user does not exist
    if (!user) {
      console.error("User not found for clerkId:", clerkId);
      return { success: false, error: "User not found" };
    }

    // Clear existing cart for the user
    await db.delete(cart).where(eq(cart.userId, user.id));

    // Insert new cart items
    for (const item of cartItems) {
      await db.insert(cart).values({
        userId: user.id,
        productId: item.id,
        attributes: item.attributes || {},
        quantity: item.quantity,
      });
    }

    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.error("Error syncing cart to database:", error);
    return { success: false, error: "Failed to sync cart to database" };
  }
}
