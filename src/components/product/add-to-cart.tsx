"use client";
import { product } from "@/lib/fakedata";
import { ShoppingCartIcon } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { useCartStore } from "../../../store/cart-store";
import QauntityButton from "./quantity-button";

const AddToCart = ({ product }: { product: product }) => {
  const { products, addToCart } = useCartStore();

  const productInCart = products.find((item) => item.id === product.id);

  return productInCart ? (
    <div className="flex-1 items-center gap-2">
      <QauntityButton productInCart={productInCart} isLarge />
    </div>
  ) : (
    <div className="flex-1">
      <Button
        className="flex-1 w-full"
        onClick={() => addToCart({ ...product, quantity: 1 })}
      >
        <ShoppingCartIcon className="size-4" />
        Add to Cart
      </Button>
    </div>
  );
};

export default AddToCart;
