"use server";

import Stripe from "stripe";

type CheckoutSessionParams = {
  productName: string;
  productDescription: string;
  amount: number;
  currency: string;
  stripeSecretKey?: string;
};

type PaymentIntentParams = {
  amount: number;
  currency: string;
  stripeSecretKey?: string;
};

export async function createCheckoutSession(
  params: CheckoutSessionParams
): Promise<string> {
  const { productName, productDescription, amount, currency, stripeSecretKey } =
    params;

  // Use the provided secret key or fall back to environment variable
  const secretKey = stripeSecretKey || process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error("Stripe secret key is not configured");
  }

  const stripe = new Stripe(secretKey, {
    apiVersion: "2025-02-24.acacia",
  });

  try {
    // Convert amount to cents/smallest currency unit
    const unitAmount = Math.round(amount * 100);

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: productName,
              description: productDescription,
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${
        process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000"
      }/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${
        process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000"
      }/cancel`,
    });

    return session.url || "/";
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw new Error("Failed to create checkout session");
  }
}

export async function createPaymentIntent(params: PaymentIntentParams) {
  const { amount, currency, stripeSecretKey } = params;

  // Use the provided secret key or fall back to environment variable
  const secretKey = stripeSecretKey || process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error("Stripe secret key is not configured");
  }

  const stripe = new Stripe(secretKey, {
    apiVersion: "2025-02-24.acacia",
  });

  try {
    // Convert amount to cents/smallest currency unit
    const unitAmount = Math.round(amount * 100);

    // Create PaymentIntent with multiple payment method types
    const paymentIntent = await stripe.paymentIntents.create({
      amount: unitAmount,
      currency: currency.toLowerCase(),
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id,
    };
  } catch (error) {
    console.error("Error creating payment intent:", error);
    throw new Error("Failed to create payment intent");
  }
}
