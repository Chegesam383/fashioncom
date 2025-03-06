// components/CartSyncWrapper.tsx
"use client";

import { useCartSync } from "@/lib/hooks/useCartSync";

export function CartSyncWrapper({ children }: { children: React.ReactNode }) {
  const loading = useCartSync();

  return (
    <>
      {loading && <div>Updating Cart...</div>}
      {children}
    </>
  );
}
