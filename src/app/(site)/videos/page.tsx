
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { getVideos } from "@/lib/video-data";
import { PlayCircle } from "lucide-react";
import Link from "next/link";

export default async function VideosPage() {
  const videos = await getVideos();

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary font-headline">ভিডিও গ্যালারি</h1>
          <p className="text-muted-foreground mt-2">আমাদের প্রতিষ্ঠানের স্মরণীয় মুহূর্তগুলোর ভিডিও</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <Card key={video.id} className="group overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                <Link href={`/videos/${video.id}`} className="block w-full h-full">
                    <CardContent className="relative p-0 aspect-video">
                        <Image
                            src={video.thumbnail}
                            alt={video.title}
                            fill
                            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                            data-ai-hint={video.dataAiHint}
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <PlayCircle className="h-16 w-16 text-white" />
                        </div>
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                            <h3 className="text-lg font-semibold text-white">{video.title}</h3>
                        </div>
                    </CardContent>
                </Link>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
