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
import Info from "./Info";

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
        theme: "flat",
        variables: {
          colorPrimary: theme === "dark" ? "#3b82f6" : "#2563eb", // Blue-500/600
          colorBackground: theme === "dark" ? "#0f172a" : "#f8fafc", // slate-950/slate-50
          colorText: theme === "dark" ? "#d1d5db" : "#1f2937", // slate-300/slate-800
          colorDanger: theme === "dark" ? "#f87171" : "#ef4444", // red-400/red-500
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSizeBase: "16px",
          spacingUnit: "4px",
          borderRadius: "6px",
          colorTextSecondary: theme === "dark" ? "#9ca3af" : "#6b7280", // slate-400/slate-500
          colorTextPlaceholder: theme === "dark" ? "#6b7280" : "#9ca3af", // slate-500/slate-400
        },
        rules: {
          ".AccordionItem": {
            backgroundColor: theme === "dark" ? "#0f172a" : "#ffffff", // slate-950/white
            // Border removed
          },
          ".AccordionHeader": {
            color: theme === "dark" ? "#d1d5db" : "#1f2937", // slate-300/slate-800
            padding: "10px 16px",
          },
          ".Block": {
            backgroundColor: "var(--colorBackground)", // slate-950 in dark mode
            boxShadow: "none",
            padding: "12px",
          },
          ".Input": {
            border: `1px solid ${theme === "dark" ? "#1e293b" : "#d1d5db"}`, // slate-900/slate-300
            padding: "10px 16px",
            boxShadow: "none",
            transition: "all 0.2s ease",
            backgroundColor: theme === "dark" ? "#0f172a" : "#ffffff", // slate-950/white
            color: theme === "dark" ? "#d1d5db" : "#1f2937", // slate-300/slate-800
            borderColor: theme === "dark" ? "#1e293b" : "#d1d5db", // slate-900/slate-300
          },
          ".Input:focus": {
            borderColor: theme === "dark" ? "#3b82f6" : "#2563eb", // Blue-500/600
            boxShadow: `0 0 0 2px ${
              theme === "dark"
                ? "rgba(59, 130, 246, 0.2)" // Blue-500 with opacity
                : "rgba(37, 99, 235, 0.2)" // Blue-600 with opacity
            }`,
          },
          ".Input:hover": {
            borderColor: theme === "dark" ? "#374151" : "#9ca3af", // slate-700/slate-400
          },
          ".Input--invalid": {
            borderColor: theme === "dark" ? "#f87171" : "#ef4444", // red-400/red-500
            boxShadow: `0 0 0 2px ${
              theme === "dark"
                ? "rgba(248, 113, 113, 0.2)" // red-400 with opacity
                : "rgba(239, 68, 68, 0.2)" // red-500 with opacity
            }`,
          },
          ".Label": {
            color: theme === "dark" ? "#d1d5db" : "#1f2937", // slate-300/slate-800
            fontWeight: "500",
            marginBottom: "8px",
          },
          ".Error": {
            color: theme === "dark" ? "#f87171" : "#ef4444", // red-400/red-500
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
        <Info />
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
