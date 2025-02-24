import Category from "@/components/Category";
import FreshSaleSection from "@/components/frashsale";

import Hero from "@/components/hero";
import InfoSection from "@/components/info-section";
import ShopByCategory from "@/components/shopBycategory";

export default function Home() {
  return (
    <>
      <Hero />
      <InfoSection />
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
