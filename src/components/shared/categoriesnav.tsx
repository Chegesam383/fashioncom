"use client";

import Link from "next/link";

import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import useScroll from "@/lib/hooks/usescroll";
import CategoriesDropDown from "./categories-dropdown";

const links = [
  { name: "Shop", link: "shop" },
  { name: "Best Sellers", link: "shop?category=best-sellers" },
  { name: "Deals", link: "shop?category=deals" },
  { name: "Top rated", link: "shop?category=top-rated" },
  { name: "Browsing history", link: "your-history" },
];

export default function CategoryNav() {
  const { scrollDirection, scrollY } = useScroll();
  return (
    (scrollDirection == "up" || scrollY == 0) && (
      <nav className={`mt-4 pt-1 bg-slate-800`}>
        <div className={`flex  lg:container  mx-auto rounded-lg`}>
          <div className="flex items-center">
            <ScrollArea className="w-[100vw] whitespace-nowrap mb-2 z-0">
              <div className="flex items-center">
                <CategoriesDropDown />
                {links.map((item) => (
                  <Link
                    className="flex rounded-lg text-white text-center opacity-75 px-4 text-sm text-nowrap hover:opacity-100"
                    href={item.link}
                    key={item.name}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              <ScrollBar orientation="horizontal" className="sr-only" />
            </ScrollArea>
          </div>
        </div>
      </nav>
    )
  );
}

//   return items.map((item: category, index: number) =>
//     item.subcategories ? (
//       <DropdownMenuSub key={index}>
//         <DropdownMenuSubTrigger className="hover:bg-muted">
//           {item.name}
//         </DropdownMenuSubTrigger>
//         <DropdownMenuPortal>
//           <DropdownMenuSubContent>
//             <RenderMenuItems items={item.subcategories} />
//           </DropdownMenuSubContent>
//         </DropdownMenuPortal>
//       </DropdownMenuSub>
//     ) : (
//       <DropdownMenuItem key={index} className="hover:bg-muted">
//         {item.name}
//       </DropdownMenuItem>
//     )
//   );
// };
