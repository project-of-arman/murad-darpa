
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getVideos } from "@/lib/video-data";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import VideoTable from "@/components/admin/gallery/video-table";
import { toDataURL } from "@/lib/utils";

export default async function AdminVideosPage() {
  const videosRaw = await getVideos();

  const videos = videosRaw.map(video => ({
    ...video,
    thumbnail: video.thumbnail ? toDataURL(video.thumbnail as Buffer) : ''
  }));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>ভিডিও গ্যালারি ব্যবস্থাপনা</CardTitle>
        <Button asChild>
          <Link href="/admin/gallery/videos/new">
            <PlusCircle className="mx-2 h-4 w-4" />
            <span className="hidden sm:flex">নতুন ভিডিও যোগ করুন</span>
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <VideoTable videos={videos} />
      </CardContent>
    </Card>
  );
}
