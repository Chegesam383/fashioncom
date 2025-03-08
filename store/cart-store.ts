import { Product } from "@/lib/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  addToCartAction,
  removeFromCartAction,
  updateCartItemAction,
  clearCartAction,
  getCartItemsAction,
  syncCartToDatabase,
} from "@/actions/cartActions";

export interface CartProduct
  extends Pick<Product, "imageUrls" | "name" | "id" | "price" | "attributes"> {
  quantity: number;
}

export interface PromoCode {
  code: string;
  discount: number; // percentage discount
  expiry?: Date; // optional expiry
}

export type Actions = {
  addToCart: (product: CartProduct, userId: string | null) => Promise<void>;
  removeFromCart: (
    product: CartProduct,
    userId: string | null
  ) => Promise<void>;
  updateCartProduct: (
    product: CartProduct,
    quantity: number,
    userId: string | null
  ) => Promise<void>;
  clearCart: (userId: string | null) => Promise<void>;
  setTax: (tax: number) => void;
  setDiscount: (discount: number) => void;
  setPromoCode: (promoCode: PromoCode | null) => void;
  setShippingCost: (shippingCost: number) => void;
  setGrandTotal: () => void;
  mergeCarts: (userId: string | null) => Promise<void>;
};

export type State = {
  products: CartProduct[];
  subtotal: number;
  count: number;
  tax: number;
  discount: number;
  promoCode: PromoCode | null;
  shippingCost: number; // Shipping cost
  grandTotal: number;
};

export const useCartStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      products: [],
      subtotal: 0,
      count: 0,
      tax: 0,
      discount: 0,
      promoCode: null,
      shippingCost: 0,
      grandTotal: 0,

      addToCart: async (product, userId) => {
        const previousState = get();

        set((state) => {
          let products = [...state.products];

          const existingProduct = state.products.find((item) => {
            return (
              item.id === product.id &&
              JSON.stringify(item.attributes) ===
                JSON.stringify(product.attributes)
            );
          });

          if (existingProduct) {
            return state;
          }

          products = [...state.products, product];

          const newCount = products.reduce(
            (acc, item) => acc + item.quantity,
            0
          );

          const newSubtotal = products.reduce(
            (acc, item) => acc + Number(item.price) * item.quantity,
            0
          );

          let newDiscount = state.discount;

          if (state.promoCode) {
            newDiscount = (newSubtotal * state.promoCode.discount) / 100;
          }

          return {
            products,
            subtotal: newSubtotal,
            count: newCount,
            discount: newDiscount,
            grandTotal:
              newSubtotal + state.tax + state.shippingCost - newDiscount,
          };
        });

        if (userId) {
          try {
            const response = await addToCartAction(
              product.id,
              product.attributes || {},
              product.quantity
            );

            if (!response.success) {
              set(() => previousState);
              console.error("Server error: Failed to add to cart");
              // todo display an error message to the user
            }
          } catch (error) {
            set(() => previousState); // Revert to previous state
            console.error("Server error: Failed to add to cart", error);
            // todo display an error message to the user
          }
        }
      },

      removeFromCart: async (product, userId) => {
        const previousState = get();

        set((state) => {
          let products = [...state.products];

          products = state.products.filter((item) => {
            return !(
              item.id === product.id &&
              JSON.stringify(item.attributes) ===
                JSON.stringify(product.attributes)
            );
          });

          const newCount = products.reduce(
            (acc, item) => acc + item.quantity,
            0
          );

          const newSubtotal = products.reduce(
            (acc, item) => acc + Number(item.price) * item.quantity,
            0
          );

          // Recalculate discount based on the promo code
          let newDiscount = state.discount;
          if (state.promoCode) {
            newDiscount = (newSubtotal * state.promoCode.discount) / 100;
          }

          // If the cart is empty, reset everything
          if (newCount === 0) {
            return {
              products: [],
              subtotal: 0,
              count: 0,
              discount: 0,
              promoCode: null, // Reset promo code if cart is empty
              grandTotal: 0,
            };
          }

          return {
            products,
            subtotal: newSubtotal,
            count: newCount,
            discount: newDiscount,
            grandTotal:
              newSubtotal + state.tax + state.shippingCost - newDiscount, // recalculate grandTotal
          };
        });

        if (userId) {
          try {
            const response = await removeFromCartAction(
              product.id,
              product.attributes || {}
            );

            if (!response.success) {
              set(() => previousState);
              console.error("Server error: Failed to remove from cart");
            }
          } catch (error) {
            set(() => previousState);
            console.error("Server error: Failed to remove from cart", error);
          }
        }
      },

      updateCartProduct: async (product, quantity, userId: string | null) => {
        const previousState = get();
        set((state) => {
          if (quantity < 1) return state;

          const products = state.products.map((item) => {
            return item.id === product.id &&
              JSON.stringify(item.attributes) ===
                JSON.stringify(product.attributes)
              ? { ...item, quantity }
              : item;
          });

          const newCount = products.reduce(
            (acc, item) => acc + item.quantity,
            0
          );

          const newSubtotal = products.reduce(
            (acc, item) => acc + Number(item.price) * item.quantity,
            0
          );

          // Recalculate discount based on the promo code
          let newDiscount = state.discount;
          if (state.promoCode) {
            newDiscount = (newSubtotal * state.promoCode.discount) / 100;
          }

          return {
            products,
            subtotal: newSubtotal,
            count: newCount,
            discount: newDiscount,
            grandTotal:
              newSubtotal + state.tax + state.shippingCost - newDiscount, // recalculate grandTotal
          };
        });

        if (userId) {
          try {
            const response = await updateCartItemAction(
              product.id,
              product.attributes || {},
              quantity
            );

            if (!response.success) {
              set(() => previousState);
              console.error("Server error: Failed to update cart item");
            }
          } catch (error) {
            set(() => previousState);
            console.error("Server error: Failed to update cart item", error);
          }
        }
      },

      clearCart: async (userId) => {
        const previousState = get();

        set({
          products: [],
          subtotal: 0,
          count: 0,
          grandTotal: 0,
          discount: 0,
          promoCode: null,
        });

        if (userId) {
          try {
            const response = await clearCartAction();
            if (!response.success) {
              set(() => previousState);
              console.error("Server error: Failed to clear cart");
              // Optionally, display an error message
            }
          } catch (error) {
            set(() => previousState); // Revert state on error
            console.error("Server error: Failed to clear cart", error);
            // Optionally, display an error message
          }
        }
      },
      //offline
      setTax: (tax) =>
        set((state) => ({
          tax,
          grandTotal:
            state.subtotal + tax + state.shippingCost - state.discount,
        })),
      //offline
      setDiscount: (discount) =>
        set((state) => ({
          discount,
          grandTotal:
            state.subtotal + state.tax + state.shippingCost - discount,
        })),

      //ofline only
      //todo go online
      setPromoCode: (promoCode) =>
        set((state) => {
          let newDiscount = 0;
          if (
            promoCode &&
            (!promoCode.expiry || promoCode.expiry > new Date())
          ) {
            newDiscount = (state.subtotal * promoCode.discount) / 100; // Apply promo code discount
          }
          return {
            promoCode,
            discount: newDiscount,
            grandTotal:
              state.subtotal + state.tax + state.shippingCost - newDiscount,
          };
        }),

      // ofline only
      setShippingCost: (shippingCost) =>
        set((state) => ({
          shippingCost,
          grandTotal:
            state.subtotal + state.tax + shippingCost - state.discount,
        })),

      //ofline only
      setGrandTotal: () =>
        set((state) => ({
          grandTotal:
            state.subtotal + state.tax + state.shippingCost - state.discount,
        })),

      mergeCarts: async (userId) => {
        if (!userId) return;

        try {
          const dbCartItems = await getCartItemsAction();
          const localCartItems = get().products;
          const dissalowUdatefromDb = true; // if false db state will update local cart

          //user might have checked out from onother device or cleared cart

          if (
            (Array.isArray(dbCartItems) && dbCartItems.length === 0) ||
            dissalowUdatefromDb
          ) {
            return;
          }

          const mergedCart = new Map<string, CartProduct>();

          if (Array.isArray(dbCartItems) && dbCartItems.length > 0) {
            dbCartItems.forEach((item) => {
              const key = `${item.productId}-${JSON.stringify(
                item.attributes
              )}`;
              mergedCart.set(key, {
                id: item.productId,
                quantity: item.quantity,
                attributes: item.attributes,
                name: item.name ?? "",
                price: item.price ?? "0",
                imageUrls: Array.isArray(item.imageUrls) ? item.imageUrls : [],
              });
            });
          }

          localCartItems.forEach((localItem) => {
            const key = `${localItem.id}-${JSON.stringify(
              localItem.attributes
            )}`;
            if (mergedCart.has(key)) {
              const existingItem = mergedCart.get(key)!;
              // Replace, not add
              mergedCart.set(key, {
                ...existingItem,
                quantity: localItem.quantity, //Use local quantity.
              });
            } else {
              mergedCart.set(key, localItem);
            }
          });

          const mergedProducts = Array.from(mergedCart.values());

          set({ products: mergedProducts });

          const newCount = mergedProducts.reduce(
            (acc, item) => acc + item.quantity,
            0
          );
          const newSubtotal = mergedProducts.reduce(
            (acc, item) => acc + Number(item.price) * item.quantity,
            0
          );
          let newDiscount = get().discount;
          if (get().promoCode) {
            newDiscount =
              (newSubtotal * (get().promoCode?.discount ?? 0)) / 100;
          }

          set({
            products: mergedProducts,
            count: newCount,
            subtotal: newSubtotal,
            discount: newDiscount,
            grandTotal:
              newSubtotal + get().tax + get().shippingCost - newDiscount,
          });

          try {
            //updates db with local state
            await syncCartToDatabase(mergedProducts);
            console.log("Cart synchronized with database.");
          } catch (syncError) {
            console.error("Error synchronizing cart with database:", syncError);
          }
        } catch (error) {
          console.error("Error merging carts:", error);
        }
      },
    }),
    {
      name: "cart-storage",
    }
  )
);
