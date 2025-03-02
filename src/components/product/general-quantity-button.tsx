"use client";

import React from "react";
import { Button } from "../ui/button";

interface QuantityAdjusterProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  isLarge?: boolean;
}

const QuantityAdjuster: React.FC<QuantityAdjusterProps> = ({
  quantity,
  onQuantityChange,
  isLarge = false,
}) => {
  const handleIncrement = () => {
    onQuantityChange(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      onQuantityChange(quantity - 1);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="default"
        size={"icon"}
        onClick={handleDecrement}
        className={isLarge ? "h-10 w-10 rounded-full" : "h-8 w-8 rounded-full"}
        disabled={quantity <= 1}
      >
        -
      </Button>
      <span className={isLarge ? "text-lg flex-1" : "flex-1"}>{quantity}</span>
      <Button
        variant="secondary"
        size={"icon"}
        onClick={handleIncrement}
        className={isLarge ? "h-10 w-10 rounded-full" : "h-8 w-8 rounded-full"}
      >
        +
      </Button>
    </div>
  );
};

export default QuantityAdjuster;
