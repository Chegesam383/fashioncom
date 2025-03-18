"use client";
import { Switch } from "@/components/ui/switch";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";

export default function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [checked, setChecked] = useState<boolean>(theme === "light");

  const handleToggle = () => {
    const newTheme = checked ? "dark" : "light";
    setTheme(newTheme);
    setChecked(!checked);
  };

  return (
    <div
      className="group inline-flex items-center gap-2"
      data-state={checked ? "checked" : "unchecked"}
    >
      <span
        className="group-data-[state=checked]:text-muted-foreground/70 flex-1 cursor-pointer text-right text-sm font-medium"
        onClick={handleToggle}
      >
        <MoonIcon size={16} aria-hidden="true" />
      </span>
      <Switch
        checked={checked}
        onCheckedChange={handleToggle}
        aria-label="Toggle between dark and light mode"
      />
      <span
        className="group-data-[state=unchecked]:text-muted-foreground/70 flex-1 cursor-pointer text-left text-sm font-medium"
        onClick={() => setChecked(true)}
      >
        <SunIcon size={16} aria-hidden="true" />
      </span>
    </div>
  );
}
