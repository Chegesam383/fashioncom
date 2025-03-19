"use client";
import { useState } from "react";
import {
  Calendar,
  ChevronDown,
  Download,
  Filter,
  RefreshCcw,
  Search,
  ShoppingBag,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Order, OrdersTable } from "../_components/recent-orders-table";

// Sample orders data
const ordersSampleData: Order[] = [
  {
    id: "#ORD-2491",
    customer: "John Doe",
    email: "john.doe@example.com",
    date: "2023-06-10",
    amount: 125.99,
    status: "delivered",
    items: 3,
  },
  {
    id: "#ORD-2492",
    customer: "Alice Smith",
    email: "alice.smith@example.com",
    date: "2023-06-12",
    amount: 259.99,
    status: "processing",
    items: 1,
  },
  {
    id: "#ORD-2493",
    customer: "Bob Johnson",
    email: "bob.johnson@example.com",
    date: "2023-06-12",
    amount: 79.99,
    status: "pending",
    items: 2,
  },
  {
    id: "#ORD-2494",
    customer: "Emma Wilson",
    email: "emma.wilson@example.com",
    date: "2023-06-13",
    amount: 149.99,
    status: "shipped",
    items: 4,
  },
  {
    id: "#ORD-2495",
    customer: "Michael Brown",
    email: "michael.brown@example.com",
    date: "2023-06-14",
    amount: 499.99,
    status: "canceled",
    items: 1,
  },
  {
    id: "#ORD-2496",
    customer: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    date: "2023-06-15",
    amount: 89.99,
    status: "pending",
    items: 2,
  },
  {
    id: "#ORD-2497",
    customer: "Ryan Davis",
    email: "ryan.davis@example.com",
    date: "2023-06-16",
    amount: 179.99,
    status: "processing",
    items: 3,
  },
  {
    id: "#ORD-2498",
    customer: "Jennifer Miller",
    email: "jennifer.miller@example.com",
    date: "2023-06-17",
    amount: 349.99,
    status: "shipped",
    items: 5,
  },
  {
    id: "#ORD-2499",
    customer: "David Wilson",
    email: "david.wilson@example.com",
    date: "2023-06-18",
    amount: 59.99,
    status: "delivered",
    items: 1,
  },
  {
    id: "#ORD-2500",
    customer: "Jessica Brown",
    email: "jessica.brown@example.com",
    date: "2023-06-19",
    amount: 129.99,
    status: "processing",
    items: 2,
  },
];

// Order stats
const orderStats = [
  { label: "Total Orders", value: 1204, icon: ShoppingBag },
  {
    label: "Pending",
    value: 42,
    icon: Calendar,
    color: "bg-yellow-500/10 text-yellow-500",
  },
  {
    label: "Processing",
    value: 28,
    icon: RefreshCcw,
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    label: "Delivered",
    value: 854,
    icon: ShoppingBag,
    color: "bg-green-500/10 text-green-500",
  },
];

const OrdersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  return (
    <div className="min-h-screen bg-background ">
      <div className="">
        <div className="space-y-8 ">
          <div className="flex flex-col space-y-2">
            <h1 className="font-bold text-3xl">Orders</h1>
            <p className="text-muted-foreground">
              Manage and track customer orders in one place.
            </p>
          </div>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {orderStats.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 p-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.label}
                  </CardTitle>
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      stat.color || "bg-secondary"
                    }`}
                  >
                    <stat.icon className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent className="p-2">
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 sm:w-[300px]"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="canceled">Canceled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex space-x-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="h-9">
                    <Filter className="h-4 w-4 mr-2" />
                    Advanced Filters
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Advanced Filters</DialogTitle>
                    <DialogDescription>
                      Filter orders by specific criteria.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Date Range</label>
                      <div className="flex space-x-2">
                        <Input type="date" className="flex-1" />
                        <Input type="date" className="flex-1" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Price Range</label>
                      <div className="flex space-x-2">
                        <Input
                          type="number"
                          placeholder="Min"
                          className="flex-1"
                        />
                        <Input
                          type="number"
                          placeholder="Max"
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Status</label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "pending",
                          "processing",
                          "shipped",
                          "delivered",
                          "canceled",
                        ].map((status) => (
                          <Badge
                            key={status}
                            variant="outline"
                            className="cursor-pointer capitalize"
                          >
                            {status}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline">Reset Filters</Button>
                    <Button>Apply Filters</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-9">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Export Options</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem checked>
                    Export as CSV
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>
                    Export as Excel
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>
                    Export as PDF
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button className="h-9">
                <ShoppingBag className="h-4 w-4 mr-2" />
                New Order
              </Button>
            </div>
          </div>

          <OrdersTable
            data={ordersSampleData.filter(
              (order) =>
                (statusFilter === "all" || order.status === statusFilter) &&
                (searchQuery === "" ||
                  order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  order.customer
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                  order.email.toLowerCase().includes(searchQuery.toLowerCase()))
            )}
            title="All Orders"
          />
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
