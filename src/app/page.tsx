import Category from "@/components/Category";

import Hero from "@/components/hero";

export default function Home() {
  return (
    <>
      <Hero />
      <Category title={`Todays's picks`} />
      <Category title={`Trending`} />
    </>
  );
}
