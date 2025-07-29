
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GalleryImageForm } from "@/components/admin/gallery/gallery-image-form";

export default function NewGalleryImagePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>নতুন ছবি যোগ করুন</CardTitle>
      </CardHeader>
      <CardContent>
        <GalleryImageForm />
      </CardContent>
    </Card>
  );
}
