
import { getSchoolInfo, getCarouselItems } from "@/lib/school-data";
import CarouselClient from "./carousel-client";

export default async function HeroCarousel() {
  const [schoolInfo, carouselItems] = await Promise.all([
    getSchoolInfo(),
    getCarouselItems()
  ]);

  return (
    <CarouselClient schoolInfo={schoolInfo} carouselItems={carouselItems} />
  );
}
