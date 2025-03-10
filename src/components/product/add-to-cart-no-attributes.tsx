"use client";

import { ShoppingCartIcon } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";

import { Product } from "@/lib/types";

import { useAddToCartLogic } from "@/lib/hooks/useAddToCartLogic";
import QauntityButton from "./quantity-button";

interface AddToCartProps {
  product: Product;
  selectedImage?: string;
}

const AddToCartNoAttributes = ({ product }: AddToCartProps) => {
  const { localProductInCart, handleAddToCart } = useAddToCartLogic({
    product,
  });

  const handleAddToCartClick = () => {
    if (!localProductInCart) {
      handleAddToCart();
    }
  };

  if (localProductInCart)
    return <QauntityButton productInCart={localProductInCart} />;

  return (
    <>
      <div className="flex-1">
        <Button className="flex-1 w-full" onClick={handleAddToCartClick}>
          <ShoppingCartIcon className="size-4" />
          Add to Cart
        </Button>
      </div>
    </>
  );
};

export default AddToCartNoAttributes;
