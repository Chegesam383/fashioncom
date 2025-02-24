"use client";

import React from "react";
import Link from "next/link";
import { ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useCartStore } from "../../../store/cart-store";
import QauntityButton from "@/components/ui/quantity-button";

const CartPage = () => {
  const { subtotal, products, removeFromCart } = useCartStore();

  return (
    <div className="lg:container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>

      <div className="block md:flex gap-4 w-full ">
        <div className="flex-1">
          {products.length === 0 ? (
            <div className="text-center">
              <ShoppingCart size={48} className="mx-auto" />
              <p className="text-muted-foreground mt-4">Your cart is empty.</p>
              <Link href="/shop">
                <Button className="mt-4">Continue Shopping</Button>
              </Link>
            </div>
          ) : (
            <div className="">
              {products.map((item, index) => (
                <Card
                  key={index}
                  className="flex items-center gap  shadow-none border-none"
                >
                  <Image
                    src={item.images[0]}
                    alt={item.title}
                    width={80}
                    height={80}
                    className="rounded-md"
                  />
                  <CardContent className="flex-1">
                    <h2 className="text-lg font-semibold">{item.title}</h2>
                    <p className="mb-2">${item.price.toFixed(2)}</p>

                    <QauntityButton productInCart={item} />
                  </CardContent>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </div>
        <Checkout subtotal={subtotal} />
      </div>
    </div>
  );
};

export default CartPage;

function Checkout({ subtotal }: { subtotal: number }) {
  return (
    <Card className="p-6 border-0 flex flex-col gap-4 rounded-lg  h-full">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      <p className="text-muted-foreground mb-2">
        Subtotal: <span className="font-bold">${subtotal.toFixed(2)}</span>
      </p>
      <p className="text-muted-foreground text-sm mb-4 flex-1">
        Taxes and shipping calculated at checkout.
      </p>
      <Button className="w-full" variant={"default"}>
        Proceed to Checkout
      </Button>
    </Card>
  );
}
