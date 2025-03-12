"use client"; // Required for client-side features like clipboard in Next.js

import { useState } from "react";
import { Button } from "@/components/ui/button"; // Shadcn UI Button component
import { Copy, Check } from "lucide-react"; // Icons from lucide-react (Shadcn default)

export default function Info() {
  const [copied, setCopied] = useState(false);

  const cardNumber = "4242424242424242";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cardNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <div className="bg-green-50 border border-green-200 text-green-950 p-4 rounded-lg shadow-sm ">
      <p className="text-sm font-medium">
        Use the Stripe testing Visa card:
        <span className="font-mono bg-green-100 px-2 py-1 rounded mx-1">
          {cardNumber}
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="ml-2 p-1 text-green-700 hover:bg-green-200 hover:text-green-900"
          onClick={handleCopy}
          aria-label="Copy card number"
        >
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </p>
      <p className="text-sm mt-1">
        Any 3-digit CVV, any future date as expiry.
      </p>
    </div>
  );
}
