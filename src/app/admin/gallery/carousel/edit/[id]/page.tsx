
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CarouselForm } from "@/components/admin/gallery/carousel-form";
import { getCarouselItemById } from "@/lib/school-data";
import { notFound } from "next/navigation";
import { toDataURL } from "@/lib/utils";

export default async function EditCarouselItemPage({ params }: { params: { id: string } }) {
  const itemData = await getCarouselItemById(params.id);

  if (!itemData) {
    notFound();
  }

  const item = {
    ...itemData,
    src: itemData.src ? toDataURL(itemData.src as Buffer) : ''
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>স্লাইড সম্পাদনা করুন</CardTitle>
      </CardHeader>
      <CardContent>
        <CarouselForm item={item} />
      </CardContent>
    </Card>
  );
}
