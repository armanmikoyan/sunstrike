import { RatioMosaic } from "@/components/ratio-mosaic";
import { HomeGallery } from "./home-gallery";
import { HomeHero } from "./home-hero";
import { HomePricing } from "./home-pricing";

export function Home() {
  return (
    <>
      <HomeHero />
      <HomeGallery />
      <RatioMosaic />
      <HomePricing />
    </>
  );
}
