"use client";

import Link from "next/link";
import React from "react";
import SearchBox from "./search";
import ModeToggle from "./ui/theme-switch";
import { ShoppingCart, User2 } from "lucide-react";
import CategoryNav, { CategoriesDropDown } from "./categoriesnav";

const Header = () => {
  return (
    <header className=" border-b sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto p-4">
        <div className="flex justify-between items-center gap-4">
          {/* Logo */}
          <Link href="/" className="font-bold text-xl ">
            Fashionist
          </Link>

          <CategoriesDropDown />
          {/* Search Box */}
          <div className="flex-1 flex justify-end">
            <div className="w-full max-w-lg">
              <SearchBox />
            </div>
          </div>

          {/* Icons and Toggle */}
          <div className="flex gap-6 items-center">
            <IconWithText
              title="Welcome"
              text="Login/Sign Up"
              link="/login"
              icon={<User2 className="text-gray-600" />}
            />
            <IconWithText
              title="Cart"
              text="5 items"
              link="/cart"
              icon={<ShoppingCart className="text-gray-600" />}
            />
            <ModeToggle />
          </div>
        </div>
      </nav>
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
  <Link href={link} className="flex items-center gap-2 group">
    <span className="text-muted-foreground">{icon}</span>
    <div className="flex flex-col">
      <small className="text-xs text-muted-foreground">{title}</small>
      <span className="text-sm font-semibold ">{text}</span>
    </div>
  </Link>
);
