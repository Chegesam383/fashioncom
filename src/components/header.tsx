"use client";

import Link from "next/link";
import React from "react";
import SearchBox from "./search";
import ModeToggle from "./ui/theme-switch";
import { ShoppingCart, User2 } from "lucide-react";
import CategoryNav from "./categoriesnav";
import { Badge } from "./ui/badge";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className=" lg:container p-4 mx-auto flex  items-center justify-between gap-4 ">
        {/* Logo */}
        <Link href="/" className="font-bold text-xl text-primary gradient">
          Fashionist
        </Link>

        {/* Search Box - Hidden on small screens */}
        <div className="flex-1 hidden md:flex justify-end">
          <div className="w-full max-w-lg">
            <SearchBox />
          </div>
        </div>

        {/* Icons and Toggle */}
        <div className="flex gap-4 sm:gap-6 items-center">
          <IconWithText
            title="Welcome"
            text="Login/Sign Up"
            link="/login"
            icon={<User2 className="text-gray-600" />}
          />
          <IconWithText
            title="Cart"
            text="$ 30"
            link="/cart"
            icon={
              <div className="relative">
                <ShoppingCart className="text-gray-600" />
                <Badge className="absolute -top-2 -right-2 rounded-full p-0 px-1 text-xs">
                  31
                </Badge>
              </div>
            }
          />
          <ModeToggle />
        </div>
      </nav>
      {/* Category Navigation */}
      <div className="block md:hidden p-4">
        <SearchBox />
      </div>
      <CategoryNav />
    </header>
  );
};

export default Header;

const IconWithText = ({
  title,
  text,
  icon,
  link,
}: {
  title: string;
  text: string;
  icon: React.ReactNode;
  link: string;
}) => (
  <Link href={link} className="flex items-center gap-2 sm:gap-4 group">
    <span className="text-muted-foreground">{icon}</span>
    <div className="hidden md:flex flex-col ">
      <small className="text-xs text-muted-foreground">{title}</small>
      <span className="text-sm font-semibold">{text}</span>
    </div>
  </Link>
);
