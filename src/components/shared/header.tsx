"use client";
import { LogIn, LogOut, Settings, User, UserRoundPen } from "lucide-react";

import { Switch } from "@/components/ui/switch";
import { MoonIcon, SunIcon } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import React from "react";
import SearchBox from "./search";
import { ShoppingCart, User2 } from "lucide-react";
import CategoryNav from "./categoriesnav";
import { Badge } from "../ui/badge";
import { useCartStore } from "../../../store/cart-store";
import Image from "next/image";
import { useClerk, useUser } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { formatPrice } from "@/lib/utils";
import CategoriesDropDown from "./categories-dropdown";
const Header = ({
  categoryNavHidden = false,
}: {
  categoryNavHidden?: boolean;
}) => {
  return (
    <header className="fixed dark border-b mb-64 top-0 z-50 w-full bg-background shadow overflow-visible">
      <nav className=" lg:container p-4 pb-2 mx-auto flex  items-center justify-between gap-4 ">
        <div>
          <Link
            href="/"
            className="font-bold  text-xl text-primary gradient mr-4"
          >
            Fashionist
          </Link>

          {categoryNavHidden && (
            <div className="hidden lg:inline-block">
              <CategoriesDropDown />
            </div>
          )}
        </div>

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
        </div>
      </nav>
      {/* Category Navigation */}
      <div className="block md:hidden p-4">
        <SearchBox />
      </div>
      {!categoryNavHidden && <CategoryNav />}
    </header>
  );
};

export default Header;

const CartIcon = () => {
  const { subtotal, count, products } = useCartStore();
  const [shake, setShake] = useState(false);

  const prevCountRef = useRef(0);

  useEffect(() => {
    if (!Array.isArray(products)) {
      return;
    }

    if (products.length != prevCountRef.current) {
      setShake(true);
      const timer = setTimeout(() => {
        setShake(false);
      }, 500);

      prevCountRef.current = products.length;

      return () => clearTimeout(timer);
    }
  }, [products]);

  return (
    <Link href="/cart" className="flex items-center md:gap-3 gap-2 group">
      <span className="text-muted-foreground">
        <div className={`relative ${shake ? "animate-shake" : ""}`}>
          <ShoppingCart className="text-muted-foreground" />
          <Badge className="absolute -top-2 -right-2 rounded-full p-0 px-1 text-xs">
            {count}
          </Badge>
        </div>
      </span>
      <div className="hidden md:flex flex-col ">
        <small className="text-xs text-muted-foreground">Your Cart</small>
        <span className="text-sm font-semibold text-white">
          {formatPrice(subtotal)}
        </span>
      </div>
    </Link>
  );
};

const Accountbtn = () => {
  const { isSignedIn, user } = useUser();

  const { signOut } = useClerk();

  return isSignedIn ? (
    <AccountDropdown
      userName={user.fullName}
      hasImage={user.hasImage}
      imageUrl={user.imageUrl}
      signOut={signOut}
    />
  ) : (
    <div>
      <AnauthenticatedUserDropDown />
    </div>
  );
};

const AccountDropdown = ({
  userName,
  imageUrl,
  hasImage,
  signOut,
}: {
  userName: string | null;
  imageUrl: string;
  hasImage: boolean;
  signOut: () => void;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center md:gap-3 gap-2 group cursor-pointer">
          <span className="text-muted-foreground">
            {hasImage ? (
              <Image
                src={imageUrl}
                height={30}
                width={30}
                alt={userName || "user image"}
                className="aspect-square rounded-full w-7 h-7"
              />
            ) : (
              <User2 />
            )}
          </span>
          <div className="hidden md:flex flex-col ">
            <small className="text-xs text-muted-foreground">
              hello, {userName}
            </small>
            <span className="text-sm font-semibold text-white">{`Account & orders`}</span>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 dark" avoidCollisions>
        <div className="flex gap-2 m-4 mt-2">
          <ModeToggle />
        </div>

        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User />
            <span>Profile</span>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Settings />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuItem>
          <LogOut />
          <span onClick={() => signOut()} className="w-full">
            Log out
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const AnauthenticatedUserDropDown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center md:gap-3 gap-2 group cursor-pointer">
          <span className="text-muted-foreground">
            <User2 />
          </span>
          <div className="hidden md:flex flex-col ">
            <small className="text-xs text-muted-foreground">Hello</small>
            <span className="text-sm font-semibold text-white">
              Sign In/sign Up
            </span>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent className="w-56 dark relative" align="start">
          <div className="flex gap-2 m-4 mt-2">
            <ModeToggle />
          </div>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem>
              <LogIn className="opacity-75" />
              <Link href={"sign-in"} className="w-full h-full">
                Sign In
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <UserRoundPen className="opacity-75" />
              <Link href={"sign-up"} className="w-full  h-full">
                Sign Up
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
};

function ModeToggle() {
  const id = useId();
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
        id={`${id}-off`}
        className="group-data-[state=checked]:text-muted-foreground/70 flex-1 cursor-pointer text-right text-sm font-medium"
        aria-controls={id}
        onClick={handleToggle}
      >
        <MoonIcon size={16} aria-hidden="true" />
      </span>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={handleToggle}
        aria-labelledby={`${id}-off ${id}-on`}
        aria-label="Toggle between dark and light mode"
      />
      <span
        id={`${id}-on`}
        className="group-data-[state=unchecked]:text-muted-foreground/70 flex-1 cursor-pointer text-left text-sm font-medium"
        aria-controls={id}
        onClick={() => setChecked(true)}
      >
        <SunIcon size={16} aria-hidden="true" />
      </span>
    </div>
  );
}
