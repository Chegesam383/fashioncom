"use client";

import React from "react";
import { Button } from "../ui/button";
import { CartProduct, useCartStore } from "../../../store/cart-store";
import { useAuth } from "@clerk/nextjs";
import { Minus, Plus } from "lucide-react";

interface QauntityButtonProps {
  productInCart: CartProduct;
  isLarge?: boolean;
}

const QauntityButton: React.FC<QauntityButtonProps> = ({
  productInCart,
  isLarge = false,
}) => {
  const { updateCartProduct, removeFromCart } = useCartStore();
  const { userId, isLoaded } = useAuth(); // Get userId

  const handleIncrement = () => {
    if (isLoaded && userId) {
      updateCartProduct(productInCart, productInCart.quantity + 1, userId); // Pass userId
    } else {
      updateCartProduct(productInCart, productInCart.quantity + 1, null);
    }
  };

  const handleDecrement = () => {
    if (productInCart.quantity > 1) {
      if (isLoaded && userId) {
        updateCartProduct(productInCart, productInCart.quantity - 1, userId); // Pass userId
      } else {
        updateCartProduct(productInCart, productInCart.quantity - 1, null);
      }
    } else {
      if (isLoaded && userId) {
        removeFromCart(productInCart, userId); // Pass userId
      } else {
        removeFromCart(productInCart, null);
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="secondary"
        size={"icon"}
        onClick={handleDecrement}
        className={isLarge ? "h-10 w-10 rounded-full" : "h-8 w-8 rounded-full"}
      >
        <Minus />
      </Button>
      <span className={isLarge ? "text-lg   flex-1" : "  flex-1"}>
        {productInCart.quantity}
      </span>
      <Button
        variant="secondary"
        size={"icon"}
        onClick={handleIncrement}
        className={isLarge ? "h-10 w-10 rounded-full" : "h-8 w-8 rounded-full"}
      >
        <Plus />
      </Button>
    </div>
  );
};

export default QauntityButton;
