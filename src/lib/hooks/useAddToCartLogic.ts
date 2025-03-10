import { useState, useEffect } from "react";
import { Product } from "@/lib/types";
import { useAuth } from "@clerk/nextjs";
import { useCartStore, CartProduct } from "../../../store/cart-store";

interface UseAddToCartLogicProps {
  product: Product;
  setCurrentPrice?: (price: string | number | undefined) => void;
  currentPrice?: string | number | undefined;
}

export const useAddToCartLogic = ({
  product,
  setCurrentPrice,
  currentPrice: initialCurrentPrice,
}: UseAddToCartLogicProps) => {
  const { products, addToCart, updateCartProduct, removeFromCart } =
    useCartStore();
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >({});
  const [localProductInCart, setLocalProductInCart] = useState<
    CartProduct | undefined
  >(undefined);
  const [localQuantity, setLocalQuantity] = useState(1);
  const { userId } = useAuth();
  const [currentPrice, setCurrentPriceInternal] = useState(initialCurrentPrice);

  useEffect(() => {
    if (setCurrentPrice) setCurrentPrice(currentPrice);
  }, [currentPrice, setCurrentPrice]);

  useEffect(() => {
    if (
      product &&
      product.attributes &&
      product.attributes.attributeCombinations
    ) {
      const attributeskeysArray = Object.keys(
        product.attributes.availableAttributes
      ).every((key) => selectedAttributes[key]);

      if (attributeskeysArray) {
        const selectedCombination =
          product.attributes.attributeCombinations.find(
            (combination: Record<string, string>) => {
              return Object.entries(selectedAttributes).every(
                ([key, value]) => String(combination[key]) === String(value)
              );
            }
          );

        if (selectedCombination && selectedCombination.price) {
          setCurrentPriceInternal(selectedCombination.price);
        } else {
          setCurrentPriceInternal(product?.price);
        }
      } else {
        setCurrentPriceInternal(product?.price);
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
    setLocalQuantity(productInCart?.quantity || 1);
  }, [selectedAttributes, product, products]);

  const isAddButtonEnabled =
    product &&
    product.attributes &&
    Object.keys(product.attributes.availableAttributes).length > 0 &&
    Object.keys(product.attributes.availableAttributes).every(
      (key) => selectedAttributes[key]
    );

  const isQuantityDisabled =
    product &&
    product.attributes &&
    Object.keys(product.attributes.availableAttributes).length > 0 &&
    !Object.keys(product.attributes.availableAttributes).every(
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
    setLocalQuantity(quantity === 0 ? 1 : quantity);
  };

  const updateCartQuantity = (quantity: number) => {
    if (localProductInCart && quantity < 1)
      removeFromCart(localProductInCart, userId || null);
    setLocalQuantity(1);
    //todo say item removed
    if (localProductInCart && quantity > 0) {
      updateCartProduct({ ...localProductInCart }, quantity, userId || null);
    }
  };

  return {
    selectedAttributes,
    localProductInCart,
    localQuantity,
    userId,
    currentPrice,
    isAddButtonEnabled,
    handleAddToCart,
    handleAttributeChange,
    handleQuantityChange,
    updateCartQuantity,
    setSelectedAttributes,
    setLocalQuantity,
    isQuantityDisabled,
  };
};
