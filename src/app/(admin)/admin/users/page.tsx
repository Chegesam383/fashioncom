"use client";
import { useState } from "react";
import {
  Search,
  Plus,
  Filter,
  ArrowUpDown,
  UsersIcon,
  UserPlus,
  Calendar,
  ShoppingBag,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define sample user data structure
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: "active" | "inactive";
  role: "admin" | "customer" | "guest";
  joinDate: string;
  ordersCount: number;
  totalSpent: number;
  lastActive: string;
}

// Sample users data
const sampleUsers: User[] = [
  {
    id: "usr-001",
    name: "Emily Johnson",
    email: "emily.johnson@example.com",
    avatar: "https://i.pravatar.cc/150?img=1",
    status: "active",
    role: "customer",
    joinDate: "2023-01-15",
    ordersCount: 12,
    totalSpent: 1249.99,
    lastActive: "2023-06-18",
  },
  {
    id: "usr-002",
    name: "Michael Chen",
    email: "michael.chen@example.com",
    avatar: "https://i.pravatar.cc/150?img=2",
    status: "active",
    role: "admin",
    joinDate: "2022-11-03",
    ordersCount: 5,
    totalSpent: 759.45,
    lastActive: "2023-06-20",
  },
  {
    id: "usr-003",
    name: "Sophia Rodriguez",
    email: "sophia.r@example.com",
    avatar: "https://i.pravatar.cc/150?img=3",
    status: "inactive",
    role: "customer",
    joinDate: "2023-03-22",
    ordersCount: 3,
    totalSpent: 249.97,
    lastActive: "2023-05-10",
  },
  {
    id: "usr-004",
    name: "William Taylor",
    email: "will.taylor@example.com",
    avatar: "https://i.pravatar.cc/150?img=4",
    status: "active",
    role: "customer",
    joinDate: "2022-09-14",
    ordersCount: 18,
    totalSpent: 2345.75,
    lastActive: "2023-06-19",
  },
  {
    id: "usr-005",
    name: "Olivia Martinez",
    email: "olivia.m@example.com",
    avatar: "https://i.pravatar.cc/150?img=5",
    status: "active",
    role: "customer",
    joinDate: "2023-04-30",
    ordersCount: 2,
    totalSpent: 189.98,
    lastActive: "2023-06-15",
  },
  {
    id: "usr-006",
    name: "James Wilson",
    email: "james.w@example.com",
    avatar: "https://i.pravatar.cc/150?img=6",
    status: "inactive",
    role: "guest",
    joinDate: "2023-02-11",
    ordersCount: 0,
    totalSpent: 0,
    lastActive: "2023-03-01",
  },
  {
    id: "usr-007",
    name: "Emma Brown",
    email: "emma.brown@example.com",
    avatar: "https://i.pravatar.cc/150?img=7",
    status: "active",
    role: "customer",
    joinDate: "2022-08-05",
    ordersCount: 9,
    totalSpent: 1045.32,
    lastActive: "2023-06-20",
  },
  {
    id: "usr-008",
    name: "Daniel Lee",
    email: "daniel.lee@example.com",
    avatar: "https://i.pravatar.cc/150?img=8",
    status: "active",
    role: "admin",
    joinDate: "2022-07-19",
    ordersCount: 7,
    totalSpent: 879.25,
    lastActive: "2023-06-21",
  },
];

const userStats = [
  {
    label: "Total Users",
    value: 1204,
    icon: UsersIcon,
    color: "bg-primary/10 text-primary",
  },
  {
    label: "New Users (30d)",
    value: 42,
    icon: UserPlus,
    color: "bg-blue-500/10 text-blue-500",
    change: "+12%",
  },
  {
    label: "Active Users",
    value: 854,
    icon: Calendar,
    color: "bg-green-500/10 text-green-500",
    change: "+5%",
  },
  {
    label: "Customer Retention",
    value: "76%",
    icon: ShoppingBag,
    color: "bg-purple-500/10 text-purple-500",
    change: "+2%",
  },
];

// Main Users page
const UsersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Filter users based on search query and filters
  const filteredUsers = sampleUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-background ">
      <div className="space-y-8 mt-8">
        <div className="flex flex-col space-y-2">
          <h1 className="font-bold text-3xl">Users</h1>
          <p className="text-muted-foreground">
            Manage users and customer accounts.
          </p>
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {userStats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 p-2">
                <CardTitle className="text-sm font-medium">
                  {stat.label}
                </CardTitle>
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center ${stat.color}`}
                >
                  <stat.icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent className="p-2">
                <div className="text-2xl font-bold">{stat.value}</div>
                {stat.change && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.change} from last month
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 sm:w-[300px]"
              />
            </div>
            <select
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="customer">Customer</option>
              <option value="guest">Guest</option>
            </select>
            <select
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" className="h-9">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button variant="outline" className="h-9">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              Sort
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="h-9">
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                  <DialogDescription>
                    Fill in the details to create a new user account.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-sm font-medium col-span-1">
                      Name
                    </label>
                    <Input className="col-span-3" placeholder="Full name" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-sm font-medium col-span-1">
                      Email
                    </label>
                    <Input
                      className="col-span-3"
                      type="email"
                      placeholder="email@example.com"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-sm font-medium col-span-1">
                      Role
                    </label>
                    <select className="col-span-3 h-10 rounded-md border border-input bg-background px-3 text-sm">
                      <option value="customer">Customer</option>
                      <option value="admin">Admin</option>
                      <option value="guest">Guest</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-sm font-medium col-span-1">
                      Status
                    </label>
                    <select className="col-span-3 h-10 rounded-md border border-input bg-background px-3 text-sm">
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-sm font-medium col-span-1">
                      Avatar URL
                    </label>
                    <Input
                      className="col-span-3"
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button>Add User</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs defaultValue="grid">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="grid">Grid View</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
            </TabsList>
            <div className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-medium">{filteredUsers.length}</span> of{" "}
              <span className="font-medium">{sampleUsers.length}</span> users
            </div>
          </div>

          <TabsContent value="grid" className="mt-0">
            {/* <UserGrid users={filteredUsers} /> */}
          </TabsContent>

          <TabsContent value="list" className="mt-0">
            {/* <UserTable users={filteredUsers} /> */}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UsersPage;
