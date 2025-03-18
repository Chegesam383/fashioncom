"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { User, Settings, Heart, ShoppingBag } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";

import { Separator } from "@/components/ui/separator";
import { useUser } from "@clerk/nextjs";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { id: "profile", label: "Profile", icon: User, href: "/profile" },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      href: "/profile/settings",
    },
    {
      id: "wishlist",
      label: "Wishlist",
      icon: Heart,
      href: "/profile/wishlist",
    },
    {
      id: "orders",
      label: "Orders",
      icon: ShoppingBag,
      href: "/profile/orders",
    },
  ];

  const isActive = (href: string) => {
    if (href === "/profile") {
      return pathname === "/profile";
    }
    return pathname.startsWith(href);
  };
  const { user } = useUser();
  return (
    <div className="">
      <div className="space-y-4">
        <div className="hidden md:flex items-center gap-2 pb-4 pt-2">
          <Image
            src={user?.imageUrl || "/placeholder.png"}
            width={40}
            height={40}
            alt="User Avatar"
            className="rounded-full"
          />
          <div>
            <p className="text-sm font-medium">{user?.fullName}</p>
            <p className="text-xs text-muted-foreground">
              {user?.emailAddresses[0]?.emailAddress}
            </p>
          </div>
        </div>
        <Separator className=" hidden md:block" />
        <nav className="flex md:flex-col gap-2 text-sm overflow-x-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.id} href={item.href}>
                <Button
                  variant={isActive(item.href) ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
