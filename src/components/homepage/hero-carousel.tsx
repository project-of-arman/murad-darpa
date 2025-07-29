
import * as React from "react";
import { getSchoolInfo, getCarouselItems, CarouselItem as CarouselItemType, SchoolInfo } from "@/lib/school-data";
import CarouselClient from "./carousel-client";

export default async function HeroCarousel() {
  const schoolInfo = await getSchoolInfo();
  const carouselItems = await getCarouselItems();

  return (
    <CarouselClient schoolInfo={schoolInfo} carouselItems={carouselItems} />
  );
}
