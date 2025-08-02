
"use client";

import * as React from "react";
import { getSchoolInfo, getCarouselItems, CarouselItem as CarouselItemType, SchoolInfo } from "@/lib/school-data";
import CarouselClient from "./carousel-client";
import { Skeleton } from "../ui/skeleton";

export default function HeroCarousel() {
  const [schoolInfo, setSchoolInfo] = React.useState<SchoolInfo | null>(null);
  const [carouselItems, setCarouselItems] = React.useState<CarouselItemType[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchData() {
        setLoading(true);
        const [info, items] = await Promise.all([
            getSchoolInfo(),
            getCarouselItems()
        ]);
        setSchoolInfo(info);
        setCarouselItems(items);
        setLoading(false);
    }
    fetchData();
  }, []);

  if (loading || !schoolInfo) {
      return (
          <section className="w-full relative">
              <Skeleton className="h-[400px] md:h-[500px] lg:h-[600px] w-full" />
          </section>
      );
  }

  return (
    <CarouselClient schoolInfo={schoolInfo} carouselItems={carouselItems} />
  );
}
