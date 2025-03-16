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
          colorPrimary: "var(--primary)",
          colorBackground: "var(--background)",
          colorText: theme === "dark" ? "#ffffff" : "#1f2937", // Direct theme text color
          colorDanger: "var(--destructive)",
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSizeBase: "16px",
          spacingUnit: "4px",
          borderRadius: "6px",
          colorTextSecondary: theme === "dark" ? "#9ca3af" : "#6b7280", // Direct theme text color
          colorTextPlaceholder: theme === "dark" ? "#6b7280" : "#9ca3af", // Direct theme text color
        },
        rules: {
          ".AccordionItem": {
            backgroundColor:
              theme === "dark" ? "var(--card)" : "var(--background)",
            border: "none",
          },
          ".AccordionHeader": {
            color: theme === "dark" ? "#d1d5db" : "#1f2937", // Direct theme text color
            padding: "10px 16px",
            border: "none",
          },
          ".Block": {
            backgroundColor:
              theme === "dark" ? "var(--card)" : "var(--background)",
            boxShadow: "none",
            padding: "12px",
            border: "none",
          },
          ".Input": {
            border: `1px solid ${theme === "dark" ? "#374151" : "#d1d5db"}`,
            padding: "10px 16px",
            boxShadow: "none",
            transition: "all 0.2s ease",
            backgroundColor:
              theme === "dark" ? "var(--card)" : "var(--background)",
            color: theme === "dark" ? "#d1d5db" : "#1f2937", // Direct theme text color
          },
          ".Input:focus": {
            borderColor: "var(--primary)",
            boxShadow: "0 0 0 2px var(--ring)",
          },
          ".Input:hover": {
            borderColor: "var(--input-border)",
          },
          ".Input--invalid": {
            borderColor: "var(--destructive)",
            boxShadow: "0 0 0 2px var(--destructive-foreground)",
          },
          ".Label": {
            color: theme === "dark" ? "#d1d5db" : "#1f2937", // Direct theme text color
            fontWeight: "500",
            marginBottom: "8px",
          },
          ".Error": {
            color: theme === "dark" ? "#f87171" : "#ef4444", // Direct theme text color
            fontSize: "14px",
            marginTop: "4px",
          },
          "::placeholder": {
            color: theme === "dark" ? "#6b7280" : "#9ca3af", // Direct theme text color
          },
        },
      },
    }),
    [clientSecret, theme]
  );

  return (
    <Card className="w-full shadow-none">
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
