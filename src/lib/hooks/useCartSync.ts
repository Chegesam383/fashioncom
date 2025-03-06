"use client";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useCartStore } from "../../../store/cart-store";

export const useCartSync = () => {
  const { userId, isLoaded } = useAuth();
  const mergeCarts = useCartStore((state) => state.mergeCarts);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoaded && userId) {
      setLoading(true);
      mergeCarts(userId).finally(() => setLoading(false));
    }
  }, [userId, isLoaded, mergeCarts]);

  return loading;
};
