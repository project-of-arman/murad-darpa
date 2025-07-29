
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VideoForm } from "@/components/admin/gallery/video-form";
import { getVideoById } from "@/lib/video-data";
import { notFound } from "next/navigation";

export default async function EditVideoPage({ params }: { params: { id: string } }) {
  const video = await getVideoById(params.id);

  if (!video) {
    notFound();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>ভিডিও সম্পাদনা করুন</CardTitle>
      </CardHeader>
      <CardContent>
        <VideoForm video={video} />
      </CardContent>
    </Card>
  );
}
