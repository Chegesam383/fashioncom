import { product } from "@/lib/fakedata";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartProduct extends product {
  quantity: number;
}

type State = {
  products: CartProduct[];
  subtotal: number;
};

export type Actions = {
  addToCart: (product: CartProduct) => void;
  removeFromCart: (productId: string) => void;
  updateCartProduct: (productId: string, quantity: number) => void;
  clearCart: () => void;
};

export const useCartStore = create<State & Actions>()(
  persist(
    (set) => ({
      products: [],
      subtotal: 0,

      addToCart: (product) =>
        set((state) => {
          const existingProduct = state.products.find(
            (item) => item.id === product.id
          );
          let updatedProducts;

          if (existingProduct) {
            updatedProducts = state.products.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
          } else {
            updatedProducts = [...state.products, product];
          }

          return {
            products: updatedProducts,
            subtotal: updatedProducts.reduce(
              (acc, item) => acc + item.price * item.quantity,
              0
            ),
          };
        }),

      removeFromCart: (productId) =>
        set((state) => {
          const updatedProducts = state.products.filter(
            (item) => item.id !== productId
          );
          return {
            products: updatedProducts,
            subtotal: updatedProducts.reduce(
              (acc, item) => acc + item.price * item.quantity,
              0
            ),
          };
        }),

      updateCartProduct: (productId, quantity) =>
        set((state) => {
          if (quantity < 1) return state;

          const updatedProducts = state.products.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          );

          return {
            products: updatedProducts,
            subtotal: updatedProducts.reduce(
              (acc, item) => acc + item.price * item.quantity,
              0
            ),
          };
        }),

      clearCart: () => set({ products: [], subtotal: 0 }),
    }),
    {
      name: "cart-storage", // Key for localStorage
    }
  )
);
