"use client";

import * as React from "react";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Grid2X2 } from "lucide-react";

export default function CategoryNav() {
  return (
    <div className="container gap-4 flex mx-auto px-4 py-2">
      <nav className="flex items-center gap-4 text-sm xl:gap-6">
        <a
          className="transition-colors hover:text-foreground/80 text-foreground/80"
          href="/docs"
        >
          Docs
        </a>
        <a
          className="transition-colors hover:text-foreground/80 text-foreground"
          href="/docs/components"
        >
          Components
        </a>
        <a
          className="transition-colors hover:text-foreground/80 text-foreground/80"
          href="/blocks"
        >
          Blocks
        </a>
        <a
          className="transition-colors hover:text-foreground/80 text-foreground/80"
          href="/charts"
        >
          Charts
        </a>
        <a
          className="transition-colors hover:text-foreground/80 text-foreground/80"
          href="/themes"
        >
          Themes
        </a>
        <a
          className="transition-colors hover:text-foreground/80 text-foreground/80"
          href="/colors"
        >
          Colors
        </a>
      </nav>
    </div>
  );
}

export const CategoriesDropDown = () => {
  type Checked = DropdownMenuCheckboxItemProps["checked"];
  const [showStatusBar, setShowStatusBar] = React.useState<Checked>(true);
  const [showActivityBar, setShowActivityBar] = React.useState<Checked>(false);
  const [showPanel, setShowPanel] = React.useState<Checked>(false);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"outline"} size={"sm"} className="font-bold">
          Categories <Grid2X2 />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 justify-right mt-4" align="start">
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={showStatusBar}
          onCheckedChange={setShowStatusBar}
        >
          Status Bar
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={showActivityBar}
          onCheckedChange={setShowActivityBar}
          disabled
        >
          Activity Bar
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={showPanel}
          onCheckedChange={setShowPanel}
        >
          Panel
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
