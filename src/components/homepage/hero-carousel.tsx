
import { getSchoolInfo, getCarouselItems } from "@/lib/school-data";
import CarouselClient from "./carousel-client";

export default async function HeroCarousel() {
  const [schoolInfo, carouselItems] = await Promise.all([
    getSchoolInfo(),
    getCarouselItems()
  ]);

  // Ensure schoolInfo is not null before passing to the client component.
  // The CarouselClient can handle an empty array for items, but it's good practice to ensure schoolInfo exists.
  if (!schoolInfo) {
      // You can return a placeholder or null if school info is essential and not found.
      // For the hero, it might be better to show nothing than a broken component.
      return null;
  }

  return (
    <CarouselClient schoolInfo={schoolInfo} carouselItems={carouselItems} />
  );
}
