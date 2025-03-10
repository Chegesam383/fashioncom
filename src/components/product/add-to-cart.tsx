"use client";

import { ShoppingCartIcon } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../ui/button";
import QuantityAdjuster from "./general-quantity-button";
import { Product } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Image from "next/image";
import { useAddToCartLogic } from "@/lib/hooks/useAddToCartLogic";

interface AddToCartProps {
  product: Product;
  selectedImage?: string;
}

const AddToCart = ({ product }: AddToCartProps) => {
  const [localSelectedImage, setlocalSelectedImage] = useState(
    product.imageUrls?.[0] || ""
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const handleAddToCartClick = () => {
    if (
      product &&
      product.attributes &&
      Object.keys(product.attributes.availableAttributes).length > 0
    ) {
      setIsModalOpen(true);
    } else {
      handleAddToCart();
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
        <DialogContent className=" lg: max-w-2xl">
          <div className=" lg:flex gap-6 space-y-4">
            <div className="flex-1">
              <Image
                src={
                  localSelectedImage ||
                  product?.imageUrls?.[0] ||
                  "/placeholder.png"
                }
                alt={product?.name}
                height={200}
                width={200}
                className="mx-auto object-cover h-64 w-64 rounded-lg mt-4"
              />

              <div className="flex flex-row gap-2 mt-4">
                {Array.isArray(product?.imageUrls) &&
                  product.imageUrls.length > 0 &&
                  product.imageUrls.map((item) => (
                    <div
                      key={item || "/placeholder.png"}
                      className={`${
                        localSelectedImage === item ? "border" : ""
                      }  w-20 h-20 p-2 rounded`}
                    >
                      <Image
                        onClick={() => setlocalSelectedImage(item)}
                        src={item || "/placeholder.png"}
                        alt={product?.name}
                        height={400}
                        width={500}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
              </div>
            </div>
            <div>
              <p className="text-2xl ">{product.name}</p>

              <p className="text-lg font-semibold mb-4">
                ${currentPrice}
                {product.oldPrice && (
                  <small className="line-through text-muted-foreground ml-2">
                    ${product.oldPrice}
                  </small>
                )}
              </p>
              {product.attributes &&
                Object.keys(product.attributes.availableAttributes).length >
                  0 &&
                Object.entries(product.attributes.availableAttributes).map(
                  ([attribute, values]) => (
                    <div key={attribute} className="mb-4">
                      <h3 className="text-lg font-medium mb-2">
                        {attribute.toLocaleUpperCase()} -{" "}
                        <span className="text-muted-foreground">
                          {" "}
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
          </div>
          <DialogFooter className="flex gap-2">
            <div className="w-fit">
              <QuantityAdjuster
                quantity={
                  localProductInCart
                    ? localProductInCart.quantity
                    : localQuantity
                }
                onQuantityChange={
                  localProductInCart ? updateCartQuantity : handleQuantityChange
                }
                isLarge
                isDissabled={isQuantityDisabled}
              />
            </div>
            <Button
              disabled={!!localProductInCart || !isAddButtonEnabled}
              onClick={() => {
                handleAddToCart();
                setIsModalOpen(false);
              }}
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
