import Category from "@/components/sections/category";
import FreshSaleSection from "@/components/sections/frashsale";

import CarouselServer from "@/components/sections/hero-server-content";

import ShopByCategory from "@/components/sections/shop-by-category";

export default function Home() {
  return (
    <>
      <CarouselServer />

      <FreshSaleSection />
      <Category
        title={`Today's picks`}
        bg="muted"
        description="We recommend you checking this deals today"
      />
      <Category
        title={`Trending`}
        bg=""
        description="Here are the most trending deals"
      />
      <ShopByCategory />
    </>
  );
}
