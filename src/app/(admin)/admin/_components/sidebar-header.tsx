"use client";
import { useSidebar } from "@/components/ui/sidebar";

export default function SidebarHeaderWithToggle() {
  const { open } = useSidebar();

  return (
    <>
      {open ? (
        <h1 className="font-bold text-xl">Fashionist</h1>
      ) : (
        <h1 className="font-bold text-xl">F</h1>
      )}
    </>
  );
}
