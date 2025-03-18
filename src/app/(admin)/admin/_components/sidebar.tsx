import {
  ChartAreaIcon,
  Home,
  Inbox,
  Settings,
  ShoppingBag,
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
    url: "#",
    icon: Home,
  },

  {
    title: "Orders",
    url: "#",
    icon: ShoppingBag,
  },

  {
    title: "Products",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Users",
    url: "#",
    icon: User,
  },
  {
    title: "Analytics",
    url: "#",
    icon: ChartAreaIcon,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
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
