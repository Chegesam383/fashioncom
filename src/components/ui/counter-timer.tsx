"use client";

import { useEffect, useState } from "react";
import { SlidingNumber } from "./sliding-number";
import { Timer } from "lucide-react";

export default function Clock() {
  const [hours, setHours] = useState(new Date().getHours());
  const [minutes, setMinutes] = useState(new Date().getMinutes());
  const [seconds, setSeconds] = useState(new Date().getSeconds());

  useEffect(() => {
    const interval = setInterval(() => {
      setHours(new Date().getHours());
      setMinutes(new Date().getMinutes());
      setSeconds(new Date().getSeconds());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-0.5 font-mono bg-red-500/90 text-white text-xl px-4 py-2 rounded-lg font-bold">
      <Timer className="mr-3" />
      <SlidingNumber value={hours} padStart={true} label="h" />
      <span className="">:</span>
      <SlidingNumber value={minutes} padStart={true} label="min" />
      <span className="">:</span>
      <SlidingNumber value={seconds} padStart={true} label="sec" />
    </div>
  );
}
