"use client";

import React from "react";
import { Button } from "../ui/button";
import { CartProduct, useCartStore } from "../../../store/cart-store";

interface QauntityButtonProps {
  productInCart: CartProduct;
  isLarge?: boolean;
}

const QauntityButton: React.FC<QauntityButtonProps> = ({
  productInCart,
  isLarge = false,
}) => {
  const { updateCartProduct, removeFromCart } = useCartStore();

  const handleIncrement = () => {
    updateCartProduct(productInCart, productInCart.quantity + 1);
  };

  const handleDecrement = () => {
    if (productInCart.quantity > 1) {
      updateCartProduct(productInCart, productInCart.quantity - 1);
    } else {
      removeFromCart(productInCart);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="default"
        size={"icon"}
        onClick={handleDecrement}
        className={isLarge ? "h-10 w-10 rounded-full" : "h-8 w-8 rounded-full"}
      >
        -
      </Button>
      <span className={isLarge ? "text-lg   flex-1" : "  flex-1"}>
        {productInCart.quantity}
      </span>
      <Button
        variant="default"
        size={"icon"}
        onClick={handleIncrement}
        className={isLarge ? "h-10 w-10 rounded-full" : "h-8 w-8 rounded-full"}
      >
        +
      </Button>
    </div>
  );
};

export default QauntityButton;
