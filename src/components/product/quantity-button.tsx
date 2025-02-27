"use client";

import { Minus, Plus } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { CartProduct, useCartStore } from "../../../store/cart-store";

const QauntityButton = ({
  productInCart,
  isLarge = false,
}: {
  productInCart: CartProduct;
  isLarge?: boolean;
}) => {
  const { updateCartProduct, removeFromCart } = useCartStore();
  return (
    <div className=" rounded-full  bg-muted w-fit">
      <Button
        size="icon"
        className={`rounded-full ${!isLarge && "h-7 w-7"}`}
        variant="outline"
        onClick={() => {
          if (productInCart.quantity <= 1) {
            removeFromCart(productInCart.id);
          } else {
            updateCartProduct(productInCart.id, productInCart.quantity - 1);
          }
        }}
      >
        <Minus />
      </Button>
      <span className="p-3">{productInCart.quantity}</span>
      <Button
        size="icon"
        className={`rounded-full ${!isLarge && "h-7 w-7"}`}
        variant="outline"
        onClick={() =>
          updateCartProduct(productInCart.id, productInCart.quantity + 1)
        }
      >
        <Plus />
      </Button>
    </div>
  );
};

export default QauntityButton;
