"use client";

import { useState, useEffect } from "react";

interface CountdownTimerProps {
  days?: number;
  hours?: number;
  minutes?: number;
}

export default function CountdownTimer({
  days = 1,
  hours = 0,
  minutes = 0,
}: CountdownTimerProps) {
  const calculateTotalSeconds = () => {
    return days * 24 * 60 * 60 + hours * 60 * 60 + minutes * 60;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTotalSeconds());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setTimeLeft(calculateTotalSeconds());
  }, [days, hours, minutes]);

  const daysLeft = Math.floor(timeLeft / (24 * 60 * 60));
  const hoursLeft = Math.floor((timeLeft % (24 * 60 * 60)) / (60 * 60));
  const minutesLeft = Math.floor((timeLeft % (60 * 60)) / 60);
  const secondsLeft = timeLeft % 60;

  return (
    <div className="flex justify-center items-center gap-4 text-center">
      {daysLeft > 0 && (
        <div className="flex items-baseline">
          <span className="text-xl font-mono tabular-nums font-bold mr-1">
            {daysLeft}
          </span>
          <span className="text-sm text-muted-foreground">days</span>
        </div>
      )}

      <div className="flex items-baseline">
        <span className="text-xl font-mono tabular-nums font-bold mr-1">
          {hoursLeft}
        </span>
        <span className="text-sm text-muted-foreground">h</span>
      </div>

      <div className="flex items-baseline">
        <span className="text-xl font-mono tabular-nums font-bold mr-1">
          {minutesLeft}
        </span>
        <span className="text-sm text-muted-foreground">min</span>
      </div>

      <div className="flex items-baseline">
        <span className="text-xl font-mono tabular-nums font-bold mr-1">
          {secondsLeft}
        </span>
        <span className="text-sm text-muted-foreground">sec</span>
      </div>
    </div>
  );
}
