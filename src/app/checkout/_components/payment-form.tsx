"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, ShoppingCart } from "lucide-react";

type Product = {
  name: string;
  description: string;
  price: number;
  currency: string;
};

type PaymentFormProps = {
  product: Product;
};

export default function PaymentForm({ product }: PaymentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setPaymentError(null);

    try {
      // Confirm the payment
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/success`,
        },
        redirect: "if_required",
      });

      if (error) {
        setPaymentError(error.message || "An error occurred with your payment");
        setIsLoading(false);
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        setPaymentSuccess(true);
        setTimeout(() => {
          router.push(`/success?payment_intent=${paymentIntent.id}`);
        }, 1000);
      } else if (paymentIntent) {
        // Handle other payment intent statuses
        if (paymentIntent.status === "requires_action") {
          // Let Stripe.js handle the rest of the payment flow
          const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
              return_url: `${window.location.origin}/success`,
            },
          });
          if (error) {
            setPaymentError(error.message || "Payment authentication failed");
            setIsLoading(false);
          }
        } else {
          setPaymentError("Payment status: " + paymentIntent.status);
          setIsLoading(false);
        }
      } else {
        setPaymentError("An unexpected error occurred");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      setPaymentError("An error occurred while processing your payment");
      setIsLoading(false);
    }
  };

  // Options for the PaymentElement
  const paymentElementOptions = {
    layout: {
      type: "accordion" as const,
      defaultCollapsed: false,
    },
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Checkout</CardTitle>
        <CardDescription>Complete your purchase</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="font-medium">{product.name}</span>
              <span>${product.price.toFixed(2)}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {product.description}
            </p>

            <div className="space-y-2">
              <label className="text-sm font-medium">Payment Method</label>
              <PaymentElement options={paymentElementOptions} />
              {paymentError && (
                <p className="text-sm text-red-500">{paymentError}</p>
              )}
              {paymentSuccess && (
                <p className="text-sm text-green-500">
                  Payment successful! Redirecting...
                </p>
              )}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${product.price.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            disabled={isLoading || !stripe || !elements || paymentSuccess}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Pay ${product.price.toFixed(2)}
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
