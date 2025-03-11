"use client";

import React, { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import QuantityAdjuster from "@/components/product/general-quantity-button";
import { Product } from "@/lib/types";

import { useState } from "react";
import { useAddToCartLogic } from "@/lib/hooks/useAddToCartLogic";

interface AddToCartNoModalProps {
  product: Product;
  setCurrentPrice: Dispatch<SetStateAction<string | number | undefined>>;
  currentPrice: string | number | undefined;
}

const AddToCartNoModal: React.FC<AddToCartNoModalProps> = ({ product }) => {
  const [currentPrice, setCurrentPrice] = useState<string | number | undefined>(
    product?.price
  );

  const {
    selectedAttributes,
    localProductInCart,
    localQuantity,
    isAddButtonEnabled,
    handleAddToCart,
    handleAttributeChange,
    handleQuantityChange,
    updateCartQuantity,
    isQuantityDisabled,
  } = useAddToCartLogic({ product, setCurrentPrice, currentPrice });

  return (
    <div>
      {product.attributes &&
        Object.keys(product.attributes.availableAttributes).length > 0 &&
        Object.entries(product.attributes.availableAttributes).map(
          ([attribute, values]) => (
            <div key={attribute}>
              <h3 className="text-lg font-medium mt-6 mb-2">
                {attribute.toUpperCase()} -{" "}
                <span className="text-muted-foreground">
                  {selectedAttributes[attribute] || "Select"}
                </span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {(values as string[]).map((value) => (
                  <Button
                    key={value}
                    variant={
                      selectedAttributes[attribute] === value
                        ? "default"
                        : "outline"
                    }
                    onClick={() => handleAttributeChange(attribute, value)}
                  >
                    {value}
                  </Button>
                ))}
              </div>
            </div>
          )
        )}

      <div className="mt-8 flex gap-2">
        <div className="w-fit">
          {localProductInCart ? (
            <QuantityAdjuster
              quantity={localQuantity}
              onQuantityChange={updateCartQuantity}
              isLarge
              isDissabled={isQuantityDisabled}
            />
          ) : (
            <QuantityAdjuster
              quantity={localQuantity}
              onQuantityChange={handleQuantityChange}
              isDissabled={isQuantityDisabled}
              isLarge
            />
          )}
        </div>
        <Button
          disabled={
            localProductInCart ||
            (product &&
              product.attributes &&
              Object.keys(product.attributes.availableAttributes).length > 0 &&
              !isAddButtonEnabled)
          }
          onClick={handleAddToCart}
          className="flex-1"
        >
          {localProductInCart ? "In Cart" : "Add to Cart"}
        </Button>
      </div>
    </div>
  );
};

export default AddToCartNoModal;
