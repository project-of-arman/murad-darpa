
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VideoForm } from "@/components/admin/gallery/video-form";

export default function NewVideoPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>নতুন ভিডিও যোগ করুন</CardTitle>
      </CardHeader>
      <CardContent>
        <VideoForm />
      </CardContent>
    </Card>
  );
}
