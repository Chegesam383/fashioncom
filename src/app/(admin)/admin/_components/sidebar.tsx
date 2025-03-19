"use client";
import {
  ChartAreaIcon,
  Home,
  Inbox,
  Settings,
  ShoppingBag,
  Store,
  User,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import SidebarHeaderWithToggle from "./sidebar-header";
import NavUser from "./sidebar-footer";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: Home,
  },

  {
    title: "Orders",
    url: "/admin/orders",
    icon: ShoppingBag,
  },

  {
    title: "Products",
    url: "/admin/products",
    icon: Inbox,
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: User,
  },
  {
    title: "Analytics",
    url: "/admin/analytics",
    icon: ChartAreaIcon,
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
  },

  {
    title: "Store",
    url: "/",
    icon: Store,
  },
];

export function AppSidebar() {
  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader>
        <SidebarHeaderWithToggle />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <a href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
