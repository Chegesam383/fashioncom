"use client";

import Link from "next/link";
import React from "react";
import SearchBox from "./search";
import ModeToggle from "./ui/theme-switch";
import { ShoppingCart, User2 } from "lucide-react";
import CategoryNav from "./categoriesnav";
import { Badge } from "./ui/badge";
import { UserButton } from "@clerk/nextjs";
import { useUser } from "@clerk/clerk-react";
import { useCartStore } from "../../store/cart-store";
const Header = () => {
  return (
    <header className="sticky  border-b top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className=" lg:container p-4 mx-auto flex  items-center justify-between gap-4 ">
        {/* Logo */}
        <Link href="/" className="font-bold text-xl text-primary gradient ">
          Fashionist
        </Link>

        {/* Search Box - Hidden on small screens */}
        <div className=" hidden md:flex justify-center  w-1/3">
          <div className="w-full">
            <SearchBox />
          </div>
        </div>

        {/* Icons and Toggle */}
        <div className="flex gap-4 items-center ">
          <CartIcon />
          <Accountbtn />
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

const CartIcon = () => {
  const { products, subtotal } = useCartStore();

  return (
    <Link href={"/cart"} className="flex items-center md:gap-3 gap-2 group">
      <span className="text-muted-foreground">
        <div className="relative">
          <ShoppingCart className="text-muted-foreground" />
          <Badge className="absolute -top-2 -right-2 rounded-full p-0 px-1 text-xs">
            {products.length}
          </Badge>
        </div>
      </span>
      <div className="hidden md:flex flex-col ">
        <small className="text-xs text-muted-foreground">Your Cart</small>
        <span className="text-sm font-semibold">${subtotal.toFixed(2)}</span>
      </div>
    </Link>
  );
};

const Accountbtn = () => {
  const { isSignedIn, user } = useUser();
  console.log(user);
  return isSignedIn ? (
    <div className="flex items-center md:gap-3 gap-2 group">
      <span className="text-muted-foreground">
        <UserButton />
      </span>
      <div className="hidden md:flex flex-col ">
        <small className="text-xs text-muted-foreground">
          {user.emailAddresses[0].emailAddress}
        </small>
        <span className="text-sm font-semibold">{`Account & orders`}</span>
      </div>
    </div>
  ) : (
    <Link href="/sign-in" className="flex items-center md:gap-3 gap-2 group">
      <span className="text-muted-foreground">
        <User2 />
      </span>
      <div className="hidden md:flex flex-col ">
        <small className="text-xs text-muted-foreground">Welcome</small>
        <span className="text-sm font-semibold">Sign In</span>
      </div>
    </Link>
  );
};
