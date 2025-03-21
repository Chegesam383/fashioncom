"use client";

import React from "react";
import { Button } from "../ui/button";
import { Minus, Plus } from "lucide-react";

interface QuantityAdjusterProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  isLarge?: boolean;
  isDissabled?: boolean;
}

const QuantityAdjuster: React.FC<QuantityAdjusterProps> = ({
  quantity,
  onQuantityChange,
  isLarge = false,
  isDissabled,
}) => {
  const handleIncrement = () => {
    onQuantityChange(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      onQuantityChange(quantity - 1);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="secondary"
        size={"icon"}
        onClick={handleDecrement}
        className={isLarge ? "h-10 w-10 rounded-full" : "h-8 w-8 rounded-full"}
        disabled={isDissabled}
      >
        <Minus />
      </Button>
      <span className={isLarge ? "text-lg flex-1" : "flex-1"}>{quantity}</span>
      <Button
        variant="secondary"
        size={"icon"}
        onClick={handleIncrement}
        className={isLarge ? "h-10 w-10 rounded-full" : "h-8 w-8 rounded-full"}
        disabled={isDissabled}
      >
        <Plus />
      </Button>
    </div>
  );
};

export default QuantityAdjuster;
