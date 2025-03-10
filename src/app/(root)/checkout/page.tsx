"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ChevronLeft, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { CartProduct, useCartStore } from "../../../../store/cart-store";
import QauntityButton from "@/components/product/quantity-button";
import { Separator } from "@/components/ui/separator";

import { formatPrice } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";
import CheckoutPage from "./_components/checkout-page";
import AddressSelection from "./_components/address";

type CartItemProps = {
  item: {
    id: string;
    name: string;
    price: string;
    imageUrls: string[] | null;
    quantity: number;
    attributes: { selectedAttributes: { [key: string]: string }[] };
  };
  removeFromCart: (
    product: CartProduct,
    userId: string | null
  ) => Promise<void>;
};

type CartSummary = {
  subtotal: number;
};

type CheckoutStep = "address" | "payment";

const TAX_PERCENT = 0;
const SHIPPING_PERCENT = 5;

export default function Page() {
  const { subtotal, products } = useCartStore();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("address");

  const handleNext = () => {
    setCurrentStep((prev) => (prev === "address" ? "payment" : "address"));
  };

  return (
    <section className="min-h-screen p-4 md:p-6 ">
      <div className="lg:container mx-auto flex justify-between items-center ">
        <div className="flex w-full lg:w-[60%] justify-between">
          <h2 className="text-3xl font-semibold mb-4">Checkout</h2>
          {products.length > 0 && (
            <Link href="/cart">
              <Button size={"sm"} variant={"outline"}>
                <ChevronLeft></ChevronLeft> Back to cart
              </Button>
            </Link>
          )}
        </div>
        <div className="div"></div>
      </div>
      <div className="lg:container mx-auto w-full lg:grid gap-4 space-y-2 lg:space-y-0 grid-cols-10">
        <div className="col-span-6">
          <div className="">
            {currentStep === "address" && (
              <AddressSelection onSelect={handleNext} />
            )}
            {currentStep === "payment" && <CheckoutPage />}
          </div>
          <div className="flex justify-end mt-4">
            <Button onClick={handleNext}>
              {currentStep === "payment" && <ArrowLeft />}

              {currentStep === "address" ? "Payment" : "Address"}
              {currentStep === "address" && <ArrowRight />}
            </Button>
          </div>
        </div>

        {/* Cartummary Section */}
        <CartSummary subtotal={subtotal} />
      </div>
    </section>
  );
}

const CartSummary: React.FC<CartSummary> = ({ subtotal }) => {
  const { promoCode, discount, grandTotal, shippingCost } = useCartStore();

  return (
    <Card className="col-span-4 shadow-sm w-full h-fit mx-auto">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <div className="space-y-6">
          <ShoppingCart />

          {/* Pricing breakdown */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Discount</span>
              <span>
                {promoCode?.discount}%&nbsp; -{formatPrice(discount)}
              </span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Tax</span>
              <span>
                {TAX_PERCENT}% -
                {formatPrice(((subtotal - discount) * TAX_PERCENT) / 100)}
              </span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping</span>
              <span>
                {SHIPPING_PERCENT}% - {formatPrice(shippingCost)}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between font-medium">
              <span className="font-bold">Total</span>
              <span className="font-bold">{formatPrice(grandTotal)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Component for CartItem
const CartItem: React.FC<CartItemProps> = ({ item, removeFromCart }) => {
  const { userId } = useAuth();

  let attributeString;

  if (
    item &&
    item.attributes &&
    Array.isArray(item.attributes.selectedAttributes)
  ) {
    attributeString = item.attributes.selectedAttributes
      ?.map((attr) => {
        const [key, value] = Object.entries(attr)[0];
        return `${key} - ${value}`;
      })
      .join(", ");
  }

  return (
    <div className="flex flex-row items-center ">
      <Link href={"product/" + item.id}>
        <Image
          src={item.imageUrls?.[0] || "/placeholder.png"}
          alt={item.name}
          width={100}
          height={80}
          className="rounded-md object-cover w-20 h-20"
        />
      </Link>
      <div className="flex-1 space-y-1">
        <div className="flex justify-between">
          <div className="space-y-1">
            <Link href={"product/" + item.id}>
              <p className=" text-md">{item.name}</p>
            </Link>
            <p>
              <span className="font-extralight text-sm">
                {formatPrice(Number(item.price) * item.quantity)}
              </span>

              {item.quantity > 1 && (
                <small className="text-muted-foreground">
                  &nbsp; {formatPrice(Number(item.price))} each
                </small>
              )}
            </p>
            <p className="text-sm text-muted-foreground text-wrap">
              {attributeString}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <QauntityButton productInCart={item} />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeFromCart(item, userId || null)}
            className="justify-self-end"
          >
            <Trash2 className="w-5 h-5 text-red-500" />
          </Button>
        </div>
      </div>
    </div>
  );
};

function ShoppingCart() {
  const { products, removeFromCart } = useCartStore();
  const { userId } = useAuth();

  return (
    <>
      {products.map((item, index) => (
        <div key={index}>
          <CartItem
            item={item}
            removeFromCart={(product) =>
              removeFromCart(product, userId || null)
            }
          />
          <Separator
            className={`${index == products.length - 1 && "mb-3"} my-1`}
          />
        </div>
      ))}
    </>
  );
}
