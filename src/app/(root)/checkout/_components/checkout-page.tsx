"use client";

import { useState, useEffect, useMemo } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Stripe, StripeElementsOptions } from "@stripe/stripe-js";
import { Loader2 } from "lucide-react";
import { useTheme } from "next-themes";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";

import EcommerceCheckout from "./payment-form";
import { createPaymentIntent } from "@/actions/payment";
import { useCartStore } from "../../../../../store/cart-store";

interface PaymentIntentResponse {
  clientSecret: string;
}

export default function CheckoutPage() {
  const { theme } = useTheme();
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null>>(
    () => Promise.resolve(null)
  );
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { grandTotal } = useCartStore();

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
        amount: grandTotal,
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

  const options: StripeElementsOptions = useMemo(
    () => ({
      clientSecret: clientSecret || "",
      locale: "en",
      appearance: {
        variables: {
          colorPrimary: theme === "dark" ? "#3b82f6" : "#2563eb", // Blue shades
          colorBackground: theme === "dark" ? "#0f172a" : "#f8fafc", // slate-800/white
          colorText: theme === "dark" ? "#d1d5db" : "#1f2937", // slate-300/slate-800
          colorDanger: theme === "dark" ? "#f87171" : "#ef4444", // Red-400/red-500
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSizeBase: "16px",
          spacingUnit: "4px",
          borderRadius: "6px",
          colorTextSecondary: theme === "dark" ? "#9ca3af" : "#6b7280", // slate-400/500
          colorTextPlaceholder: theme === "dark" ? "#6b7280" : "#9ca3af", // slate-500/400
        },
        rules: {
          ".AccordionItem": {
            backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
            border: `1px solid ${theme === "dark" ? "#374151" : "#d1d5db"}`,
          },
          ".AccordionHeader": {
            color: theme === "dark" ? "#d1d5db" : "#1f2937",
            padding: "10px 16px",
          },
          ".Input": {
            border: `1px solid ${theme === "dark" ? "#374151" : "#d1d5db"}`, // slate-700/300
            padding: "10px 16px",
            boxShadow: "none",
            transition: "all 0.2s ease",
            backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
            color: theme === "dark" ? "#d1d5db" : "#1f2937",
          },
          ".Input:focus": {
            borderColor: theme === "dark" ? "#3b82f6" : "#2563eb",
            boxShadow: `0 0 0 2px ${
              theme === "dark"
                ? "rgba(59, 130, 246, 0.2)"
                : "rgba(37, 99, 235, 0.2)"
            }`,
          },
          ".Input:hover": {
            borderColor: theme === "dark" ? "#4b5563" : "#9ca3af", // slate-600/400
          },
          ".Input--invalid": {
            borderColor: theme === "dark" ? "#f87171" : "#ef4444",
            boxShadow: `0 0 0 2px ${
              theme === "dark"
                ? "rgba(248, 113, 113, 0.2)"
                : "rgba(239, 68, 68, 0.2)"
            }`,
          },
          ".Label": {
            color: theme === "dark" ? "#d1d5db" : "#1f2937",
            fontWeight: "500",
            marginBottom: "8px",
          },
          ".Error": {
            color: theme === "dark" ? "#f87171" : "#ef4444",
            fontSize: "14px",
            marginTop: "4px",
          },
        },
      },
    }),
    [clientSecret, theme]
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardDescription>Select a payment method and pay</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-green-50 text-green-950 p-4 rounded">
          Use the stripe testing visa card number 4242424242424242 any 3 digits
          cvv any future date as expiry.
        </div>
        {isLoading || !stripePromise || !clientSecret ? (
          <div className="flex flex-col items-center justify-center min-h-[200px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Initializing checkout...</p>
          </div>
        ) : (
          <Elements key={theme} stripe={stripePromise} options={options}>
            <EcommerceCheckout />
          </Elements>
        )}
      </CardContent>
    </Card>
  );
}
