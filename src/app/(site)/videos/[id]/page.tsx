
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { ArrowLeft } from "lucide-react";
import { getVideoById } from "@/lib/video-data";

export default async function VideoDetailsPage({ params }: { params: { id: string } }) {
  const video = await getVideoById(params.id);

  if (!video) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">ভিডিও পাওয়া যায়নি।</h1>
        <Button asChild className="mt-4">
          <Link href="/videos">
            <ArrowLeft className="mr-2 h-4 w-4" />
            গ্যালারিতে ফিরে যান
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white py-16">
        <div className="container mx-auto px-4 max-w-3xl">
            <div className="mb-8">
                <Button asChild variant="outline">
                  <Link href="/videos">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    গ্যালারিতে ফিরে যান
                  </Link>
                </Button>
            </div>
            <Card className="shadow-lg overflow-hidden">
                <div className="aspect-video">
                    <iframe
                        src={video.videoUrl}
                        title={video.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                    ></iframe>
                </div>
                <CardHeader>
                    <CardTitle className="text-3xl text-primary font-headline">{video.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground text-base leading-relaxed space-y-4">
                   <p>{video.description}</p>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
