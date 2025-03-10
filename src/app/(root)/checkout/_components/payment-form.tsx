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
import { Loader2, Check, ChevronRight } from "lucide-react";
import { useCartStore } from "../../../../../store/cart-store";
import { formatPrice } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";

export default function EcommerceCheckout() {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const { grandTotal, clearCart } = useCartStore();
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { userId } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setPaymentError(null);

    try {
      const { error: submitError } = await elements.submit();

      if (submitError) {
        setPaymentError(
          submitError.message || "Please check your payment details"
        );
        setIsLoading(false);
        return;
      }

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/success`,
          receipt_email: "sam@gmail.com",
        },
        redirect: "if_required",
      });

      if (error) {
        setPaymentError(error.message || "An error occurred with your payment");
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        setPaymentSuccess(true);
        clearCart(userId || null);
        //todo sucessfull logic

        setTimeout(() => {
          router.push(`/success?payment_intent=${paymentIntent.id}`);
        }, 1000);
      } else if (paymentIntent) {
        if (paymentIntent.status === "requires_action") {
          const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
              return_url: `${window.location.origin}/success`,
              receipt_email: "sam@gmail.com",
            },
          });
          if (error) {
            setPaymentError(error.message || "Payment authentication failed");
          }
        } else {
          setPaymentError("Payment status: " + paymentIntent.status);
        }
      } else {
        setPaymentError("An unexpected error occurred");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      setPaymentError("An error occurred while processing your payment");
    } finally {
      setIsLoading(false);
    }
  };

  const paymentElementOptions = {
    layout: {
      type: "accordion" as const,
      defaultCollapsed: false,
    },
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <div className="mt-1 rounded-md overflow-hidden">
            <PaymentElement options={paymentElementOptions} />
          </div>

          {paymentError && (
            <p className="text-sm text-red-500 mt-2">{paymentError}</p>
          )}

          {paymentSuccess && (
            <p className="text-sm text-green-600 mt-2 flex items-center">
              <Check className="h-4 w-4 mr-1" />
              Payment successful! Redirecting...
            </p>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || !stripe || !elements || paymentSuccess}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Pay {formatPrice(grandTotal)}
              <ChevronRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
