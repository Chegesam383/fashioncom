"use client";

import { ShoppingCartIcon } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { useCartStore } from "../../../store/cart-store";
import QauntityButton from "./quantity-button";
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

interface AddToCartProps {
  product: Product;
  selectedImage?: string;
}

const AddToCart = ({ product, selectedImage }: AddToCartProps) => {
  const { products, addToCart } = useCartStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >({});
  const [currentPrice, setCurrentPrice] = useState<string | number | undefined>(
    product.price
  );

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
      const selectedCombination = product.attributes.attributeCombinations.find(
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
    }
  }, [selectedAttributes, product]);

  const handleAttributeChange = (attribute: string, value: string) => {
    setSelectedAttributes({ ...selectedAttributes, [attribute]: value });
  };

  const handleAddToCartClick = () => {
    if (
      product &&
      product.attributes &&
      Object.keys(product.attributes.availableAttributes).length > 0
    ) {
      setIsModalOpen(true);
    } else if (product) {
      addToCart({ ...product, quantity: 1 });
    }
  };

  const handleAddToCartFromModal = () => {
    if (product) {
      const modifiedProduct = {
        ...product,
        price: String(currentPrice),
        attributes: {
          selectedAttributes: Object.entries(selectedAttributes).map(
            ([key, value]) => ({ [key]: value })
          ),
        },
        quantity: 1,
      };
      addToCart(modifiedProduct);
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

  const showQuantityButtonInModal = isAddButtonEnabled && productInCart;

  return productInCart &&
    product.attributes &&
    Object.keys(product.attributes.availableAttributes).length === 0 ? (
    <div className="flex-1 items-center gap-2">
      <QauntityButton productInCart={productInCart} isLarge />
    </div>
  ) : (
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
          <DialogFooter>
            {showQuantityButtonInModal ? (
              <QauntityButton productInCart={productInCart} isLarge />
            ) : (
              <Button
                disabled={!isAddButtonEnabled}
                onClick={handleAddToCartFromModal}
              >
                Add to Cart
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddToCart;
