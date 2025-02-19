"use client";

import { useState, useEffect } from "react";

interface CountdownTimerProps {
  endDate: Date;
}

export default function CountdownTimer({ endDate }: CountdownTimerProps) {
  const calculateTimeLeft = () => {
    const difference = +endDate - +new Date();
    if (difference <= 0) return null;

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    if (!timeLeft) return;

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <div className="text-center mb-12" aria-live="polite">
      <h3 className="text-2xl font-semibold mb-4 text-primary">
        Sale Ends In:
      </h3>
      <div className="flex justify-center space-x-4">
        {timeLeft ? (
          Object.entries(timeLeft).map(([interval, value]) => (
            <div key={interval} className="flex flex-col items-center p-4">
              <span className="text-3xl font-bold ">{value}</span>
              <span className="text-xs uppercase text-muted-foreground">
                {interval}
              </span>
            </div>
          ))
        ) : (
          <span className="text-2xl text-white">Time&apos;s up!</span>
        )}
      </div>
    </div>
  );
}
