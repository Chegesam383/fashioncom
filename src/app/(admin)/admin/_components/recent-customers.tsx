import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import Link from "next/link";
import React from "react";
const recentCustomers = [
  {
    id: 1,
    name: "Alex Johnson",
    email: "alex@example.com",
    avatar: "https://i.pravatar.cc/150?img=1",
    date: "2023-06-16",
    spent: 1230,
  },
  {
    id: 2,
    name: "Sarah Miller",
    email: "sarah@example.com",
    avatar: "https://i.pravatar.cc/150?img=5",
    date: "2023-06-15",
    spent: 890,
  },
  {
    id: 3,
    name: "David Clark",
    email: "david@example.com",
    avatar: "https://i.pravatar.cc/150?img=8",
    date: "2023-06-15",
    spent: 458,
  },
];
const RecentCustomers = () => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center">
          <Users className="mr-2 h-5 w-5" />
          Recent Customers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {recentCustomers.map((customer) => (
            <div key={customer.id} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage src={customer.avatar} alt={customer.name} />
                <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="ml-3 flex-1">
                <div className="font-medium">{customer.name}</div>
                <div className="text-xs text-muted-foreground">
                  {customer.email}
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">${customer.spent}</div>
                <div className="text-xs text-muted-foreground">
                  {customer.date}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-3 border-t">
          <Button variant="ghost" size="sm" asChild className="w-full">
            <Link href="/users">View all customers</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentCustomers;
