
import Image from "next/image";
import { PlayCircle } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";
import { getVideos } from "@/lib/video-data";


export default async function VideoGallery() {
  const videos = await getVideos();

  return (
    <section id="video-gallery" className="w-full">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-primary font-headline">ভিডিও গ্যালারি</h2>
        <Button asChild variant="outline">
          <Link href="/videos">সব ভিডিও দেখুন</Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.slice(0, 3).map((video) => (
          <Link href={`/videos/${video.id}`} key={video.id}>
            <Card className="group overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer">
              <CardContent className="relative p-0 aspect-video">
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  data-ai-hint={video.dataAiHint}
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <PlayCircle className="h-16 w-16 text-white" />
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h3 className="text-lg font-semibold text-white">{video.title}</h3>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
