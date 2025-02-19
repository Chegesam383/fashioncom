"use client";

import React from "react";
import Link from "next/link";
import { ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { product, products } from "@/lib/fakedata";

const CartPage = () => {
  const cartItems = products
    .slice(0, 7)
    .map(({ title, price, images }: product) => ({
      id: 1,
      title,
      price,
      quantity: 1,
      imageURL: images[0],
    }));

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
      <div className="block md:flex gap-4 w-full ">
        <div className="flex-1">
          {cartItems.length === 0 ? (
            <div className="text-center">
              <ShoppingCart size={48} className="mx-auto" />
              <p className="text-gray-600 mt-4">Your cart is empty.</p>
              <Link href="/shop">
                <Button className="mt-4">Continue Shopping</Button>
              </Link>
            </div>
          ) : (
            <div className="">
              {cartItems.map((item, index) => (
                <Card
                  key={index}
                  className="flex items-center gap-4 p-4 my-2 shadow-none"
                >
                  <Image
                    src={item.imageURL}
                    alt={item.title}
                    width={80}
                    height={80}
                    className="rounded-md"
                  />
                  <CardContent className="flex-1">
                    <h2 className="text-lg font-semibold">{item.title}</h2>
                    <p className="">${item.price.toFixed(2)}</p>
                    <p className="text-muted-foreground">
                      Quantity: {item.quantity}
                    </p>
                  </CardContent>
                  <Button variant="outline" size="icon">
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

const Checkout = ({ subtotal }: { subtotal: number }) => (
  <div className="p-6 border flex flex-col gap-4 rounded-lg bg-white h-full">
    <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
    <p className="text-gray-700 mb-2">
      Subtotal: <span className="font-bold">${subtotal.toFixed(2)}</span>
    </p>
    <p className="text-gray-500 text-sm mb-4 flex-1">
      Taxes and shipping calculated at checkout.
    </p>
    <Button className="w-full">Proceed to Checkout</Button>
  </div>
);
