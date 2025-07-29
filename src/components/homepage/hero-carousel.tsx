
"use client";

import * as React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";
import { getSchoolInfo, SchoolInfo, getCarouselItems, CarouselItem as CarouselItemType } from "@/lib/school-data";
import { Skeleton } from "../ui/skeleton";


const HeroCarouselSkeleton = () => (
    <div className="relative h-[400px] md:h-[500px] lg:h-[600px] w-full">
        <Skeleton className="w-full h-full" />
    </div>
)

export default function HeroCarousel() {
  const [api, setApi] = React.useState<any>();
  const [current, setCurrent] = React.useState(0);
  const [schoolInfo, setSchoolInfo] = React.useState<SchoolInfo | null>(null);
  const [carouselItems, setCarouselItems] = React.useState<CarouselItemType[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchData() {
        setLoading(true);
        const info = await getSchoolInfo();
        setSchoolInfo(info);
        const items = await getCarouselItems();
        setCarouselItems(items);
        setLoading(false);
    }
    fetchData();
  }, []);

  React.useEffect(() => {
    if (!api || loading) {
      return;
    }

    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000); // Autoplay every 5 seconds

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
    
    return () => clearInterval(interval);
  }, [api, loading]);

  if (loading) {
    return <HeroCarouselSkeleton />;
  }

  return (
    <section className="w-full relative">
      <Carousel setApi={setApi} className="w-full" opts={{ loop: true }}>
        <CarouselContent>
          {carouselItems.map((item, index) => (
            <CarouselItem key={item.id}>
              <div className="relative h-[400px] md:h-[500px] lg:h-[600px] w-full">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover"
                  data-ai-hint={item.dataAiHint}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-black/60 flex items-start justify-start p-8 md:p-12 lg:p-16">
                  <div className="text-left text-white max-w-lg">
                    <h2 className=" font-bold mb-2 font-headline animate-fade-in-down">
                      {item.title}
                    </h2>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 hidden md:flex" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex" />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {carouselItems.map((_, index) => (
                <button
                    key={index}
                    onClick={() => api?.scrollTo(index)}
                    className={`h-2 w-2 rounded-full transition-all ${current === index ? 'w-4 bg-primary' : 'bg-white/50'}`}
                    aria-label={`Go to slide ${index + 1}`}
                />
            ))}
        </div>
      </Carousel>

      {schoolInfo && (
        <div className="absolute bottom-0 z-50 left-0 right-0 py-8 z-10">
              <Link href="/" className="container mx-auto px-4">
              <div className="flex items-center justify-start gap-4 text-left">
                  <Image
                  src={schoolInfo.logo_url}
                  alt="School Logo"
                  width={80}
                  height={80}
                  data-ai-hint="school logo"
                  className="rounded-full"
                  />
                  <div>
                  <h1 className="text-xl md:text-2xl font-bold  text-white font-headline">{schoolInfo.name}</h1>
                  <p className="text-base text-white bold ">{schoolInfo.address}</p>
                  </div>
              </div>
              </Link>
          </div>
      )}
    </section>
  );
}
