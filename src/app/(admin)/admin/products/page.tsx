import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductCard from "./product-card";
import { CategoryWithSubcategories, Product } from "@/lib/types";
import { getProductsAndFilters } from "@/actions/productActions";
import { ShopPagination } from "@/app/(root)/shop/_components/pagination";
import { loadSearchParams } from "@/app/(root)/shop/serch-params";
import { SearchParams } from "nuqs/server";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductTable } from "./product-table";
import ProductPageFilters from "./product-filters";
import { getCategoriesWithSubcategories } from "@/actions/categoryActions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ProductPageProps {
  searchParams: Promise<SearchParams>;
}

const Products = async ({ searchParams }: ProductPageProps) => {
  let products: Product[] = [];
  let errorMessage: string | null = null;
  let loading: boolean = true;
  let totalPages: number = 1;
  const params = await loadSearchParams(searchParams);
  let categories: CategoryWithSubcategories[] = [];

  try {
    const [result, c] = await Promise.all([
      getProductsAndFilters(params),
      getCategoriesWithSubcategories(),
    ]);
    products = result.products;
    totalPages = Math.round(result.totalCount / (params.limit || 10));
    categories = c || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    errorMessage = "An error occurred while fetching products.";
  } finally {
    loading = false;
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="hidden md:block">
            <div className="space-y-4">
              <Skeleton className="w-full h-8 rounded-md" />
              <Skeleton className="w-full h-32 rounded-md" />
              <Skeleton className="w-full h-16 rounded-md" />
              <Skeleton className="w-full h-24 rounded-md" />
            </div>
          </div>

          <div className="flex-1">
            <div className="grid grid-cols-1 xxs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index}>
                  <Skeleton className="w-full h-64 rounded-md" />
                  <div className="mt-2">
                    <Skeleton className="w-3/4 h-4 rounded-md" />
                    <Skeleton className="w-1/2 h-4 mt-1 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return <div className="container mx-auto px-4 py-8">{errorMessage}</div>;
  }

  return (
    <div className="min-h-screen bg-background ">
      <div>
        <div className="space-y-8 ">
          <div className="flex flex-col space-y-2">
            <h1 className="font-bold text-3xl">Products</h1>
            <p className="text-muted-foreground">
              Manage your product inventory and catalog.
            </p>
          </div>

          <div className="flex justify-between">
            <ProductPageFilters categories={categories} />
            <div>
              <Button asChild>
                <Link href={"/admin/products/add"}>
                  <Plus />
                  Add products
                </Link>
              </Button>
            </div>
          </div>

          <Tabs defaultValue="grid">
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="grid">Grid View</TabsTrigger>
                <TabsTrigger value="list">List View</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="grid" className="mt-0">
              <ProductGrid products={products} totalPages={totalPages} />
            </TabsContent>

            <TabsContent value="list" className="mt-0">
              <ProductTable products={products} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Products;

const ProductGrid = ({
  products,
  totalPages = 1,
}: {
  products: Product[];
  totalPages?: number;
}) => {
  return (
    <div>
      <div className="grid grid-cols-1 xxs:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {totalPages > 1 ? <ShopPagination totalPages={totalPages} /> : null}
    </div>
  );
};
