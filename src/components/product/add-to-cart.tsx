"use client";

import { ShoppingCartIcon } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { CartProduct, useCartStore } from "../../../store/cart-store";
import QuantityAdjuster from "./general-quantity-button"; // Import the new component
import { Product } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { useAuth } from "@clerk/nextjs";

interface AddToCartProps {
  product: Product;
  selectedImage?: string;
}

const AddToCart = ({ product, selectedImage }: AddToCartProps) => {
  const { userId, isLoaded } = useAuth();
  const { products, addToCart } = useCartStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >({});
  const [currentPrice, setCurrentPrice] = useState<string | number | undefined>(
    product.price
  );
  const [localProductInCart, setLocalProductInCart] = useState<
    CartProduct | undefined
  >(undefined);
  const [localQuantity, setLocalQuantity] = useState(1);

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
          product.attributes.attributeCombinations.find(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (combination: { [x: string]: any }) => {
              return Object.entries(selectedAttributes).every(
                ([key, value]) => String(combination[key]) === String(value)
              );
            }
          );
        if (selectedCombination && selectedCombination.price) {
          setCurrentPrice(selectedCombination.price);
        } else {
          setCurrentPrice(product?.price);
        }
      } else {
        setCurrentPrice(product?.price);
      }
    }
    setLocalProductInCart(productInCart);
  }, [selectedAttributes, product, products, productInCart]);

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

  const handleAddToCartClick = async () => {
    if (
      product &&
      product.attributes &&
      Object.keys(product.attributes.availableAttributes).length > 0
    ) {
      setIsModalOpen(true);
    } else if (product) {
      if (isLoaded && userId) {
        await addToCart({ ...product, quantity: 1 }, userId);
      } else {
        await addToCart({ ...product, quantity: 1 }, null);
      }
    }
  };

  const handleAddToCartFromModal = async () => {
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

      if (isLoaded && userId) {
        await addToCart(modifiedProduct, userId);
      } else {
        await addToCart(modifiedProduct, null);
      }

      setIsModalOpen(false);
    }
  };

  const isAddButtonEnabled =
    product &&
    product.attributes &&
    Object.keys(product.attributes.availableAttributes).length > 0 &&
    Object.keys(product.attributes.availableAttributes).every(
      (key) => selectedAttributes[key]
    );

  const handleQuantityChange = async (quantity: number) => {
    setLocalQuantity(quantity);
    if (localProductInCart && isLoaded && userId) {
      await addToCart({ ...localProductInCart, quantity: quantity }, userId);
    } else if (localProductInCart && isLoaded && !userId) {
      await addToCart({ ...localProductInCart, quantity: quantity }, null);
    }
  };

  return (
    <>
      <div className="flex-1">
        <Button className="flex-1 w-full" onClick={handleAddToCartClick}>
          <ShoppingCartIcon className="size-4" />
          Add to Cart
        </Button>
      </div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogHeader className="sr-only">
          <DialogTitle>Add to Cart</DialogTitle>
          <DialogDescription>
            Select the options for your product
          </DialogDescription>
        </DialogHeader>
        <DialogContent className="sm:max-w-[425px]">
          <div className="space-y-4">
            <Image
              src={
                selectedImage || product?.imageUrls?.[0] || "/placeholder.png"
              }
              alt={product?.name}
              height={200}
              width={200}
              className="mx-auto object-cover h-48 w-full rounded-lg mt-4"
            />
            <p className="text-2xl ">{product.name}</p>

            <p className="text-lg font-semibold">
              ${currentPrice}
              {product.oldPrice && (
                <span className="line-through text-muted-foreground ml-2">
                  ${product.oldPrice}
                </span>
              )}
            </p>
            {product.attributes &&
              Object.keys(product.attributes.availableAttributes).length > 0 &&
              Object.entries(product.attributes.availableAttributes).map(
                ([attribute, values]) => (
                  <div key={attribute} className="space-y-2">
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
                          onClick={() =>
                            handleAttributeChange(attribute, value)
                          }
                        >
                          {value}
                        </Button>
                      ))}
                    </div>
                  </div>
                )
              )}
          </div>
          <DialogFooter className="flex gap-2">
            <div className="w-fit">
              {localProductInCart ? (
                <QuantityAdjuster
                  quantity={localProductInCart.quantity}
                  onQuantityChange={(newQuantity) => {
                    if (newQuantity > 0) {
                      addToCart(
                        {
                          ...localProductInCart,
                          quantity: newQuantity,
                        },
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
              disabled={!!localProductInCart || !isAddButtonEnabled}
              onClick={handleAddToCartFromModal}
              className="flex-1"
            >
              {localProductInCart ? "In Cart" : "Add to Cart"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddToCart;
