import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import Link from "next/link";
import React from "react";
const topSellingProducts = [
  {
    id: 1,
    name: "Wireless Headphones",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=200&auto=format&fit=crop",
    sold: 324,
    amount: 42125,
  },
  {
    id: 2,
    name: "Smart Watch Series 5",
    image:
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=200&auto=format&fit=crop",
    sold: 270,
    amount: 38420,
  },
  {
    id: 3,
    name: "Premium Laptop",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=200&auto=format&fit=crop",
    sold: 245,
    amount: 31290,
  },
];

const TopSelling = () => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center">
          <TrendingUp className="mr-2 h-5 w-5" />
          Top Selling Products
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {topSellingProducts.map((product) => (
            <div key={product.id} className="flex items-center">
              <div className="relative h-12 w-12 overflow-hidden rounded-md">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="ml-3 flex-1">
                <div className="font-medium">{product.name}</div>
                <div className="text-sm text-muted-foreground">
                  {product.sold} sales
                </div>
              </div>
              <div className="font-medium">
                ${(product.amount / 100).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-3 border-t">
          <Button variant="ghost" size="sm" asChild className="w-full">
            <Link href="/products">View all products</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TopSelling;
