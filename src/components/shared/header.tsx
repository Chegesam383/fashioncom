"use client";
import { LogIn, LogOut, Settings, User, UserRoundPen } from "lucide-react";

import { useEffect, useRef, useState } from "react";
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

import { formatPrice } from "@/lib/utils";
import CategoriesDropDown from "./categories-dropdown";
import { useRouter } from "next/navigation";
const Header = ({
  categoryNavHidden = false,
}: {
  categoryNavHidden?: boolean;
}) => {
  return (
    <header className="fixed  mb-64 top-0 z-50 w-full bg-background  overflow-visible">
      <nav className=" lg:container p-4 pb-2 mx-auto flex  items-center justify-between gap-4 ">
        <div>
          <Link
            href="/"
            className="font-bold  text-xl text-primary gradient mr-4"
          >
            Fashionist
          </Link>

          {categoryNavHidden && (
            <div className="hidden lg:inline-block mb-2">
              <CategoriesDropDown isNotOutline />
            </div>
          )}
        </div>

        {/* Search Box - Hidden on small screens */}
        <div className=" hidden md:flex justify-center  md:w-[42%] lg:w-1/3">
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
        <span className="text-sm font-semibold ">{formatPrice(subtotal)}</span>
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
  const router = useRouter();
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
              Hello, {userName}
            </small>
            <span className="text-sm font-semibold ">{`Account & orders`}</span>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 " avoidCollisions>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/profile")}>
            <User />
            <span>Profile</span>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => router.push("/profile/settings")}>
            <Settings />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const AnauthenticatedUserDropDown = () => {
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center md:gap-3 gap-2 group cursor-pointer">
          <span className="text-muted-foreground">
            <User2 />
          </span>
          <div className="hidden md:flex flex-col ">
            <small className="text-xs text-muted-foreground">Hello</small>
            <span className="text-sm font-semibold ">Sign In/Sign Up</span>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent className="w-56  relative" align="start">
          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => router.push("/sign-in")}>
              <LogIn className="opacity-75" />
              Sign In
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/sign-up")}>
              <UserRoundPen className="opacity-75" />
              Sign Up
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
};
