/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

import QuantityAdjuster from "@/components/product/general-quantity-button";
import { Product } from "@/lib/types";
import { CartProduct, useCartStore } from "../../../../store/cart-store";
import { useAuth } from "@clerk/nextjs";

interface AddToCartNoModalProps {
  product: Product;
  setCurrentPrice: (price: string | number | undefined) => void;
  currentPrice: string | number | undefined;
}

const AddToCartNoModal: React.FC<AddToCartNoModalProps> = ({
  product,
  setCurrentPrice,
  currentPrice,
}) => {
  const { products, addToCart } = useCartStore();
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >({});
  const [localProductInCart, setLocalProductInCart] = useState<
    CartProduct | undefined
  >(undefined);
  const [localQuantity, setLocalQuantity] = useState(1);
  const { userId } = useAuth();

  useEffect(() => {
    if (
      product &&
      product.attributes &&
      product.attributes.attributeCombinations
    ) {
      const allAttributesSelected = Object.keys(
        product.attributes.availableAttributes
      ).every((key) => selectedAttributes[key]);

      if (allAttributesSelected) {
        const selectedCombination =
          product.attributes.attributeCombinations.find((combination: any) => {
            return Object.entries(selectedAttributes).every(
              ([key, value]) => String(combination[key]) === String(value)
            );
          });
        if (selectedCombination && selectedCombination.price) {
          setCurrentPrice(selectedCombination.price);
        } else {
          setCurrentPrice(product?.price);
        }
      } else {
        setCurrentPrice(product?.price);
      }
    }
    const productInCart = products.find((item) => {
      return (
        item.id === product.id &&
        JSON.stringify(item.attributes) ===
          JSON.stringify({
            selectedAttributes: Object.entries(selectedAttributes).map(
              ([key, value]) => ({ [key]: value })
            ),
          })
      );
    });
    setLocalProductInCart(productInCart);
  }, [selectedAttributes, product, setCurrentPrice, products]);

  const isAddButtonEnabled =
    product &&
    product.attributes &&
    Object.keys(product.attributes.availableAttributes).length > 0 &&
    Object.keys(product.attributes.availableAttributes).every(
      (key) => selectedAttributes[key]
    );

  const handleAddToCart = () => {
    if (product) {
      const modifiedProduct = {
        ...product,
        price: String(currentPrice),
        attributes: {
          selectedAttributes: Object.entries(selectedAttributes).map(
            ([key, value]) => ({ [key]: value })
          ),
        },
        quantity: localQuantity,
      };
      addToCart(modifiedProduct, userId || null);
    }
  };

  const handleAttributeChange = (attribute: string, value: string) => {
    setSelectedAttributes((prevAttributes) => {
      if (prevAttributes[attribute] === value) {
        const newAttributes = { ...prevAttributes };
        delete newAttributes[attribute];
        return newAttributes;
      } else {
        return { ...prevAttributes, [attribute]: value };
      }
    });
  };

  const handleQuantityChange = (quantity: number) => {
    setLocalQuantity(quantity);
  };

  return (
    <div>
      {product.attributes &&
        Object.keys(product.attributes.availableAttributes).length > 0 &&
        Object.entries(product.attributes.availableAttributes).map(
          ([attribute, values]) => (
            <div key={attribute} className="space-y-4">
              <h3 className="text-lg font-medium">
                {attribute} - {selectedAttributes[attribute] || "Select"}
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
              quantity={localProductInCart.quantity}
              onQuantityChange={(newQuantity) => {
                if (newQuantity > 0) {
                  addToCart(
                    { ...localProductInCart, quantity: newQuantity },
                    userId || null
                  );
                }
              }}
              isLarge
            />
          ) : (
            <QuantityAdjuster
              quantity={localQuantity}
              onQuantityChange={handleQuantityChange}
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
