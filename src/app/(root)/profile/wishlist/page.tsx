import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import Image from "next/image";

export default function WishlistPage() {
  const wishlistItems = [
    {
      id: 1,
      name: "Wireless Headphones",
      price: "$129.99",
      image: "/Placeholder.png",
    },
    {
      id: 2,
      name: "Smart Watch",
      price: "$199.99",
      image: "/Placeholder.png",
    },
    {
      id: 3,
      name: "Bluetooth Speaker",
      price: "$79.99",
      image: "/Placeholder.png",
    },
  ];

  return (
    <div className="grid gap-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Wishlist</h2>
        <p className="text-muted-foreground">
          Items you&apos;ve saved for later.
        </p>
      </div>
      <div className="grid gap-6">
        {wishlistItems.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Image
                  src={item.image || "/Placeholder.png"}
                  width={100}
                  height={100}
                  alt={item.name}
                  className="rounded-md"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">{item.price}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Add to Cart
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Heart className="h-4 w-4" />
                    <span className="sr-only">Remove from wishlist</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
