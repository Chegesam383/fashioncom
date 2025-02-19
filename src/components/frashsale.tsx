import CountdownTimer from "./ui/counter-timer";
import { products } from "@/lib/fakedata";
import { ProductCard } from "./Category";

export default function FreshSaleSection() {
  const endDate = new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000);

  return (
    <section className=" section">
      <h2 className="text-3xl font-bold my-2 text-center gradient">
        Fresh Sale!
      </h2>
      <p className="text-sm text-muted-foreground text-center mb-10">
        Grab these hot deals before they&apos;re gone
      </p>

      <CountdownTimer endDate={endDate} />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.slice(0, 8).map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
    </section>
  );
}
