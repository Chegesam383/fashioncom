import { Product } from "@/lib/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

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
  addToCart: (product: CartProduct) => void;
  removeFromCart: (product: CartProduct) => void;
  updateCartProduct: (product: CartProduct, quantity: number) => void;
  clearCart: () => void;
  setTax: (tax: number) => void;
  setDiscount: (discount: number) => void;
  setPromoCode: (promoCode: PromoCode | null) => void;
  setShippingCost: (shippingCost: number) => void; // Setter for shipping cost
  setGrandTotal: () => void;
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
    (set) => ({
      products: [],
      subtotal: 0,
      count: 0,
      tax: 0,
      discount: 0,
      promoCode: null,
      shippingCost: 0, // Initialize shipping cost
      grandTotal: 0,

      addToCart: (product) =>
        set((state) => {
          const existingProduct = state.products.find((item) => {
            return (
              item.id === product.id &&
              JSON.stringify(item.attributes) ===
                JSON.stringify(product.attributes)
            );
          });
          let updatedProducts;

          if (existingProduct) {
            updatedProducts = state.products.map((item) =>
              item.id === product.id &&
              JSON.stringify(item.attributes) ===
                JSON.stringify(product.attributes)
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
          } else {
            updatedProducts = [...state.products, product];
          }

          const newCount = updatedProducts.reduce(
            (acc, item) => acc + item.quantity,
            0
          );

          const newSubtotal = updatedProducts.reduce(
            (acc, item) => acc + Number(item.price) * item.quantity,
            0
          );

          // Recalculate discount based on the promo code
          let newDiscount = state.discount;
          if (state.promoCode) {
            newDiscount = (newSubtotal * state.promoCode.discount) / 100;
          }

          return {
            products: updatedProducts,
            subtotal: newSubtotal,
            count: newCount,
            discount: newDiscount,
            grandTotal:
              newSubtotal + state.tax + state.shippingCost - newDiscount, // recalculate grandTotal
          };
        }),

      removeFromCart: (product) =>
        set((state) => {
          const updatedProducts = state.products.filter((item) => {
            return !(
              item.id === product.id &&
              JSON.stringify(item.attributes) ===
                JSON.stringify(product.attributes)
            );
          });

          const newCount = updatedProducts.reduce(
            (acc, item) => acc + item.quantity,
            0
          );

          const newSubtotal = updatedProducts.reduce(
            (acc, item) => acc + Number(item.price) * item.quantity,
            0
          );

          // Recalculate discount based on the promo code
          let newDiscount = state.discount;
          if (state.promoCode) {
            newDiscount = (newSubtotal * state.promoCode.discount) / 100;
          }

          // If the cart is empty, reset the discount and promo code
          if (newCount === 0) {
            newDiscount = 0;
            return {
              products: updatedProducts,
              subtotal: newSubtotal,
              count: newCount,
              discount: newDiscount,
              promoCode: null, // Reset promo code if cart is empty
              grandTotal:
                newSubtotal + state.tax + state.shippingCost - newDiscount, // recalculate grandTotal
            };
          }

          return {
            products: updatedProducts,
            subtotal: newSubtotal,
            count: newCount,
            discount: newDiscount,
            grandTotal:
              newSubtotal + state.tax + state.shippingCost - newDiscount, // recalculate grandTotal
          };
        }),

      updateCartProduct: (product, quantity) =>
        set((state) => {
          if (quantity < 1) return state;

          const updatedProducts = state.products.map((item) => {
            return item.id === product.id &&
              JSON.stringify(item.attributes) ===
                JSON.stringify(product.attributes)
              ? { ...item, quantity }
              : item;
          });

          const newCount = updatedProducts.reduce(
            (acc, item) => acc + item.quantity,
            0
          );

          const newSubtotal = updatedProducts.reduce(
            (acc, item) => acc + Number(item.price) * item.quantity,
            0
          );

          // Recalculate discount based on the promo code
          let newDiscount = state.discount;
          if (state.promoCode) {
            newDiscount = (newSubtotal * state.promoCode.discount) / 100;
          }

          return {
            products: updatedProducts,
            subtotal: newSubtotal,
            count: newCount,
            discount: newDiscount,
            grandTotal:
              newSubtotal + state.tax + state.shippingCost - newDiscount, // recalculate grandTotal
          };
        }),

      clearCart: () =>
        set({
          products: [],
          subtotal: 0,
          count: 0,
          grandTotal: 0,
          discount: 0, // Reset discount
          promoCode: null, // Reset promo code
        }),

      setTax: (tax) =>
        set((state) => ({
          tax,
          grandTotal:
            state.subtotal + tax + state.shippingCost - state.discount, // recalculate grandTotal
        })),

      setDiscount: (discount) =>
        set((state) => ({
          discount,
          grandTotal:
            state.subtotal + state.tax + state.shippingCost - discount, // recalculate grandTotal
        })),

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
              state.subtotal + state.tax + state.shippingCost - newDiscount, // recalculate grandTotal
          };
        }),

      // New action to set shipping cost
      setShippingCost: (shippingCost) =>
        set((state) => ({
          shippingCost,
          grandTotal:
            state.subtotal + state.tax + shippingCost - state.discount, // recalculate grandTotal
        })),

      setGrandTotal: () =>
        set((state) => ({
          grandTotal:
            state.subtotal + state.tax + state.shippingCost - state.discount,
        })),
    }),
    {
      name: "cart-storage",
    }
  )
);
