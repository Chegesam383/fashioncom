"use client";
import { LogOut, Settings, User } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { MoonIcon, SunIcon } from "lucide-react";
import { useId, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import React from "react";
import SearchBox from "./search";
import { ShoppingCart, User2 } from "lucide-react";
import CategoryNav, { CategoriesDropDown } from "./categoriesnav";
import { Badge } from "../ui/badge";
import { useCartStore } from "../../../store/cart-store";
import { categories } from "@/lib/fakedata";
import Image from "next/image";
import { useClerk, useUser } from "@clerk/nextjs";
import { useTheme } from "next-themes";
const Header = ({
  categoryNavHidden = false,
}: {
  categoryNavHidden?: boolean;
}) => {
  return (
    <header className="sticky dark border-b top-0 z-50 w-full bg-background shadow">
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
              <CategoriesDropDown categories={categories} />
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
  const { subtotal, count } = useCartStore();
  const [shake, setShake] = useState(false);

  React.useEffect(() => {
    if (count > 0) {
      setShake(true);
      const timer = setTimeout(() => {
        setShake(false);
      }, 500); // Shake duration
      return () => clearTimeout(timer); // Cleanup on unmount
    }
  }, [count]);

  return (
    <Link href={"/cart"} className="flex items-center md:gap-3 gap-2 group">
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
          ${subtotal.toFixed(2)}
        </span>
      </div>
    </Link>
  );
};

const Accountbtn = () => {
  const { isSignedIn, user } = useUser();
  console.log(useClerk());
  const { signOut } = useClerk();

  return isSignedIn ? (
    <AccountDropdown
      userName={user.fullName}
      hasImage={user.hasImage}
      imageUrl={user.imageUrl}
      signOut={signOut}
    />
  ) : (
    <Link href="/sign-in" className="flex items-center md:gap-3 gap-2 group">
      <span className="text-muted-foreground">
        <User2 />
      </span>
      <div className="hidden md:flex flex-col ">
        <small className="text-xs text-muted-foreground">Welcome</small>
        <span className="text-sm font-semibold text-white">Sign In</span>
      </div>
    </Link>
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
            <small className="text-xs text-muted-foreground">{userName}</small>
            <span className="text-sm font-semibold text-white">{`Account & orders`}</span>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 dark">
        <div className="flex gap-2 mb-4">
          <span>Theme</span>
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
          <span onClick={() => signOut()}>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
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
    <div className="inline-flex items-center gap-2">
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={handleToggle}
        aria-label="Toggle theme"
        className="dark"
      />
      <Label htmlFor={id}>
        <span className="sr-only">Toggle theme</span>
        {checked ? (
          <SunIcon size={16} aria-hidden="true" />
        ) : (
          <MoonIcon size={16} aria-hidden="true" />
        )}
      </Label>
    </div>
  );
}
