// components/CartSyncWrapper.tsx
"use client";

import { useCartSync } from "@/lib/hooks/useCartSync";

export function CartSyncWrapper({ children }: { children: React.ReactNode }) {
  useCartSync();

  return <>{children}</>;
}
