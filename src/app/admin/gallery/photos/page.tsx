
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getGalleryImages } from "@/lib/gallery-data";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import GalleryImageTable from "@/components/admin/gallery/gallery-image-table";

export default async function AdminPhotosPage() {
  const images = await getGalleryImages();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>ছবি গ্যালারি ব্যবস্থাপনা</CardTitle>
        <Button asChild>
          <Link href="/admin/gallery/photos/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            নতুন ছবি যোগ করুন
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <GalleryImageTable images={images} />
      </CardContent>
    </Card>
  );
}
