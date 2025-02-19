import Category from "@/components/Category";
import FreshSaleSection from "@/components/frashsale";

import Hero from "@/components/hero";
import ShopByCategory from "@/components/shopBycategory";

export default function Home() {
  return (
    <>
      <Hero />
      <FreshSaleSection />
      <Category title={`Todays's picks`} />
      <Category title={`Trending`} />
      <ShopByCategory />
    </>
  );
}
