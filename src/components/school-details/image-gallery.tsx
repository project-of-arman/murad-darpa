"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "../ui/button";
import Link from "next/link";
import { getGalleryImages, GalleryImage } from "@/lib/gallery-data";
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from '@/components/ui/skeleton';

const GallerySkeleton = () => (
    <div className="grid grid-cols-1 h-80 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
             <Skeleton key={i} className="h-full w-full rounded-lg" />
        ))}
    </div>
);

export default function ImageGallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      const data = await getGalleryImages();
      setImages(data);
      setLoading(false);
    };
    fetchImages();
  }, []);
  
  return (
    <section id="image-gallery">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-primary font-headline">ছবি গ্যালারি</h2>
        <Button asChild variant="outline">
          <Link href="/gallery">সব ছবি দেখুন</Link>
        </Button>
      </div>
       {loading ? (
            <GallerySkeleton />
        ) : (
          <div className="grid grid-cols-1 h-80 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {images.slice(0, 4).map((image) => (
               <Dialog key={image.id}>
                    <DialogTrigger asChild>
                        <Card className="overflow-hidden group shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer">
                            <CardContent className="p-0 relative h-full w-full">
                                <Image
                                    src={image.image_url}
                                    alt={image.title}
                                    fill
                                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                                    data-ai-hint={image.data_ai_hint}
                                />
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                                    <h3 className="font-semibold text-white text-sm">{image.title}</h3>
                                </div>
                            </CardContent>
                        </Card>
                    </DialogTrigger>
                    <DialogContent className="w-screen h-screen max-w-full max-h-screen p-0 m-0 bg-black/80 flex items-center justify-center border-none">
                        <DialogTitle className="sr-only">{image.title}</DialogTitle>
                        <div className="relative w-full h-full">
                            <Image
                                src={image.image_url}
                                alt={image.title}
                                fill
                                className="object-contain rounded-md"
                            />
                        </div>
                    </DialogContent>
                </Dialog>
            ))}
          </div>
        )}
    </section>
  );
}
