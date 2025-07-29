
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GalleryImageForm } from "@/components/admin/gallery/gallery-image-form";
import { getGalleryImageById } from "@/lib/gallery-data";
import { notFound } from "next/navigation";

export default async function EditGalleryImagePage({ params }: { params: { id: string } }) {
  const image = await getGalleryImageById(params.id);

  if (!image) {
    notFound();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>ছবি সম্পাদনা করুন</CardTitle>
      </CardHeader>
      <CardContent>
        <GalleryImageForm image={image} />
      </CardContent>
    </Card>
  );
}
