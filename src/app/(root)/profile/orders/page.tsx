import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import Image from "next/image";

export default function OrdersPage() {
  const orders = [
    {
      id: "ORD-12345",
      date: "March 12, 2023",
      status: "Delivered",
      total: "$249.98",
      items: 2,
      products: ["/Placeholder.png", "/Placeholder.png"],
    },
    {
      id: "ORD-67890",
      date: "February 28, 2023",
      status: "Shipped",
      total: "$129.99",
      items: 1,
      products: ["/Placeholder.png"],
    },
    {
      id: "ORD-54321",
      date: "January 15, 2023",
      status: "Delivered",
      total: "$349.97",
      items: 3,
      products: ["/Placeholder.png", "/Placeholder.png", "/Placeholder.png"],
    },
    {
      id: "ORD-98765",
      date: "December 5, 2022",
      status: "Delivered",
      total: "$899.95",
      items: 14,
      products: Array(14).fill("/Placeholder.png"),
    },
  ];

  return (
    <div className="grid gap-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
        <p className="text-muted-foreground">View and track your orders.</p>
      </div>
      <div className="grid gap-6">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold">{order.id}</p>
                  <p className="text-sm text-muted-foreground">{order.date}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-4 rtl:space-x-reverse">
                    {order.products.slice(0, 10).map((src, index) => (
                      <Image
                        key={index}
                        src={src || "/Placeholder.png"}
                        width={40}
                        height={40}
                        alt={`Product ${index + 1}`}
                        className="rounded-md border border-background bg-muted object-cover"
                      />
                    ))}
                    {order.products.length > 10 && (
                      <div className="flex items-center justify-center rounded-md border border-background bg-muted w-10 h-10 text-xs font-medium">
                        +{order.products.length - 10}
                      </div>
                    )}
                  </div>
                  <Badge
                    variant={
                      order.status === "Delivered" ? "default" : "secondary"
                    }
                  >
                    {order.status}
                  </Badge>
                  <p className="font-medium">{order.total}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.items} items
                  </p>
                </div>
                <Button variant="outline" size="sm" className="md:ml-auto">
                  View Details
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
