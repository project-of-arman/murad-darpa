

import { SchoolInfo, CarouselItem as CarouselItemType } from "@/lib/school-data";
import CarouselClient from "./carousel-client";

interface HeroCarouselProps {
    schoolInfo: SchoolInfo | null;
    carouselItems: CarouselItemType[];
}

export default function HeroCarousel({ schoolInfo, carouselItems }: HeroCarouselProps) {
  
  if (!schoolInfo) {
      return null;
  }

  return (
    <CarouselClient schoolInfo={schoolInfo} carouselItems={carouselItems} />
  );
}
