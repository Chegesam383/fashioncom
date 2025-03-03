import { getCategories } from "@/actions/categoryActions";
import Image from "next/image";
import Link from "next/link";
import Empty from "../shared/empty";

export default async function CategorySection() {
  const categories = await getCategories();

  if (!categories || categories.length === 0) {
    return (
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold my-4">Shop by Category</h2>
        <Empty whatsEmpty="categories" />
      </div>
    );
  }
  return (
    <section className="py-12 ">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
        <div className="relative">
          <div className="flex overflow-x-auto space-x-4 p-4 no-scrollbar">
            {categories.map((category) => (
              <Link
                href={`/shop?category=${category.slug}`}
                key={category.id}
                className="flex-none w-40"
              >
                <div className=" rounded-lg  overflow-hidden">
                  <Image
                    src={category.imageUrl || "/placeholder.png"}
                    alt={category.name}
                    width={200}
                    height={200}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-center">
                      {category.name}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
