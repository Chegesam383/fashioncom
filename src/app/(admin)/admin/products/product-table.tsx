import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";

export const ProductTable = ({ products }: { products: Product[] }) => {
  return (
    <div className="rounded-md border">
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-border">
          <thead>
            <tr className="bg-muted/50">
              <th className="px-4 py-3.5 text-left text-sm font-semibold">
                Product
              </th>
              <th className="px-4 py-3.5 text-left text-sm font-semibold">
                Category
              </th>
              <th className="px-4 py-3.5 text-left text-sm font-semibold">
                Price
              </th>
              <th className="px-4 py-3.5 text-left text-sm font-semibold">
                Stock
              </th>
              <th className="px-4 py-3.5 text-left text-sm font-semibold">
                Status
              </th>
              <th className="px-4 py-3.5 text-right text-sm font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-muted/50">
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <Image
                      src={product.imageUrls?.[0] || "Placeholder.png"}
                      alt={product.name}
                      width={20}
                      height={20}
                      className="w-10 h-10 rounded-md object-cover mr-3"
                    />
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {product.id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <Badge variant="secondary">{product.categoryId}</Badge>
                </td>
                <td className="px-4 py-3 whitespace-nowrap font-medium">
                  {formatPrice(product.price)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">{product.stock}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <Badge
                    variant="outline"
                    className={
                      product.stock && product.stock > 20
                        ? "bg-green-500/10 text-green-500"
                        : product.stock &&
                          product.stock > 0 &&
                          product.stock < 20
                        ? "bg-yellow-500/10 text-yellow-500"
                        : "bg-red-500/10 text-red-500"
                    }
                  >
                    {product.stock && product.stock > 20
                      ? "In Stock"
                      : product.stock && product.stock > 0 && product.stock < 20
                      ? "Low Stock"
                      : "Out of Stock"}
                  </Badge>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right">
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
