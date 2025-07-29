

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
import { Button } from "../ui/button";
import Link from "next/link";
import { getTeachers, Teacher } from "@/lib/teacher-data";

export default function TeachersCarousel() {
  const [api, setApi] = React.useState<any>();
  const [teachers, setTeachers] = React.useState<Teacher[]>([]);

  React.useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, 5000); // autoplay
    return () => clearInterval(interval);
  }, [api]);
  
  React.useEffect(() => {
    async function fetchTeachersData() {
      const fetchedTeachers = await getTeachers();
      setTeachers(fetchedTeachers);
    }
    fetchTeachersData();
  }, []);

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-primary font-headline">আমাদের অভিজ্ঞ শিক্ষকগণ</h2>
        <Button asChild variant="outline">
          <Link href="/staff">সকলকে দেখুন</Link>
        </Button>
      </div>
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {teachers.map((teacher, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/4">
              <div className="p-1">
                 <Link href={`/teachers/${teacher.id}`}>
                    <Card className="group overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                    <CardContent className="relative flex aspect-[3/4] items-center justify-center p-0">
                        <Image
                        src={teacher.image}
                        alt={teacher.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint={teacher.dataAiHint}
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <h3 className="text-lg font-semibold text-white">{teacher.name}</h3>
                        <p className="text-sm text-primary-foreground/80">{teacher.role}</p>
                        </div>
                    </CardContent>
                    </Card>
                </Link>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </div>
  );
}
