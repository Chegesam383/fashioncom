"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { ShoppingCart as ShoppingIcon, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { CartProduct, useCartStore } from "../../../../store/cart-store";
import QauntityButton from "@/components/product/quantity-button";
import { Separator } from "@/components/ui/separator";

import { Input } from "@/components/ui/input";
import Rating from "@/components/rating/ratings";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useId, useState } from "react";
import { formatPrice } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";

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

type DeliverySectionProps = {
  subtotal: number;
};

const TAX_PERCENT = 0;
const SHIPPING_PERCENT = 5;
const PROMO_CODES = [
  { code: "SAVE10", discount: 10 },
  { code: "WELCOME5", discount: 5 },
];

const expectedDelivaryDate: {
  [key in "free" | "paid"]: string;
} = {
  free: "12 days",
  paid: "3 days",
};

// Component for CartItem
const CartItem: React.FC<CartItemProps> = ({ item, removeFromCart }) => {
  const { userId } = useAuth();

  console.log(item);

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
    <div className="flex flex-col xxs:flex-row items-center gap-4">
      <Link href={"product/" + item.id}>
        <Image
          src={item.imageUrls?.[0] || "/placeholder.png"}
          alt={item.name}
          width={100}
          height={80}
          className="rounded-md object-cover w-36 h-36"
        />
      </Link>
      <div className="flex-1 space-y-1">
        <div className="flex justify-between">
          <div className="space-y-2">
            <Link href={"product/" + item.id}>
              <h3 className="font-bold">{item.name}</h3>
            </Link>
            <p>
              <span className="font-medium">
                {formatPrice(Number(item.price) * item.quantity)}
              </span>

              {item.quantity > 1 && (
                <small className="text-muted-foreground">
                  {" "}
                  ${item.price} each
                </small>
              )}
            </p>
            <p className="text-sm text-muted-foreground text-wrap">
              {attributeString}
            </p>
          </div>

          <div className="hidden md:block align-top mt-2">
            <Rating rating={4} long={true} />
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

// Component for Empty Cart
const EmptyCart: React.FC = () => (
  <div className="grid place-content-center p-16 text-center ">
    <ShoppingIcon size={48} className="mx-auto" />
    <p className="text-muted-foreground mt-4">Your cart is empty.</p>
    <Link href="/shop">
      <Button className="mt-4">Continue Shopping</Button>
    </Link>
  </div>
);

// Component for Delivery Section
const DeliverySection: React.FC<DeliverySectionProps> = ({ subtotal }) => {
  const {
    promoCode,
    setDiscount,
    discount,
    grandTotal,
    setPromoCode,
    shippingCost,
  } = useCartStore();

  // Initialize promoCodeTxt with promoCode from the Zustand store
  const [promoCodeTxt, setPromoCodeTxt] = useState(
    promoCode?.code || "WELCOME5"
  );
  const [promoMsg, setPromoMsg] = useState<string>("");

  const handleApplyPromoCode = () => {
    const promo = PROMO_CODES.find(
      (p) => p.code.trim() === promoCodeTxt.trim()
    );

    if (!promo) {
      setPromoMsg("Invalid promocode!");
    } else {
      setPromoMsg("Promo code applied! -valid codes are WELCOME5 and SAVE10");
      setDiscount((subtotal * promo.discount) / 100);
      if (subtotal > 0) setPromoCode(promo);
    }
  };

  return (
    <Card className="col-span-3 shadow-sm w-full h-fit mx-auto">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Delivery</h2>
        <div className="space-y-6">
          <ShippingSelector />

          {/* Promo code input */}

          <div className="flex gap-2">
            <Input
              placeholder="Promocode"
              value={promoCodeTxt}
              onChange={(e) => {
                setPromoCodeTxt(e.target.value);
                setPromoMsg(""); // Reset message when typing
              }}
            />
            <Button onClick={handleApplyPromoCode}>Apply</Button>
          </div>

          {/* Display error or success message */}
          {promoMsg && subtotal > 0 && (
            <span
              className={`text-sm ${
                promoMsg.includes("Invalid") ? "text-red-500" : "text-green-500"
              }`}
            >
              {promoMsg}
            </span>
          )}

          <Separator />

          {/* Pricing breakdown */}
          <div className="space-y-4">
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

          {/* Checkout buttons */}
          <div className="space-y-2">
            {subtotal > 0 ? (
              <Button className="w-full" size="lg" asChild>
                <Link href="/checkout">Proceed to checkout</Link>
              </Button>
            ) : (
              <Button className="w-full" size="lg" disabled asChild>
                Add products to checkout
              </Button>
            )}
            <Button variant="outline" className="w-full" size="lg">
              Continue shopping
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function ShoppingCart() {
  const { subtotal, products, removeFromCart, clearCart } = useCartStore();
  const { userId } = useAuth();

  return (
    <section className="min-h-screen p-4 md:p-6 ">
      <div className="lg:container mx-auto flex justify-between items-center ">
        <div className="flex w-full lg:w-[70%] justify-between">
          <h2 className="text-3xl font-semibold mb-4">Cart</h2>
          {products.length > 0 && (
            <Button
              size={"sm"}
              variant={"outline"}
              onClick={() => clearCart(userId || null)}
              className="text-red-500"
            >
              <Trash2 /> Clear cart
            </Button>
          )}
        </div>
        <div className="div"></div>
      </div>
      <div className="lg:container mx-auto w-full lg:grid gap-4 space-y-2 lg:space-y-0 grid-cols-10">
        {/* Cart Section */}
        <Card className="col-span-7 shadow-sm h-fit">
          <CardContent className="p-6">
            <div className="space-y-4">
              {products.length === 0 ? (
                <EmptyCart />
              ) : (
                products.map((item, index) => (
                  <div key={index}>
                    <CartItem
                      item={item}
                      removeFromCart={(product) =>
                        removeFromCart(product, userId || null)
                      }
                    />
                    <Separator
                      className={`${
                        index == products.length - 1 && "hidden"
                      } my-2`}
                    />
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Delivery Section */}
        <DeliverySection subtotal={subtotal} />
      </div>
    </section>
  );
}

function ShippingSelector() {
  const SHIPPING_PERCENT = 5;
  const { setShippingCost, subtotal } = useCartStore();
  const id = useId();
  const [selectedValue, setSelectedValue] = useState<"free" | "paid">("free");

  // Update the shipping cost when selectedValue changes
  useEffect(() => {
    if (selectedValue === "free") {
      setShippingCost(0); // Free shipping
    } else if (selectedValue === "paid") {
      const calculatedShippingCost = subtotal * (SHIPPING_PERCENT / 100);
      setShippingCost(calculatedShippingCost); // Paid shipping
    }
  }, [selectedValue, subtotal, setShippingCost]);

  return (
    <div>
      <div className="bg-input/50 inline-flex h-9 rounded-md p-0.5 w-full">
        <RadioGroup
          value={selectedValue}
          onValueChange={(value) => setSelectedValue(value as "free" | "paid")}
          className="w-full group after:bg-background has-focus-visible:after:border-ring has-focus-visible:after:ring-ring/50 relative inline-grid grid-cols-[1fr_1fr] items-center gap-0 text-sm font-medium after:absolute after:inset-y-0 after:w-1/2 after:rounded-sm after:shadow-xs after:transition-transform after:duration-300 after:ease-in-out has-focus-visible:after:ring-[3px] data-[state=free]:after:translate-x-0 data-[state=paid]:after:translate-x-full"
          data-state={selectedValue}
        >
          <label className="group-data-[state=free]:text-primary relative z-10 inline-flex h-full min-w-8 cursor-pointer items-center justify-center px-4 whitespace-nowrap transition-colors select-none">
            Free delivery
            <RadioGroupItem id={`${id}-1`} value="free" className="sr-only" />
          </label>
          <label className="group-data-[state=paid]:text-primary relative z-10 inline-flex h-full min-w-8 cursor-pointer items-center justify-center px-4 whitespace-nowrap transition-colors select-none">
            <span>
              <p className="group-data-[state=paid]:text-primary transition-colors group-data-[state=free]:text-muted-foreground">
                Express ({formatPrice(subtotal * (SHIPPING_PERCENT / 100))})
              </p>
            </span>
            <RadioGroupItem id={`${id}-2`} value="paid" className="sr-only" />
          </label>
        </RadioGroup>
      </div>
      <small className="text-muted-foreground mt-2">
        {/* todo add a date lib */}
        Expected delivery in {expectedDelivaryDate[selectedValue]}
      </small>
    </div>
  );
}
