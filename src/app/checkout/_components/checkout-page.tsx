"use client";

import { useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Stripe } from "@stripe/stripe-js";
import { Loader2 } from "lucide-react";

import EcommerceCheckout from "./ecommerce-checkout";

import { createPaymentIntent } from "@/actions/payment";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  image: string;
  quantity: number;
}

interface PaymentIntentResponse {
  clientSecret: string;
}

const sampleProducts: Product[] = [
  {
    id: "prod_1",
    name: "Premium Headphones",
    description: "Wireless noise-cancelling headphones",
    price: 149.99,
    currency: "USD",
    image: "/placeholder.svg?height=100&width=100",
    quantity: 1,
  },
  {
    id: "prod_2",
    name: "Smart Watch",
    description: "Fitness and health tracking smartwatch",
    price: 199.99,
    currency: "USD",
    image: "/placeholder.svg?height=100&width=100",
    quantity: 1,
  },
];

export default function CheckoutPage() {
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null>>(
    () => Promise.resolve(null)
  );
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const totalAmount = sampleProducts.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0
  );

  useEffect(() => {
    const envPublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!envPublishableKey) console.error("Missing stripe publishable key");
    if (envPublishableKey && envPublishableKey.startsWith("pk_")) {
      const l = loadStripe(envPublishableKey);
      setStripePromise(l);
      createIntent();
    }
  }, []);

  const createIntent = async (secretKeyParam?: string) => {
    try {
      setIsLoading(true);
      const { clientSecret } = (await createPaymentIntent({
        amount: totalAmount,
        currency: "USD",
        stripeSecretKey: secretKeyParam || undefined,
      })) as PaymentIntentResponse;
      setClientSecret(clientSecret);
    } catch (error) {
      console.error("Error creating payment intent:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !stripePromise || !clientSecret) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">
          Initializing checkout...
        </p>
      </div>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        locale: "en",
      }}
    >
      <EcommerceCheckout />
    </Elements>
  );
}
